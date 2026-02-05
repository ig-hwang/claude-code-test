import math
from typing import List, Dict
from app.models.schemas import Property, LocationScore, LocationAnalysis


class LocationAnalyzer:
    """입지 분석 서비스"""

    # 마포구 주요 지하철역 좌표 (위도, 경도)
    SUBWAY_STATIONS = {
        "홍대입구역": (37.5571, 126.9245),
        "합정역": (37.5496, 126.9139),
        "상수역": (37.5479, 126.9227),
        "망원역": (37.5556, 126.9103),
        "공덕역": (37.5443, 126.9514),
        "애오개역": (37.5514, 126.9560),
        "마포역": (37.5397, 126.9453),
        "신촌역": (37.5551, 126.9367),
        "이대역": (37.5567, 126.9460)
    }

    # 마포구 주요 상권
    COMMERCIAL_AREAS = {
        "홍대상권": (37.5565, 126.9235),
        "합정상권": (37.5490, 126.9130),
        "공덕상권": (37.5445, 126.9510)
    }

    # 마포구 주요 학교 (예시 좌표)
    SCHOOLS = {
        "마포초등학교": (37.5434, 126.9503),
        "서강대학교": (37.5509, 126.9410),
        "홍익대학교": (37.5511, 126.9250),
        "이화여자대학교": (37.5616, 126.9465)
    }

    def calculate_distance(
        self, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        """두 좌표 간 거리 계산 (단위: 미터)"""

        # Haversine 공식
        R = 6371000  # 지구 반지름 (미터)

        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)

        a = (
            math.sin(delta_lat / 2) ** 2
            + math.cos(lat1_rad)
            * math.cos(lat2_rad)
            * math.sin(delta_lon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return R * c

    def calculate_subway_score(
        self, latitude: float, longitude: float
    ) -> tuple[float, str, float]:
        """역세권 점수 계산"""

        nearest_station = None
        min_distance = float("inf")

        for station_name, (lat, lon) in self.SUBWAY_STATIONS.items():
            distance = self.calculate_distance(latitude, longitude, lat, lon)
            if distance < min_distance:
                min_distance = distance
                nearest_station = station_name

        # 점수 계산
        # 500m 이내: 100점
        # 500-1000m: 80-100점
        # 1000-2000m: 40-80점
        # 2000m 이상: 0-40점

        if min_distance <= 500:
            score = 100
        elif min_distance <= 1000:
            score = 80 + (1000 - min_distance) / 500 * 20
        elif min_distance <= 2000:
            score = 40 + (2000 - min_distance) / 1000 * 40
        else:
            score = max(0, 40 - (min_distance - 2000) / 1000 * 10)

        return round(score, 1), nearest_station, round(min_distance, 0)

    def calculate_education_score(
        self, latitude: float, longitude: float
    ) -> float:
        """교육환경 점수 계산"""

        school_distances = []
        for school_name, (lat, lon) in self.SCHOOLS.items():
            distance = self.calculate_distance(latitude, longitude, lat, lon)
            school_distances.append(distance)

        min_distance = min(school_distances)

        # 500m 이내: 100점
        # 500-1000m: 70-100점
        # 1000-2000m: 40-70점
        # 2000m 이상: 0-40점

        if min_distance <= 500:
            score = 100
        elif min_distance <= 1000:
            score = 70 + (1000 - min_distance) / 500 * 30
        elif min_distance <= 2000:
            score = 40 + (2000 - min_distance) / 1000 * 30
        else:
            score = max(0, 40 - (min_distance - 2000) / 1000 * 10)

        return round(score, 1)

    def calculate_commercial_score(
        self, latitude: float, longitude: float
    ) -> float:
        """상권 점수 계산"""

        commercial_distances = []
        for area_name, (lat, lon) in self.COMMERCIAL_AREAS.items():
            distance = self.calculate_distance(latitude, longitude, lat, lon)
            commercial_distances.append(distance)

        min_distance = min(commercial_distances)

        # 1km 이내: 100점
        # 1-2km: 60-100점
        # 2-3km: 30-60점
        # 3km 이상: 0-30점

        if min_distance <= 1000:
            score = 100
        elif min_distance <= 2000:
            score = 60 + (2000 - min_distance) / 1000 * 40
        elif min_distance <= 3000:
            score = 30 + (3000 - min_distance) / 1000 * 30
        else:
            score = max(0, 30 - (min_distance - 3000) / 1000 * 10)

        return round(score, 1)

    def analyze_location(
        self,
        property: Property,
        latitude: float = None,
        longitude: float = None
    ) -> LocationAnalysis:
        """입지 종합 분석"""

        # 실제로는 지번/도로명 주소로부터 좌표를 얻어야 하지만,
        # 여기서는 마포구 중심 좌표를 기준으로 랜덤 오프셋 적용 (시연용)
        if latitude is None or longitude is None:
            # 마포구 중심 좌표 + 랜덤 오프셋
            import random
            latitude = 37.5490 + random.uniform(-0.02, 0.02)
            longitude = 126.9370 + random.uniform(-0.02, 0.02)

        # 역세권 점수
        subway_score, nearest_station, subway_distance = self.calculate_subway_score(
            latitude, longitude
        )

        # 교육환경 점수
        education_score = self.calculate_education_score(latitude, longitude)

        # 상권 점수
        commercial_score = self.calculate_commercial_score(latitude, longitude)

        # 종합 점수 (가중평균)
        total_score = (
            subway_score * 0.4 + education_score * 0.3 + commercial_score * 0.3
        )

        location_score = LocationScore(
            subway_score=subway_score,
            education_score=education_score,
            commercial_score=commercial_score,
            total_score=round(total_score, 1),
            nearest_subway=nearest_station,
            subway_distance=subway_distance
        )

        # 인근 지하철역 정보
        nearby_subways = []
        for station_name, (lat, lon) in self.SUBWAY_STATIONS.items():
            distance = self.calculate_distance(latitude, longitude, lat, lon)
            if distance <= 2000:  # 2km 이내만
                nearby_subways.append({
                    "name": station_name,
                    "distance": round(distance, 0),
                    "walk_time": round(distance / 80, 0)  # 도보 80m/분 가정
                })

        nearby_subways.sort(key=lambda x: x["distance"])

        # 인근 학교 정보
        nearby_schools = []
        for school_name, (lat, lon) in self.SCHOOLS.items():
            distance = self.calculate_distance(latitude, longitude, lat, lon)
            if distance <= 1500:  # 1.5km 이내만
                nearby_schools.append({
                    "name": school_name,
                    "distance": round(distance, 0),
                    "walk_time": round(distance / 80, 0)
                })

        nearby_schools.sort(key=lambda x: x["distance"])

        return LocationAnalysis(
            property_id=property.id,
            apartment_name=property.apartment_name,
            location_score=location_score,
            nearby_subways=nearby_subways[:5],  # 상위 5개
            nearby_schools=nearby_schools[:3] if nearby_schools else None
        )


# 싱글톤 인스턴스
location_analyzer = LocationAnalyzer()
