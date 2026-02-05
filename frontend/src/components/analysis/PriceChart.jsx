import React from 'react';
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
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPrice, formatChangeRate, getChangeRateColor } from '../../utils/formatters';

const PriceChart = ({ data }) => {
  if (!data || !data.price_history || data.price_history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        가격 추이 데이터가 없습니다.
      </div>
    );
  }

  const chartData = data.price_history.map((item) => ({
    date: item.date,
    평균가: Math.round(item.avg_price),
    최고가: Math.round(item.max_price),
    최저가: Math.round(item.min_price),
    거래건수: item.deal_count,
  }));

  const getTrendIcon = () => {
    if (data.trend === '상승') return <TrendingUp className="w-5 h-5 text-red-600" />;
    if (data.trend === '하락') return <TrendingDown className="w-5 h-5 text-blue-600" />;
    return <Minus className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* 요약 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">현재 평균가</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(data.current_avg_price)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">전월 대비</div>
          <div className={`text-2xl font-bold ${getChangeRateColor(data.mom_change_rate)}`}>
            {formatChangeRate(data.mom_change_rate)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center">
            추세
            <span className="ml-2">{getTrendIcon()}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{data.trend}</div>
        </div>
      </div>

      {/* 가격 추이 차트 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value.toLocaleString()}만원`}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="평균가"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="최고가"
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="최저가"
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 거래량 차트 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">거래량 추이</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => `${value}건`}
              labelStyle={{ color: '#000' }}
            />
            <Bar dataKey="거래건수" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 테이블 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 상세</h3>
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
                  변동률
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  거래건수
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.price_history.slice().reverse().map((item) => (
                <tr key={item.date}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatPrice(item.avg_price)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${getChangeRateColor(item.price_change_rate)}`}>
                    {formatChangeRate(item.price_change_rate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {item.deal_count}건
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

export default PriceChart;
