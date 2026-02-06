import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Home, TrendingUp, Award } from 'lucide-react';
import { formatPrice, formatArea, formatPricePerPyeong, formatDate } from '../../utils/formatters';
import { analysisAPI } from '../../services/api';
import Loading from '../common/Loading';
import PriceChart from '../analysis/PriceChart';
import LocationAnalysis from '../analysis/LocationAnalysis';

const PropertyDetail = ({ property, onClose }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'price', 'location'
  const [locationData, setLocationData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'location' && !locationData) {
      fetchLocationData();
    } else if (activeTab === 'price' && !priceData) {
      fetchPriceData();
    }
  }, [activeTab]);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const response = await analysisAPI.getLocationAnalysis(property.id);
      setLocationData(response.data);
    } catch (error) {
      console.error('입지 분석 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      const response = await analysisAPI.getPriceTrend({
        apartment_name: property.apartment_name,
        min_area: property.exclusive_area - 10,
        max_area: property.exclusive_area + 10,
      });
      setPriceData(response.data);
    } catch (error) {
      console.error('가격 추이 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {property.apartment_name}
            </h2>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.dong} {property.jibun}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'info'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4 inline mr-2" />
            기본정보
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'price'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            가격추이
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'location'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            입지분석
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 가격 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 정보</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(property.deal_amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPricePerPyeong(property.deal_amount, property.exclusive_area)}
                  </div>
                </div>
              </div>

              {/* 면적 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">면적 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">전용면적</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatArea(property.exclusive_area)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 매물 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">매물 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">매물 유형</span>
                    <span className="font-medium text-gray-900">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">거래일</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(property.deal_year, property.deal_month, property.deal_day)}
                    </span>
                  </div>
                  {property.floor && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">층수</span>
                      <span className="font-medium text-gray-900">{property.floor}층</span>
                    </div>
                  )}
                  {property.build_year && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">건축년도</span>
                      <span className="font-medium text-gray-900">{property.build_year}년</span>
                    </div>
                  )}
                  {property.road_name && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">도로명</span>
                      <span className="font-medium text-gray-900">{property.road_name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 건축 정보 */}
              {(property.floor_area_ratio || property.building_coverage_ratio || property.land_share) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">건축 정보</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {property.floor_area_ratio && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">용적률</div>
                          <div className="text-xs text-gray-500">건축 효율성</div>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {property.floor_area_ratio.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {property.floor_area_ratio > 300 ? '초고층' : property.floor_area_ratio > 200 ? '고층' : '중저층'}
                        </div>
                      </div>
                    )}
                    {property.building_coverage_ratio && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">건폐율</div>
                          <div className="text-xs text-gray-500">토지 이용률</div>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {property.building_coverage_ratio.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {property.building_coverage_ratio < 20 ? '쾌적함' : property.building_coverage_ratio < 30 ? '보통' : '밀집'}
                        </div>
                      </div>
                    )}
                    {property.land_share && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">대지지분</div>
                          <div className="text-xs text-gray-500">토지 소유권</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-700">
                          {property.land_share.toFixed(1)}㎡
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          약 {(property.land_share / 3.3).toFixed(1)}평
                        </div>
                      </div>
                    )}
                    {property.total_households && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">총 세대수</div>
                          <div className="text-xs text-gray-500">단지 규모</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {property.total_households.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {property.total_households > 1000 ? '대단지' : property.total_households > 500 ? '중형단지' : '소형단지'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 주차 및 편의시설 */}
                  {property.total_parking && property.total_households && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">주차대수</div>
                          <div className="text-xl font-bold text-gray-900">
                            {property.total_parking.toLocaleString()}대
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">세대당 주차</div>
                          <div className="text-xl font-bold text-gray-900">
                            {(property.total_parking / property.total_households).toFixed(2)}대
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(property.total_parking / property.total_households) >= 1.5 ? '여유로움' :
                             (property.total_parking / property.total_households) >= 1.0 ? '보통' : '부족'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'price' && (
            <div>
              {loading ? (
                <Loading message="가격 추이를 분석하는 중입니다..." />
              ) : priceData ? (
                <PriceChart data={priceData} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  가격 추이 데이터를 불러오는 중입니다.
                </div>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              {loading ? (
                <Loading message="입지를 분석하는 중입니다..." />
              ) : locationData ? (
                <LocationAnalysis data={locationData} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  입지 분석 데이터를 불러오는 중입니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
