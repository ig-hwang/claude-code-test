"""아파트 건축 정보 서비스"""

import json
import os
from typing import Dict, Optional
from app.models.schemas import Property


class BuildingInfoService:
    """아파트 건축 정보 관리 서비스"""

    def __init__(self):
        self.building_data: Dict[str, dict] = {}
        self.load_building_info()

    def load_building_info(self):
        """건축 정보 JSON 파일 로드"""
        try:
            data_path = os.path.join(
                os.path.dirname(__file__),
                '..',
                'data',
                'apartment_building_info.json'
            )

            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    self.building_data = json.load(f)
                print(f"✅ {len(self.building_data)}개 아파트 건축 정보 로드 완료")
            else:
                print(f"⚠️  건축 정보 파일 없음: {data_path}")
        except Exception as e:
            print(f"⚠️  건축 정보 로드 실패: {e}")

    def normalize_apartment_name(self, name: str) -> str:
        """아파트명 정규화 (공백, 특수문자 제거)"""
        if not name:
            return ""

        # 공백 제거
        normalized = name.replace(" ", "").replace("　", "")

        # 흔한 변형 처리
        replacements = {
            "래미안": "래미안",
            "레미안": "래미안",
            "푸르지오": "푸르지오",
            "SK뷰": "sk뷰",
            "DMC": "dmc",
            "e편한세상": "e편한세상",
            "E편한세상": "e편한세상",
        }

        for old, new in replacements.items():
            normalized = normalized.replace(old, new)

        return normalized.lower()

    def get_building_info(self, apartment_name: str) -> Optional[dict]:
        """아파트 건축 정보 조회"""
        if not apartment_name:
            return None

        # 정확한 매칭 시도
        if apartment_name in self.building_data:
            return self.building_data[apartment_name]

        # 정규화된 이름으로 매칭 시도
        normalized_search = self.normalize_apartment_name(apartment_name)

        for stored_name, info in self.building_data.items():
            normalized_stored = self.normalize_apartment_name(stored_name)
            if normalized_search in normalized_stored or normalized_stored in normalized_search:
                return info

        return None

    def calculate_land_share(self, exclusive_area: float, total_land_area: float, total_households: int) -> float:
        """
        대지지분 계산

        대지지분 = (전용면적 비율) × 총 대지면적

        Args:
            exclusive_area: 전용면적 (㎡)
            total_land_area: 총 대지면적 (㎡)
            total_households: 총 세대수

        Returns:
            대지지분 (㎡)
        """
        if total_households == 0:
            return 0.0

        # 평균 전용면적 가정 (85㎡)
        avg_area = 85.0

        # 대지지분 = (해당 세대 전용면적 / 평균 전용면적) × (총 대지면적 / 총 세대수)
        land_share = (exclusive_area / avg_area) * (total_land_area / total_households)

        return round(land_share, 2)

    def enrich_property(self, property: Property) -> Property:
        """
        Property 객체에 건축 정보 추가

        Args:
            property: 원본 Property 객체

        Returns:
            건축 정보가 추가된 Property 객체
        """
        building_info = self.get_building_info(property.apartment_name)

        if building_info:
            # 건축 정보 추가
            property.floor_area_ratio = building_info.get('floor_area_ratio')
            property.building_coverage_ratio = building_info.get('building_coverage_ratio')
            property.total_households = building_info.get('total_households')
            property.total_parking = building_info.get('total_parking')

            # 대지지분 계산
            total_land_area = building_info.get('total_land_area')
            total_households = building_info.get('total_households')

            if total_land_area and total_households:
                property.land_share = self.calculate_land_share(
                    property.exclusive_area,
                    total_land_area,
                    total_households
                )

            # 건축년도가 없으면 DB에서 가져오기
            if not property.build_year:
                property.build_year = building_info.get('build_year')

        return property


# 싱글톤 인스턴스
building_info_service = BuildingInfoService()
