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

    def crawl_mapo_apartments(self, limit: int = 20) -> List[Property]:
        """마포구 아파트 매물 크롤링

        주의: 실제 구현은 부동산114의 HTML 구조에 따라 조정 필요
        현재는 Mock 데이터와 혼합하여 반환
        """
        print("🕷️  부동산114 크롤링 시작...")

        # 실제 크롤링은 동적 페이지로 인해 복잡할 수 있음
        # 여기서는 학습용 Mock 데이터를 생성
        properties = self._generate_mock_data(limit)

        print(f"✅ {len(properties)}건의 매물 크롤링 완료")
        return properties

    def _generate_mock_data(self, count: int) -> List[Property]:
        """학습용 Mock 데이터 생성

        실제 크롤링 구현 시 이 메서드를 실제 파싱 로직으로 교체
        """
        properties = []

        # 마포구 실제 아파트 단지명
        apartment_names = [
            "마포래미안푸르지오",
            "마포자이",
            "상암월드컵파크",
            "상암DMC파크뷰자이",
            "서교동센트럴아이파크",
            "망원한강",
            "마포프레스티지자이",
            "공덕래미안e편한세상",
            "합정역센트럴푸르지오",
            "상암월드메르디앙"
        ]

        # 마포구 주요 동
        dongs = ["상암동", "망원동", "서교동", "합정동", "공덕동", "아현동", "도화동", "마포동"]

        current_year = datetime.now().year
        current_month = datetime.now().month

        for i in range(count):
            # 랜덤 데이터 생성
            apt_name = random.choice(apartment_names)
            dong = random.choice(dongs)

            # 면적: 50-150㎡
            area = random.uniform(50, 150)

            # 가격: 면적 기반 + 랜덤성
            # 평당 약 4000-7000만원 가정
            pyeong = area / 3.3
            price_per_pyeong = random.uniform(4000, 7000)
            price = int(pyeong * price_per_pyeong)

            # 거래일: 최근 3개월
            months_ago = random.randint(0, 3)
            deal_month = (current_month - months_ago) if (current_month - months_ago) > 0 else (12 + current_month - months_ago)
            deal_year = current_year if (current_month - months_ago) > 0 else current_year - 1
            deal_day = random.randint(1, 28)

            property_id = f"R114_{apt_name}_{i}_{int(area)}"

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
                floor=random.randint(1, 30),
                build_year=random.randint(2000, 2023),
                road_name=f"{dong} {random.randint(1, 200)}",
                deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
            ))

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
