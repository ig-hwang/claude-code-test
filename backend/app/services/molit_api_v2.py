"""PublicDataReader를 사용한 국토교통부 실거래가 API 서비스"""

from PublicDataReader import TransactionPrice
from datetime import datetime, timedelta
from typing import List
from app.core.config import settings
from app.models.schemas import Property, PropertyType


class MolitAPIServiceV2:
    """PublicDataReader 기반 국토교통부 실거래가 API 서비스"""

    def __init__(self):
        self.api_key = settings.MOLIT_API_KEY
        if self.api_key and self.api_key != "your_api_key_here":
            self.api = TransactionPrice(self.api_key)
        else:
            self.api = None
            print("⚠️  국토교통부 API 키가 설정되지 않았습니다.")

    def _parse_apartment_data(self, row) -> Property:
        """아파트 데이터 파싱 (PublicDataReader DataFrame row)"""
        try:
            # 거래금액 파싱 (만원 단위)
            deal_amount = str(row.get('거래금액', '0')).replace(',', '').replace(' ', '').strip()
            deal_amount = int(deal_amount) if deal_amount.isdigit() else 0

            # 전용면적
            exclusive_area = float(row.get('전용면적', 0))

            # 날짜 파싱
            deal_year = int(row.get('년', datetime.now().year))
            deal_month = int(row.get('월', 1))
            deal_day = int(row.get('일', 1))

            # 층수
            floor_str = str(row.get('층', '')).strip()
            floor = int(floor_str) if floor_str.isdigit() else None

            # 건축년도
            build_year_str = str(row.get('건축년도', '')).strip()
            build_year = int(build_year_str) if build_year_str.isdigit() else None

            # 고유 ID 생성
            apt_name = row.get('아파트', 'UNKNOWN')
            property_id = f"APT_{apt_name}_{deal_year}{deal_month:02d}{deal_day:02d}_{exclusive_area}"

            return Property(
                id=property_id,
                property_type=PropertyType.APARTMENT,
                dong=row.get('법정동', ''),
                jibun=row.get('지번', ''),
                apartment_name=apt_name,
                exclusive_area=exclusive_area,
                deal_year=deal_year,
                deal_month=deal_month,
                deal_day=deal_day,
                deal_amount=deal_amount,
                floor=floor,
                build_year=build_year,
                road_name=row.get('도로명', ''),
                deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
            )
        except Exception as e:
            print(f"데이터 파싱 오류: {e}, row: {row}")
            return None

    async def fetch_apartment_trades(self, region_code: str, start_month: str, end_month: str) -> List[Property]:
        """아파트 실거래 데이터 조회

        Args:
            region_code: 지역코드 (예: 11440)
            start_month: 시작월 (예: 202601)
            end_month: 종료월 (예: 202601)
        """
        if not self.api:
            print("⚠️  API 키가 설정되지 않았습니다.")
            return []

        try:
            # PublicDataReader로 데이터 조회
            df = self.api.get_data(
                property_type="아파트",
                trade_type="매매",
                sigungu_code=region_code,
                start_month=start_month,
                end_month=end_month
            )

            if df is None or len(df) == 0:
                print(f"📊 {start_month}~{end_month}: 데이터 없음")
                return []

            # DataFrame을 Property 객체 리스트로 변환
            properties = []
            for _, row in df.iterrows():
                prop = self._parse_apartment_data(row)
                if prop:
                    properties.append(prop)

            print(f"📊 {start_month}~{end_month}: {len(properties)}건 조회")
            return properties

        except Exception as e:
            print(f"⚠️  API 조회 오류 ({start_month}~{end_month}): {e}")
            return []

    async def fetch_all_properties(self, region_code: str, months: int = 12) -> List[Property]:
        """최근 N개월 전체 매물 조회"""
        if not self.api:
            print("⚠️  API 키가 설정되지 않았습니다.")
            return []

        all_properties = []
        current_date = datetime.now()

        # 월별로 데이터 조회
        for i in range(months):
            target_date = current_date - timedelta(days=30 * i)
            month_str = target_date.strftime("%Y%m")

            properties = await self.fetch_apartment_trades(
                region_code=region_code,
                start_month=month_str,
                end_month=month_str
            )

            all_properties.extend(properties)

        print(f"\n✅ 총 {len(all_properties)}건의 실거래가 데이터 조회 완료")
        return all_properties


# 싱글톤 인스턴스
molit_service_v2 = MolitAPIServiceV2()
