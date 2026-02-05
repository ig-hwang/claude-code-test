from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.models.schemas import (
    PriceTrendAnalysis,
    MarketComparison,
    LocationAnalysis
)
from app.services.molit_api import molit_service
from app.services.price_analyzer import price_analyzer
from app.services.market_analyzer import market_analyzer
from app.services.location_analyzer import location_analyzer
from app.core.config import settings

router = APIRouter()


@router.get("/price-trend", response_model=PriceTrendAnalysis)
async def get_price_trend(
    apartment_name: Optional[str] = Query(None, description="아파트명"),
    min_area: Optional[float] = Query(None, ge=0, description="최소 면적(㎡)"),
    max_area: Optional[float] = Query(None, ge=0, description="최대 면적(㎡)"),
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    가격 추이 분석

    특정 아파트 또는 평형대의 가격 추이를 분석합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        if not all_properties:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        # 면적 범위 설정
        area_range = None
        if min_area is not None and max_area is not None:
            area_range = (min_area, max_area)

        # 가격 추이 분석
        analysis = price_analyzer.analyze_price_trend(
            all_properties,
            apartment_name=apartment_name,
            area_range=area_range
        )

        return analysis

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"가격 추이 분석 중 오류 발생: {str(e)}")


@router.get("/market-comparison", response_model=MarketComparison)
async def get_market_comparison(
    property_id: Optional[str] = Query(None, description="매물 ID"),
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    시세 비교 분석

    특정 매물의 시세를 동일 평형대 매물과 비교 분석합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        if not all_properties:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        # 특정 매물 시세 비교
        if property_id:
            property_found = next(
                (p for p in all_properties if p.id == property_id),
                None
            )

            if not property_found:
                raise HTTPException(status_code=404, detail="매물을 찾을 수 없습니다.")

            comparison = market_analyzer.compare_property_price(
                property_found, all_properties
            )
        else:
            # 전체 시세 통계
            market_stats = market_analyzer.analyze_market_stats(all_properties)
            comparison = MarketComparison(
                market_stats=market_stats
            )

        return comparison

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"시세 비교 중 오류 발생: {str(e)}")


@router.get("/market-ranking")
async def get_market_ranking(
    limit: int = Query(10, ge=1, le=50, description="조회 개수"),
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    시세 순위

    아파트별 평균 시세 순위를 조회합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        if not all_properties:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        # 시세 순위 계산
        ranking = market_analyzer.get_market_ranking(all_properties, limit)

        return ranking

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"시세 순위 조회 중 오류 발생: {str(e)}")


@router.get("/location/{property_id}", response_model=LocationAnalysis)
async def get_location_analysis(property_id: str):
    """
    입지 분석

    특정 매물의 입지를 종합 분석합니다.
    (역세권, 학군, 상권 접근성 등)
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, 12
        )

        # 매물 검색
        property_found = next(
            (p for p in all_properties if p.id == property_id),
            None
        )

        if not property_found:
            raise HTTPException(status_code=404, detail="매물을 찾을 수 없습니다.")

        # 입지 분석
        analysis = location_analyzer.analyze_location(property_found)

        return analysis

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"입지 분석 중 오류 발생: {str(e)}")


@router.get("/area-price-changes")
async def get_area_price_changes(
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    평형대별 가격 변화율

    평형대별 가격 변화율을 분석합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        if not all_properties:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        # 평형대별 가격 변화 분석
        changes = price_analyzer.calculate_area_price_changes(all_properties)

        return changes

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"가격 변화 분석 중 오류 발생: {str(e)}")
