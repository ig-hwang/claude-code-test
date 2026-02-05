from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.models.schemas import (
    Property,
    PropertyListResponse,
    PropertyStatsResponse,
    PropertyType
)
from app.services.molit_api import molit_service
from app.core.config import settings

router = APIRouter()


@router.get("", response_model=PropertyListResponse)
async def get_properties(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(50, ge=1, le=100, description="페이지 크기"),
    property_type: Optional[PropertyType] = Query(None, description="매물 유형"),
    min_area: Optional[float] = Query(None, ge=0, description="최소 면적(㎡)"),
    max_area: Optional[float] = Query(None, ge=0, description="최대 면적(㎡)"),
    min_price: Optional[int] = Query(None, ge=0, description="최소 가격(만원)"),
    max_price: Optional[int] = Query(None, ge=0, description="최대 가격(만원)"),
    apartment_name: Optional[str] = Query(None, description="아파트명"),
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    매물 목록 조회

    마포구의 부동산 실거래 매물 목록을 조회합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        # 필터링
        filtered_properties = all_properties

        if property_type:
            filtered_properties = [
                p for p in filtered_properties
                if p.property_type == property_type
            ]

        if min_area is not None:
            filtered_properties = [
                p for p in filtered_properties
                if p.exclusive_area >= min_area
            ]

        if max_area is not None:
            filtered_properties = [
                p for p in filtered_properties
                if p.exclusive_area <= max_area
            ]

        if min_price is not None:
            filtered_properties = [
                p for p in filtered_properties
                if p.deal_amount >= min_price
            ]

        if max_price is not None:
            filtered_properties = [
                p for p in filtered_properties
                if p.deal_amount <= max_price
            ]

        if apartment_name:
            filtered_properties = [
                p for p in filtered_properties
                if apartment_name.lower() in p.apartment_name.lower()
            ]

        # 페이지네이션
        total = len(filtered_properties)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_properties = filtered_properties[start_idx:end_idx]

        return PropertyListResponse(
            total=total,
            properties=paginated_properties,
            page=page,
            page_size=page_size
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"매물 조회 중 오류 발생: {str(e)}")


@router.get("/{property_id}", response_model=Property)
async def get_property(property_id: str):
    """
    매물 상세 조회

    특정 매물의 상세 정보를 조회합니다.
    """
    try:
        # 전체 매물 조회 (캐시 활용)
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

        return property_found

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"매물 조회 중 오류 발생: {str(e)}")


@router.get("/stats/summary", response_model=PropertyStatsResponse)
async def get_property_stats(
    property_type: Optional[PropertyType] = Query(None, description="매물 유형"),
    months: int = Query(12, ge=1, le=24, description="조회 개월 수")
):
    """
    매물 통계 요약

    매물의 전반적인 통계 정보를 제공합니다.
    """
    try:
        # 전체 매물 조회
        all_properties = await molit_service.fetch_all_properties(
            settings.MAPO_REGION_CODE, months
        )

        # 필터링
        if property_type:
            all_properties = [
                p for p in all_properties
                if p.property_type == property_type
            ]

        if not all_properties:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        # 통계 계산
        valid_properties = [p for p in all_properties if p.deal_amount > 0]

        total_properties = len(valid_properties)
        avg_price = sum(p.deal_amount for p in valid_properties) / total_properties
        avg_area = sum(p.exclusive_area for p in valid_properties) / total_properties

        prices = [p.deal_amount for p in valid_properties]
        price_range = {
            "min": min(prices),
            "max": max(prices),
            "median": sorted(prices)[len(prices) // 2]
        }

        # 면적 분포
        area_distribution = {
            "10평 이하": len([p for p in valid_properties if p.exclusive_area < 33]),
            "10-20평": len([p for p in valid_properties if 33 <= p.exclusive_area < 66]),
            "20-30평": len([p for p in valid_properties if 66 <= p.exclusive_area < 99]),
            "30-40평": len([p for p in valid_properties if 99 <= p.exclusive_area < 132]),
            "40평 이상": len([p for p in valid_properties if p.exclusive_area >= 132])
        }

        # 매물 유형 분포
        property_type_distribution = {}
        for prop in valid_properties:
            prop_type = prop.property_type.value
            property_type_distribution[prop_type] = property_type_distribution.get(prop_type, 0) + 1

        return PropertyStatsResponse(
            total_properties=total_properties,
            avg_price=avg_price,
            avg_area=avg_area,
            price_range=price_range,
            area_distribution=area_distribution,
            property_type_distribution=property_type_distribution
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"통계 조회 중 오류 발생: {str(e)}")
