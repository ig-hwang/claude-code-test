import React from 'react';
import { Train, GraduationCap, ShoppingBag, Award } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  formatDistance,
  formatWalkTime,
  getLocationGrade,
  getLocationScoreColor,
} from '../../utils/formatters';

const LocationAnalysis = ({ data }) => {
  if (!data || !data.location_score) {
    return (
      <div className="text-center py-12 text-gray-500">
        입지 분석 데이터가 없습니다.
      </div>
    );
  }

  const radarData = [
    {
      category: '역세권',
      score: data.location_score.subway_score,
    },
    {
      category: '교육환경',
      score: data.location_score.education_score,
    },
    {
      category: '상권',
      score: data.location_score.commercial_score,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 종합 점수 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-purple-600 mr-2" />
            <h3 className="text-2xl font-bold text-gray-900">종합 입지 점수</h3>
          </div>
          <div className={`text-5xl font-bold mb-2 ${getLocationScoreColor(data.location_score.total_score)}`}>
            {data.location_score.total_score}점
          </div>
          <div className="text-lg font-semibold text-gray-700">
            {getLocationGrade(data.location_score.total_score)}
          </div>
        </div>
      </div>

      {/* 세부 점수 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Train className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-900">역세권</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {data.location_score.subway_score}점
          </div>
          {data.location_score.nearest_subway && (
            <div className="text-sm text-gray-600">
              <div>{data.location_score.nearest_subway}</div>
              <div>{formatDistance(data.location_score.subway_distance)}</div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-gray-900">교육환경</h4>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {data.location_score.education_score}점
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <ShoppingBag className="w-5 h-5 text-orange-600 mr-2" />
            <h4 className="font-semibold text-gray-900">상권</h4>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {data.location_score.commercial_score}점
          </div>
        </div>
      </div>

      {/* 레이더 차트 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">입지 요소별 점수</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="점수"
              dataKey="score"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 인근 지하철역 */}
      {data.nearby_subways && data.nearby_subways.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">인근 지하철역</h3>
          <div className="space-y-2">
            {data.nearby_subways.map((subway, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center">
                  <Train className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">{subway.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDistance(subway.distance)} · {formatWalkTime(subway.distance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인근 학교 */}
      {data.nearby_schools && data.nearby_schools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">인근 학교</h3>
          <div className="space-y-2">
            {data.nearby_schools.map((school, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">{school.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDistance(school.distance)} · {formatWalkTime(school.distance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationAnalysis;
