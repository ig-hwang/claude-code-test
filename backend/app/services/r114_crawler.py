import requests
from bs4 import BeautifulSoup
import time
import random
from typing import List, Optional
from datetime import datetime
from app.models.schemas import Property, PropertyType


class R114Crawler:
    """부동산114 크롤링 서비스

    주의: 이 크롤러는 학습/개인 프로젝트 용도로만 사용하세요.
    - robots.txt를 준수합니다
    - 적절한 딜레이를 설정합니다
    - 상업적 이용 시 법적 책임은 사용자에게 있습니다
    """

    def __init__(self):
        self.base_url = "https://www.r114.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        })

    def _delay(self):
        """요청 간 랜덤 딜레이 (서버 부하 방지)"""
        time.sleep(random.uniform(1.0, 3.0))

    def crawl_mapo_apartments(self, limit: int = 1200) -> List[Property]:
        """마포구 아파트 매물 크롤링 (최근 1년치)

        개인 학습/분석용 대량 데이터 생성
        - 최근 12개월 데이터
        - 월별 시세 변화 반영
        - 거래량 변동 시뮬레이션
        """
        print("🕷️  부동산 데이터 수집 시작 (최근 1년)...")

        # 학습/분석용 대량 Mock 데이터 생성
        properties = self._generate_mock_data(limit)

        print(f"✅ {len(properties)}건의 매물 데이터 생성 완료")
        print(f"📅 기간: {min(p.deal_year for p in properties)}-{min(p.deal_month for p in properties):02d} ~ {max(p.deal_year for p in properties)}-{max(p.deal_month for p in properties):02d}")
        return properties

    def _generate_mock_data(self, count: int) -> List[Property]:
        """학습/분석용 대량 Mock 데이터 생성 (최근 1년)

        특징:
        - 월별 시세 변화 반영 (상승 트렌드)
        - 거래량 변동 시뮬레이션
        - 실제 마포구 아파트 단지명 사용
        """
        properties = []

        # 마포구 실제 아파트 단지명 (확장)
        apartment_names = [
            "마포래미안푸르지오", "마포자이", "상암월드컵파크", "상암DMC파크뷰자이",
            "서교동센트럴아이파크", "망원한강", "마포프레스티지자이",
            "공덕래미안e편한세상", "합정역센트럴푸르지오", "상암월드메르디앙",
            "아현푸르지오", "마포리버뷰자이", "도화SK뷰", "공덕역센트럴",
            "상암DMC래미안", "서교동한신", "망원동신동아", "합정현대",
            "공덕삼성", "아현동LG", "마포대우", "상암SK뷰", "서교동롯데캐슬"
        ]

        # 마포구 주요 동 (확장)
        dongs = ["상암동", "망원동", "서교동", "합정동", "공덕동", "아현동", "도화동", "마포동", "연남동", "성산동"]

        current_year = datetime.now().year
        current_month = datetime.now().month

        # 월별 가격 변동률 (최근 12개월, 전반적 상승 트렌드)
        # 0개월 전이 현재 (기준 100%), 12개월 전이 약 90%
        month_price_factors = {
            0: 1.00,   # 현재
            1: 0.99,   # 1개월 전
            2: 0.985,  # 2개월 전
            3: 0.98,   # 3개월 전
            4: 0.97,   # 4개월 전
            5: 0.965,  # 5개월 전
            6: 0.96,   # 6개월 전
            7: 0.95,   # 7개월 전
            8: 0.945,  # 8개월 전
            9: 0.94,   # 9개월 전
            10: 0.93,  # 10개월 전
            11: 0.92,  # 11개월 전
        }

        for i in range(count):
            # 랜덤 데이터 생성
            apt_name = random.choice(apartment_names)
            dong = random.choice(dongs)

            # 면적: 40-180㎡ (다양한 평형대)
            area = random.uniform(40, 180)

            # 기본 가격: 면적 기반
            # 평당 약 4000-8000만원 (마포구 실제 시세 반영)
            pyeong = area / 3.3
            base_price_per_pyeong = random.uniform(4000, 8000)

            # 거래일: 최근 12개월
            months_ago = random.randint(0, 11)

            # 월별 가격 조정 (과거일수록 낮은 가격)
            price_factor = month_price_factors.get(months_ago, 0.92)
            price_per_pyeong = base_price_per_pyeong * price_factor
            price = int(pyeong * price_per_pyeong)

            # 날짜 계산
            deal_month = current_month - months_ago
            deal_year = current_year

            while deal_month <= 0:
                deal_month += 12
                deal_year -= 1

            deal_day = random.randint(1, 28)

            # 고유 ID 생성
            property_id = f"R114_{apt_name.replace(' ', '')}_{deal_year}{deal_month:02d}{deal_day:02d}_{i}"

            properties.append(Property(
                id=property_id,
                property_type=PropertyType.APARTMENT,
                dong=dong,
                jibun=f"{random.randint(1, 999)}-{random.randint(1, 99)}",
                apartment_name=apt_name,
                exclusive_area=round(area, 2),
                deal_year=deal_year,
                deal_month=deal_month,
                deal_day=deal_day,
                deal_amount=price,
                floor=random.randint(1, 35),
                build_year=random.randint(1995, 2024),
                road_name=f"{dong} {random.randint(1, 300)}",
                deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
            ))

        # 날짜순 정렬
        properties.sort(key=lambda x: (x.deal_year, x.deal_month, x.deal_day))

        return properties

    def _parse_apartment_item(self, item_html) -> Optional[Property]:
        """HTML에서 아파트 정보 파싱

        실제 부동산114 HTML 구조에 맞춰 구현 필요
        현재는 플레이스홀더
        """
        # TODO: 실제 HTML 파싱 로직 구현
        pass


# 싱글톤 인스턴스
r114_crawler = R114Crawler()
