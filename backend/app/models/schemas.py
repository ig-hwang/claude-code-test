from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PropertyType(str, Enum):
    """매물 유형"""
    APARTMENT = "아파트"
    OFFICETEL = "오피스텔"
    MULTIPLEX = "연립다세대"


class Property(BaseModel):
    """부동산 매물 정보"""
    id: str
    property_type: PropertyType
    dong: str  # 동
    jibun: str  # 지번
    apartment_name: str  # 아파트명
    exclusive_area: float  # 전용면적(㎡)
    deal_year: int  # 거래년도
    deal_month: int  # 거래월
    deal_day: int  # 거래일
    deal_amount: int  # 거래금액(만원)
    floor: Optional[int] = None  # 층
    build_year: Optional[int] = None  # 건축년도
    road_name: Optional[str] = None  # 도로명
    deal_date: Optional[str] = None  # 거래일자 (YYYY-MM-DD)

    # 건축물 상세 정보
    floor_area_ratio: Optional[float] = None  # 용적률(%)
    building_coverage_ratio: Optional[float] = None  # 건폐율(%)
    land_share: Optional[float] = None  # 대지지분(㎡)
    total_households: Optional[int] = None  # 총 세대수
    total_parking: Optional[int] = None  # 총 주차대수

    class Config:
        use_enum_values = True


class PriceHistory(BaseModel):
    """가격 이력"""
    date: str  # YYYY-MM
    avg_price: float  # 평균 가격
    min_price: float  # 최저 가격
    max_price: float  # 최고 가격
    deal_count: int  # 거래 건수
    price_change_rate: Optional[float] = None  # 전월 대비 변동률(%)


class MarketStats(BaseModel):
    """시장 통계"""
    area_range: str  # 평형대 (예: "20-30평")
    avg_price: float  # 평균 가격
    avg_price_per_pyeong: float  # 평당 가격
    min_price: float  # 최저가
    max_price: float  # 최고가
    deal_count: int  # 거래 건수
    price_distribution: Optional[dict] = None  # 가격 분포


class LocationScore(BaseModel):
    """입지 점수"""
    subway_score: float = Field(ge=0, le=100)  # 역세권 점수
    education_score: float = Field(ge=0, le=100)  # 교육환경 점수
    commercial_score: float = Field(ge=0, le=100)  # 상권 점수
    total_score: float = Field(ge=0, le=100)  # 종합 점수
    nearest_subway: Optional[str] = None  # 최근접 지하철역
    subway_distance: Optional[float] = None  # 지하철역 거리(m)


class LocationAnalysis(BaseModel):
    """입지 분석"""
    property_id: str
    apartment_name: str
    location_score: LocationScore
    nearby_subways: List[dict]  # 인근 지하철역 정보
    nearby_schools: Optional[List[dict]] = None  # 인근 학교 정보


class PriceTrendAnalysis(BaseModel):
    """가격 추이 분석"""
    apartment_name: Optional[str] = None
    area_range: Optional[str] = None
    period: str  # 분석 기간
    price_history: List[PriceHistory]
    current_avg_price: float
    mom_change_rate: Optional[float] = None  # 전월 대비 변동률
    yoy_change_rate: Optional[float] = None  # 전년 대비 변동률
    trend: str  # 추세 (상승/하락/보합)


class MarketComparison(BaseModel):
    """시세 비교"""
    property_id: Optional[str] = None
    apartment_name: Optional[str] = None
    exclusive_area: Optional[float] = None
    current_price: Optional[float] = None
    market_stats: List[MarketStats]
    price_position: Optional[str] = None  # 시세 포지션 (저가/중간/고가)
    comparison_summary: Optional[str] = None


class PropertyListResponse(BaseModel):
    """매물 목록 응답"""
    total: int
    properties: List[Property]
    page: int = 1
    page_size: int = 50


class PropertyStatsResponse(BaseModel):
    """매물 통계 응답"""
    total_properties: int
    avg_price: float
    avg_area: float
    price_range: dict
    area_distribution: dict
    property_type_distribution: dict
