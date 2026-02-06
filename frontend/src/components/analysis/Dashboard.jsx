import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Home } from 'lucide-react';
import { formatPrice, formatChangeRate, getChangeRateColor } from '../../utils/formatters';

const Dashboard = ({ properties, loading, error }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    avgPrice: 0,
    changeRate: 0,
    totalCount: 0,
    trend: 'stable',
  });

  useEffect(() => {
    if (properties && properties.length > 0) {
      calculateMonthlyTrend();
      calculateStats();
    }
  }, [properties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">오류 발생</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  const calculateMonthlyTrend = () => {
    // 월별 데이터 집계
    const monthlyMap = {};

    properties.forEach((prop) => {
      const key = `${prop.deal_year}-${String(prop.deal_month).padStart(2, '0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          date: key,
          prices: [],
          count: 0,
        };
      }

      monthlyMap[key].prices.push(prop.deal_amount);
      monthlyMap[key].count++;
    });

    // 월별 평균 계산
    const monthly = Object.values(monthlyMap)
      .map((data) => ({
        date: data.date,
        평균가: Math.round(data.prices.reduce((a, b) => a + b, 0) / data.prices.length),
        거래량: data.count,
        최고가: Math.max(...data.prices),
        최저가: Math.min(...data.prices),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    setMonthlyData(monthly);
  };

  const calculateStats = () => {
    const validProperties = properties.filter((p) => p.deal_amount > 0);

    if (validProperties.length === 0) return;

    // 전체 평균 가격
    const avgPrice =
      validProperties.reduce((sum, p) => sum + p.deal_amount, 0) /
      validProperties.length;

    // 최근 3개월과 그 이전 3개월 비교
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const recent = validProperties.filter((p) => {
      const propDate = new Date(p.deal_year, p.deal_month - 1, p.deal_day);
      return propDate >= threeMonthsAgo;
    });

    const previous = validProperties.filter((p) => {
      const propDate = new Date(p.deal_year, p.deal_month - 1, p.deal_day);
      return propDate >= sixMonthsAgo && propDate < threeMonthsAgo;
    });

    let changeRate = 0;
    let trend = 'stable';

    if (recent.length > 0 && previous.length > 0) {
      const recentAvg = recent.reduce((sum, p) => sum + p.deal_amount, 0) / recent.length;
      const previousAvg = previous.reduce((sum, p) => sum + p.deal_amount, 0) / previous.length;

      changeRate = ((recentAvg - previousAvg) / previousAvg) * 100;

      if (changeRate > 2) trend = 'up';
      else if (changeRate < -2) trend = 'down';
    }

    setStats({
      avgPrice,
      changeRate,
      totalCount: validProperties.length,
      trend,
    });
  };

  return (
    <div className="space-y-6">
      {/* 데이터 요약 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">마포구 아파트 시세 분석</h3>
            <p className="text-sm text-gray-600">
              최근 24개월 실거래 데이터 기반 ({properties.length.toLocaleString()}건 분석)
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">데이터 출처</div>
            <div className="text-sm font-medium text-gray-700">국토교통부 실거래가 공개시스템</div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">전체 평균 시세</div>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(Math.round(stats.avgPrice))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            평당 평균 {Math.round(stats.avgPrice / (85 / 3.3)).toLocaleString()}만원
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">최근 3개월 변동률</div>
            {stats.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : stats.trend === 'down' ? (
              <TrendingDown className="w-5 h-5 text-blue-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className={`text-2xl font-bold ${getChangeRateColor(stats.changeRate)}`}>
            {formatChangeRate(stats.changeRate)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.trend === 'up' ? '상승 추세' : stats.trend === 'down' ? '하락 추세' : '보합세'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">총 거래 건수</div>
            <Home className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalCount.toLocaleString()}건
          </div>
          <div className="text-xs text-gray-500 mt-1">
            월평균 {Math.round(stats.totalCount / 24).toLocaleString()}건
          </div>
        </div>
      </div>

      {/* 월별 평균 시세 추이 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 평균 시세 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 10000).toFixed(0)}억`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}만원 (${(value / 10000).toFixed(1)}억)`}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="평균가"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="평균 가격"
            />
            <Line
              type="monotone"
              dataKey="최고가"
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="최고 가격"
            />
            <Line
              type="monotone"
              dataKey="최저가"
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="최저 가격"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 거래량 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 거래량</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `${value}건`}
              labelStyle={{ color: '#000' }}
            />
            <Bar dataKey="거래량" fill="#8B5CF6" name="거래 건수" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 상세 테이블 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 상세 통계</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  월
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  평균가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  최고가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  최저가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  거래량
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.slice().reverse().map((item) => (
                <tr key={item.date} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                    {formatPrice(item.평균가)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {formatPrice(item.최고가)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">
                    {formatPrice(item.최저가)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {item.거래량}건
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
