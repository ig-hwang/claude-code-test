"""XML 기반 국토교통부 실거래가 API 서비스"""

import requests
import xml.etree.ElementTree as ET
import urllib3
from datetime import datetime, timedelta
from typing import List
from app.core.config import settings
from app.models.schemas import Property, PropertyType

# SSL 경고 비활성화
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class MolitAPIServiceXML:
    """XML 기반 국토교통부 실거래가 API 서비스"""

    def __init__(self):
        self.api_key = settings.MOLIT_API_KEY
        self.base_url = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade"

    def _parse_apartment_data(self, item) -> Property:
        """XML item을 Property 객체로 변환"""
        try:
            # XML 요소에서 텍스트 추출
            def get_text(tag_name, default=''):
                elem = item.find(tag_name)
                return elem.text.strip() if elem is not None and elem.text else default

            # 거래금액 파싱 (만원 단위, 쉼표 제거)
            deal_amount_str = get_text('dealAmount', '0').replace(',', '').replace(' ', '')
            deal_amount = int(deal_amount_str) if deal_amount_str.isdigit() else 0

            # 전용면적
            exclusive_area = float(get_text('excluUseAr', '0'))

            # 날짜
            deal_year = int(get_text('dealYear', str(datetime.now().year)))
            deal_month = int(get_text('dealMonth', '1'))
            deal_day = int(get_text('dealDay', '1'))

            # 층수
            floor_str = get_text('floor', '')
            floor = int(floor_str) if floor_str.isdigit() else None

            # 건축년도
            build_year_str = get_text('buildYear', '')
            build_year = int(build_year_str) if build_year_str.isdigit() else None

            # 아파트명
            apt_name = get_text('aptNm', 'UNKNOWN')

            # 고유 ID
            property_id = f"APT_{apt_name}_{deal_year}{deal_month:02d}{deal_day:02d}_{exclusive_area}_{deal_amount}"

            return Property(
                id=property_id,
                property_type=PropertyType.APARTMENT,
                dong=get_text('umdNm', ''),
                jibun=get_text('jibun', ''),
                apartment_name=apt_name,
                exclusive_area=exclusive_area,
                deal_year=deal_year,
                deal_month=deal_month,
                deal_day=deal_day,
                deal_amount=deal_amount,
                floor=floor,
                build_year=build_year,
                road_name='',  # XML에 도로명 필드 없음
                deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
            )
        except Exception as e:
            print(f"데이터 파싱 오류: {e}")
            return None

    async def fetch_apartment_trades(self, region_code: str, deal_ymd: str) -> List[Property]:
        """아파트 실거래 데이터 조회

        Args:
            region_code: 지역코드 (예: 11440)
            deal_ymd: 거래년월 (예: 202412)
        """
        if not self.api_key or self.api_key == "your_api_key_here":
            print("⚠️  API 키가 설정되지 않았습니다.")
            return []

        url = f"{self.base_url}/getRTMSDataSvcAptTrade"
        params = {
            "serviceKey": self.api_key,
            "LAWD_CD": region_code,
            "DEAL_YMD": deal_ymd,
            "numOfRows": "1000"
        }

        try:
            # SSL 검증 비활성화 (공공데이터포털 인증서 문제 해결)
            response = requests.get(url, params=params, verify=False, timeout=15)

            if response.status_code != 200:
                print(f"⚠️  API 오류 ({deal_ymd}): HTTP {response.status_code}")
                return []

            # XML 파싱
            root = ET.fromstring(response.text)

            # 에러 체크
            result_code = root.find('.//resultCode')
            if result_code is not None and result_code.text not in ['00', '000']:
                result_msg = root.find('.//resultMsg')
                print(f"⚠️  API 에러 ({deal_ymd}): {result_msg.text if result_msg is not None else 'Unknown'}")
                return []

            # 데이터 파싱
            items = root.findall('.//item')
            properties = []

            for item in items:
                prop = self._parse_apartment_data(item)
                if prop and prop.deal_amount > 0:  # 유효한 데이터만
                    properties.append(prop)

            print(f"📊 {deal_ymd}: {len(properties)}건 조회")
            return properties

        except Exception as e:
            print(f"⚠️  조회 오류 ({deal_ymd}): {e}")
            return []

    async def fetch_all_properties(self, region_code: str, months: int = 12) -> List[Property]:
        """최근 N개월 전체 매물 조회"""
        if not self.api_key or self.api_key == "your_api_key_here":
            print("⚠️  API 키가 설정되지 않았습니다.")
            return []

        all_properties = []
        current_date = datetime.now()

        # 월별로 데이터 조회
        for i in range(months):
            target_date = current_date - timedelta(days=30 * i)
            deal_ymd = target_date.strftime("%Y%m")

            properties = await self.fetch_apartment_trades(region_code, deal_ymd)
            all_properties.extend(properties)

        print(f"\n✅ 총 {len(all_properties)}건의 실거래가 데이터 조회 완료")
        return all_properties


# 싱글톤 인스턴스
molit_service_xml = MolitAPIServiceXML()
