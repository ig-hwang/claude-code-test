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

    def crawl_current_listings(self, limit: int = 200) -> List[Property]:
        """마포구 현재 매물 조회 (부동산114)

        개인 학습용 현재 판매 중인 매물 정보
        - 실거래가가 아닌 현재 호가 정보
        - 실제 크롤링 대신 Mock 데이터 사용
        """
        print("🕷️  부동산114 현재 매물 조회 중...")

        # 학습용 현재 매물 Mock 데이터 생성
        properties = self._generate_current_listings_mock(limit)

        print(f"✅ {len(properties)}건의 현재 매물 데이터 생성 완료")
        return properties

    def _generate_current_listings_mock(self, count: int) -> List[Property]:
        """학습용 현재 매물 Mock 데이터 생성

        특징:
        - 현재 판매 중인 매물 (호가)
        - 실거래가보다 약간 높은 가격
        - 최근 1개월 이내 등록된 매물
        """
        properties = []

        # 마포구 실제 아파트 단지명
        apartment_names = [
            "마포래미안푸르지오", "마포자이", "상암월드컵파크", "상암DMC파크뷰자이",
            "서교동센트럴아이파크", "망원한강", "마포프레스티지자이",
            "공덕래미안e편한세상", "합정역센트럴푸르지오", "상암월드메르디앙",
            "아현푸르지오", "마포리버뷰자이", "도화SK뷰", "공덕역센트럴",
            "상암DMC래미안", "서교동한신", "망원동신동아", "합정현대",
            "공덕삼성", "아현동LG", "마포대우", "상암SK뷰", "서교동롯데캐슬"
        ]

        # 마포구 주요 동
        dongs = ["상암동", "망원동", "서교동", "합정동", "공덕동", "아현동", "도화동", "마포동", "연남동", "성산동"]

        current_year = datetime.now().year
        current_month = datetime.now().month

        for i in range(count):
            # 랜덤 데이터 생성
            apt_name = random.choice(apartment_names)
            dong = random.choice(dongs)

            # 면적: 40-180㎡ (다양한 평형대)
            area = random.uniform(40, 180)

            # 호가: 실거래가보다 5-15% 높게 설정
            # 평당 가격을 면적별로 차등 적용 (작은 평형이 평당가 높음)
            pyeong = area / 3.3

            # 평형대별 평당가 설정 (만원)
            if pyeong < 20:  # 20평 미만
                asking_price_per_pyeong = random.uniform(6500, 8500)
            elif pyeong < 30:  # 20-30평
                asking_price_per_pyeong = random.uniform(5500, 7500)
            elif pyeong < 40:  # 30-40평
                asking_price_per_pyeong = random.uniform(4800, 6800)
            else:  # 40평 이상
                asking_price_per_pyeong = random.uniform(4200, 6200)

            # 호가는 실거래가보다 5-10% 높게
            markup = random.uniform(1.05, 1.10)
            asking_price = int(pyeong * asking_price_per_pyeong * markup)

            # 등록일: 최근 1개월 이내
            days_ago = random.randint(0, 30)

            deal_month = current_month
            deal_year = current_year
            deal_day = max(1, datetime.now().day - days_ago)

            if deal_day <= 0:
                deal_month -= 1
                if deal_month <= 0:
                    deal_month = 12
                    deal_year -= 1
                deal_day = 28 + deal_day

            # 고유 ID 생성
            property_id = f"R114_LISTING_{apt_name.replace(' ', '')}_{i}"

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
                deal_amount=asking_price,  # 호가
                floor=random.randint(1, 35),
                build_year=random.randint(1995, 2024),
                road_name=f"{dong} {random.randint(1, 300)}",
                deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
            ))

        # 최신순 정렬
        properties.sort(key=lambda x: (x.deal_year, x.deal_month, x.deal_day), reverse=True)

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
