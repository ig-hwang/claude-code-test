from typing import List, Optional
from collections import defaultdict
from datetime import datetime
from app.models.schemas import Property, PriceHistory, PriceTrendAnalysis


class PriceAnalyzer:
    """가격 추이 분석 서비스"""

    def analyze_price_trend(
        self,
        properties: List[Property],
        apartment_name: Optional[str] = None,
        area_range: Optional[tuple] = None
    ) -> PriceTrendAnalysis:
        """가격 추이 분석"""

        # 필터링
        filtered_properties = properties
        if apartment_name:
            filtered_properties = [
                p for p in filtered_properties
                if p.apartment_name == apartment_name
            ]

        if area_range:
            min_area, max_area = area_range
            filtered_properties = [
                p for p in filtered_properties
                if min_area <= p.exclusive_area <= max_area
            ]

        if not filtered_properties:
            return PriceTrendAnalysis(
                apartment_name=apartment_name,
                area_range=f"{area_range[0]}-{area_range[1]}㎡" if area_range else None,
                period="12개월",
                price_history=[],
                current_avg_price=0,
                trend="데이터 없음"
            )

        # 월별 그룹화
        monthly_data = defaultdict(list)
        for prop in filtered_properties:
            month_key = f"{prop.deal_year}-{prop.deal_month:02d}"
            monthly_data[month_key].append(prop.deal_amount)

        # 월별 통계 계산
        price_history = []
        sorted_months = sorted(monthly_data.keys())

        for i, month in enumerate(sorted_months):
            prices = monthly_data[month]
            avg_price = sum(prices) / len(prices)

            # 전월 대비 변동률 계산
            price_change_rate = None
            if i > 0:
                prev_month = sorted_months[i - 1]
                prev_avg = sum(monthly_data[prev_month]) / len(monthly_data[prev_month])
                price_change_rate = ((avg_price - prev_avg) / prev_avg) * 100

            price_history.append(
                PriceHistory(
                    date=month,
                    avg_price=avg_price,
                    min_price=min(prices),
                    max_price=max(prices),
                    deal_count=len(prices),
                    price_change_rate=price_change_rate
                )
            )

        # 현재 평균 가격 (최근 월)
        current_avg_price = price_history[-1].avg_price if price_history else 0

        # 전월 대비 변동률
        mom_change_rate = price_history[-1].price_change_rate if price_history else None

        # 전년 대비 변동률
        yoy_change_rate = None
        if len(price_history) >= 12:
            year_ago_price = price_history[-12].avg_price
            yoy_change_rate = ((current_avg_price - year_ago_price) / year_ago_price) * 100

        # 추세 판단
        trend = "보합"
        if mom_change_rate:
            if mom_change_rate > 2:
                trend = "상승"
            elif mom_change_rate < -2:
                trend = "하락"

        return PriceTrendAnalysis(
            apartment_name=apartment_name,
            area_range=f"{area_range[0]}-{area_range[1]}㎡" if area_range else None,
            period="12개월",
            price_history=price_history,
            current_avg_price=current_avg_price,
            mom_change_rate=mom_change_rate,
            yoy_change_rate=yoy_change_rate,
            trend=trend
        )

    def calculate_area_price_changes(
        self, properties: List[Property]
    ) -> dict:
        """평형대별 가격 변화율 계산"""

        # 평형대별 그룹화 (3.3㎡ = 1평)
        area_groups = {
            "10평 이하": (0, 33),
            "10-20평": (33, 66),
            "20-30평": (66, 99),
            "30-40평": (99, 132),
            "40평 이상": (132, 999)
        }

        results = {}
        for group_name, (min_area, max_area) in area_groups.items():
            group_properties = [
                p for p in properties
                if min_area <= p.exclusive_area < max_area
            ]

            if group_properties:
                analysis = self.analyze_price_trend(
                    group_properties,
                    area_range=(min_area, max_area)
                )
                results[group_name] = {
                    "current_avg_price": analysis.current_avg_price,
                    "mom_change_rate": analysis.mom_change_rate,
                    "yoy_change_rate": analysis.yoy_change_rate,
                    "trend": analysis.trend,
                    "deal_count": len(group_properties)
                }

        return results


# 싱글톤 인스턴스
price_analyzer = PriceAnalyzer()
