import httpx
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional
from app.core.config import settings
from app.models.schemas import Property, PropertyType


class MolitAPIService:
    """국토교통부 실거래가 API 서비스"""

    def __init__(self):
        self.base_url = settings.MOLIT_API_BASE_URL
        self.api_key = settings.MOLIT_API_KEY
        self.cache_dir = Path(settings.CACHE_DIR)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_duration = settings.CACHE_DURATION

    def _get_cache_path(self, cache_key: str) -> Path:
        """캐시 파일 경로 반환"""
        return self.cache_dir / f"{cache_key}.json"

    def _is_cache_valid(self, cache_path: Path) -> bool:
        """캐시 유효성 검사"""
        if not cache_path.exists():
            return False

        cache_time = datetime.fromtimestamp(cache_path.stat().st_mtime)
        return (datetime.now() - cache_time).seconds < self.cache_duration

    def _save_cache(self, cache_key: str, data: dict):
        """캐시 저장"""
        cache_path = self._get_cache_path(cache_key)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def _load_cache(self, cache_key: str) -> Optional[dict]:
        """캐시 로드"""
        cache_path = self._get_cache_path(cache_key)
        if self._is_cache_valid(cache_path):
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return None

    async def _fetch_data(self, endpoint: str, params: dict) -> dict:
        """API 데이터 요청"""
        # API 키가 없거나 기본값인 경우 빈 결과 반환
        if not self.api_key or self.api_key == "your_api_key_here":
            print("⚠️  국토교통부 API 키가 설정되지 않았습니다. .env 파일에 MOLIT_API_KEY를 설정해주세요.")
            return {"response": {"body": {"items": {"item": []}}}}

        params["serviceKey"] = self.api_key

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(f"{self.base_url}/{endpoint}", params=params)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"API 요청 실패: {e}")
                return {"response": {"body": {"items": {"item": []}}}}

    def _parse_apartment_data(self, item: dict) -> Property:
        """아파트 데이터 파싱"""
        deal_amount = item.get("거래금액", "0").replace(",", "").strip()
        exclusive_area = float(item.get("전용면적", "0"))

        deal_year = int(item.get("년", datetime.now().year))
        deal_month = int(item.get("월", 1))
        deal_day = int(item.get("일", 1))

        property_id = f"APT_{item.get('아파트', 'UNKNOWN')}_{deal_year}{deal_month:02d}{deal_day:02d}_{exclusive_area}"

        return Property(
            id=property_id,
            property_type=PropertyType.APARTMENT,
            dong=item.get("법정동", ""),
            jibun=item.get("지번", ""),
            apartment_name=item.get("아파트", ""),
            exclusive_area=exclusive_area,
            deal_year=deal_year,
            deal_month=deal_month,
            deal_day=deal_day,
            deal_amount=int(deal_amount) if deal_amount else 0,
            floor=int(item.get("층", 0)) if item.get("층") else None,
            build_year=int(item.get("건축년도", 0)) if item.get("건축년도") else None,
            road_name=item.get("도로명", ""),
            deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
        )

    def _parse_officetel_data(self, item: dict) -> Property:
        """오피스텔 데이터 파싱"""
        deal_amount = item.get("거래금액", "0").replace(",", "").strip()
        exclusive_area = float(item.get("전용면적", "0"))

        deal_year = int(item.get("년", datetime.now().year))
        deal_month = int(item.get("월", 1))
        deal_day = int(item.get("일", 1))

        property_id = f"OFT_{item.get('단지명', 'UNKNOWN')}_{deal_year}{deal_month:02d}{deal_day:02d}_{exclusive_area}"

        return Property(
            id=property_id,
            property_type=PropertyType.OFFICETEL,
            dong=item.get("법정동", ""),
            jibun=item.get("지번", ""),
            apartment_name=item.get("단지명", "오피스텔"),
            exclusive_area=exclusive_area,
            deal_year=deal_year,
            deal_month=deal_month,
            deal_day=deal_day,
            deal_amount=int(deal_amount) if deal_amount else 0,
            floor=int(item.get("층", 0)) if item.get("층") else None,
            build_year=int(item.get("건축년도", 0)) if item.get("건축년도") else None,
            road_name=item.get("도로명", ""),
            deal_date=f"{deal_year}-{deal_month:02d}-{deal_day:02d}"
        )

    async def fetch_apartment_trades(
        self, region_code: str, deal_ymd: str
    ) -> List[Property]:
        """아파트 실거래 데이터 조회"""
        cache_key = f"apt_{region_code}_{deal_ymd}"
        cached_data = self._load_cache(cache_key)

        if cached_data:
            return [Property(**item) for item in cached_data]

        params = {
            "LAWD_CD": region_code,
            "DEAL_YMD": deal_ymd,
            "numOfRows": "1000"
        }

        data = await self._fetch_data("getRTMSDataSvcAptTradeDev", params)

        items = data.get("response", {}).get("body", {}).get("items", {})
        if isinstance(items, dict):
            items = items.get("item", [])
        if not isinstance(items, list):
            items = [items] if items else []

        properties = [self._parse_apartment_data(item) for item in items]

        # 캐시 저장
        self._save_cache(cache_key, [p.model_dump() for p in properties])

        return properties

    async def fetch_officetel_trades(
        self, region_code: str, deal_ymd: str
    ) -> List[Property]:
        """오피스텔 실거래 데이터 조회"""
        cache_key = f"oft_{region_code}_{deal_ymd}"
        cached_data = self._load_cache(cache_key)

        if cached_data:
            return [Property(**item) for item in cached_data]

        params = {
            "LAWD_CD": region_code,
            "DEAL_YMD": deal_ymd,
            "numOfRows": "1000"
        }

        data = await self._fetch_data("getRTMSDataSvcOffiTrade", params)

        items = data.get("response", {}).get("body", {}).get("items", {})
        if isinstance(items, dict):
            items = items.get("item", [])
        if not isinstance(items, list):
            items = [items] if items else []

        properties = [self._parse_officetel_data(item) for item in items]

        # 캐시 저장
        self._save_cache(cache_key, [p.model_dump() for p in properties])

        return properties

    async def fetch_all_properties(
        self, region_code: str, months: int = 12
    ) -> List[Property]:
        """최근 N개월 전체 매물 조회"""
        all_properties = []
        current_date = datetime.now()

        for i in range(months):
            target_date = current_date - timedelta(days=30 * i)
            deal_ymd = target_date.strftime("%Y%m")

            # 아파트
            apt_properties = await self.fetch_apartment_trades(region_code, deal_ymd)
            all_properties.extend(apt_properties)

            # 오피스텔
            oft_properties = await self.fetch_officetel_trades(region_code, deal_ymd)
            all_properties.extend(oft_properties)

        return all_properties


# 싱글톤 인스턴스
molit_service = MolitAPIService()
