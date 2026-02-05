import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatPrice, formatNumber } from '../../utils/formatters';

const MarketComparison = ({ data }) => {
  if (!data || !data.market_stats || data.market_stats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        시세 비교 데이터가 없습니다.
      </div>
    );
  }

  const chartData = data.market_stats.map((stat) => ({
    평형대: stat.area_range,
    평균가: Math.round(stat.avg_price),
    평당가: Math.round(stat.avg_price_per_pyeong),
    거래건수: stat.deal_count,
  }));

  return (
    <div className="space-y-6">
      {/* 요약 정보 (특정 매물 비교인 경우) */}
      {data.apartment_name && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {data.apartment_name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-blue-700">현재가</div>
              <div className="text-xl font-bold text-blue-900">
                {formatPrice(data.current_price)}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-700">가격 포지션</div>
              <div className="text-xl font-bold text-blue-900">
                {data.price_position}
              </div>
            </div>
          </div>
          {data.comparison_summary && (
            <p className="text-sm text-blue-700 mt-3">{data.comparison_summary}</p>
          )}
        </div>
      )}

      {/* 평형대별 평균가 차트 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          평형대별 평균 거래가
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="평형대" />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}만원`}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Bar dataKey="평균가" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 평당가 차트 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          평형대별 평당가
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="평형대" />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}만원/평`}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Bar dataKey="평당가" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 테이블 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          평형대별 상세 시세
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  평형대
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  평균가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  평당가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  최저가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  최고가
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  거래건수
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.market_stats.map((stat) => (
                <tr key={stat.area_range}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {stat.area_range}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatPrice(stat.avg_price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatNumber(Math.round(stat.avg_price_per_pyeong))}만원/평
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">
                    {formatPrice(stat.min_price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {formatPrice(stat.max_price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {stat.deal_count}건
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

export default MarketComparison;
