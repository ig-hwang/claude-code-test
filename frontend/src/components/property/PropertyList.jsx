import React, { useState } from 'react';
import { Grid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import PropertyDetail from './PropertyDetail';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const PropertyList = ({ properties, loading, error, pagination, onPageChange, onRetry }) => {
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
      </div>
    );
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="flex-1">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">매물 목록</h2>
          <p className="text-sm text-gray-600 mt-1">
            총 {pagination.total.toLocaleString()}건의 매물
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
