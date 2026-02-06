import React, { useState } from 'react';
import { Grid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import PropertyDetail from './PropertyDetail';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const PropertyList = ({
  properties,
  loading,
  error,
  pagination,
  onPageChange,
  onRetry,
  title = "매물 목록",
  description = null
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProperty, setSelectedProperty] = useState(null);

  if (loading) {
    return <Loading message="매물을 불러오는 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">매물이 없습니다.</p>
        {description && (
          <p className="text-sm text-gray-400 mt-2">{description}</p>
        )}
      </div>
    );
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // 현재 페이지 통계 계산
  const avgPrice = properties.reduce((sum, p) => sum + p.deal_amount, 0) / properties.length;
  const avgArea = properties.reduce((sum, p) => sum + p.exclusive_area, 0) / properties.length;
  const avgPricePerPyeong = avgPrice / (avgArea / 3.3);
  const propertiesWithBuildingInfo = properties.filter(p => p.floor_area_ratio || p.building_coverage_ratio || p.land_share).length;

  return (
    <div className="flex-1">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            총 {pagination.total.toLocaleString()}건
            {description && ` - ${description}`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="text-xs text-gray-600 mb-1">평균 거래가</div>
          <div className="text-lg font-bold text-blue-700">
            {Math.round(avgPrice / 10000)}억
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-gray-600 mb-1">평균 평당가</div>
          <div className="text-lg font-bold text-green-700">
            {Math.round(avgPricePerPyeong).toLocaleString()}만
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="text-xs text-gray-600 mb-1">평균 면적</div>
          <div className="text-lg font-bold text-purple-700">
            {(avgArea / 3.3).toFixed(1)}평
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-xs text-gray-600 mb-1">상세정보 보유</div>
          <div className="text-lg font-bold text-orange-700">
            {propertiesWithBuildingInfo}/{properties.length}건
          </div>
        </div>
      </div>

      {/* 매물 그리드 */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'
            : 'space-y-4 mb-6'
        }
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={setSelectedProperty}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm text-gray-700">
            {pagination.page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 매물 상세 모달 */}
      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default PropertyList;
