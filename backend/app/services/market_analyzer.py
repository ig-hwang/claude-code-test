from typing import List, Optional
from collections import defaultdict
from app.models.schemas import Property, MarketStats, MarketComparison


class MarketAnalyzer:
    """시세 비교 분석 서비스"""

    def analyze_market_stats(
        self, properties: List[Property]
    ) -> List[MarketStats]:
        """평형대별 시장 통계 분석"""

        # 평형대별 그룹화
        area_groups = {
            "10평 이하": (0, 33),
            "10-20평": (33, 66),
            "20-30평": (66, 99),
            "30-40평": (99, 132),
            "40평 이상": (132, 999)
        }

        stats_list = []

        for group_name, (min_area, max_area) in area_groups.items():
            group_properties = [
                p for p in properties
                if min_area <= p.exclusive_area < max_area and p.deal_amount > 0
            ]

            if not group_properties:
                continue

            prices = [p.deal_amount for p in group_properties]
            avg_price = sum(prices) / len(prices)

            # 평당 가격 계산 (1평 = 3.3㎡)
            avg_area = sum(p.exclusive_area for p in group_properties) / len(group_properties)
            avg_pyeong = avg_area / 3.3
            avg_price_per_pyeong = avg_price / avg_pyeong if avg_pyeong > 0 else 0

            # 가격 분포 계산
            price_distribution = self._calculate_price_distribution(prices)

            stats_list.append(
                MarketStats(
                    area_range=group_name,
                    avg_price=avg_price,
                    avg_price_per_pyeong=avg_price_per_pyeong,
                    min_price=min(prices),
                    max_price=max(prices),
                    deal_count=len(prices),
                    price_distribution=price_distribution
                )
            )

        return stats_list

    def compare_property_price(
        self,
        property: Property,
        all_properties: List[Property]
    ) -> MarketComparison:
        """특정 매물의 시세 비교"""

        # 동일 평형대 매물 필터링 (±10㎡)
        similar_properties = [
            p for p in all_properties
            if abs(p.exclusive_area - property.exclusive_area) <= 10
            and p.deal_amount > 0
        ]

        if not similar_properties:
            return MarketComparison(
                property_id=property.id,
                apartment_name=property.apartment_name,
                exclusive_area=property.exclusive_area,
                current_price=property.deal_amount,
                market_stats=[],
                price_position="데이터 부족",
                comparison_summary="비교 가능한 유사 매물이 없습니다."
            )

        # 시장 통계
        market_stats = self.analyze_market_stats(similar_properties)

        # 가격 포지션 판단
        prices = [p.deal_amount for p in similar_properties]
        avg_price = sum(prices) / len(prices)

        if property.deal_amount < avg_price * 0.9:
            price_position = "저가"
        elif property.deal_amount > avg_price * 1.1:
            price_position = "고가"
        else:
            price_position = "중간가"

        # 비교 요약
        price_diff_rate = ((property.deal_amount - avg_price) / avg_price) * 100
        comparison_summary = (
            f"유사 매물 {len(similar_properties)}건 대비 "
            f"{abs(price_diff_rate):.1f}% {'높습니다' if price_diff_rate > 0 else '낮습니다'}."
        )

        return MarketComparison(
            property_id=property.id,
            apartment_name=property.apartment_name,
            exclusive_area=property.exclusive_area,
            current_price=property.deal_amount,
            market_stats=market_stats,
            price_position=price_position,
            comparison_summary=comparison_summary
        )

    def get_market_ranking(
        self, properties: List[Property], limit: int = 10
    ) -> dict:
        """시세 순위 조회"""

        # 아파트별 평균 가격 계산
        apt_prices = defaultdict(list)
        for prop in properties:
            if prop.deal_amount > 0:
                apt_prices[prop.apartment_name].append(prop.deal_amount)

        apt_avg_prices = {
            name: sum(prices) / len(prices)
            for name, prices in apt_prices.items()
        }

        # 가격 순위
        sorted_by_price = sorted(
            apt_avg_prices.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return {
            "highest_price": sorted_by_price[:limit],
            "lowest_price": sorted_by_price[-limit:],
            "total_apartments": len(apt_avg_prices)
        }

    def _calculate_price_distribution(self, prices: List[float]) -> dict:
        """가격 분포 계산"""
        if not prices:
            return {}

        min_price = min(prices)
        max_price = max(prices)
        price_range = max_price - min_price

        if price_range == 0:
            return {"single_price": min_price}

        # 5개 구간으로 분할
        interval = price_range / 5
        distribution = defaultdict(int)

        for price in prices:
            bucket = int((price - min_price) / interval)
            if bucket == 5:
                bucket = 4  # 최댓값 처리
            distribution[f"구간{bucket + 1}"] += 1

        return dict(distribution)


# 싱글톤 인스턴스
market_analyzer = MarketAnalyzer()
