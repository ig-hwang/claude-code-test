import React from 'react';
import { Filter, X } from 'lucide-react';

const Sidebar = ({ filters, onFilterChange, onReset }) => {
  const areaRanges = [
    { label: '전체', value: null },
    { label: '10평 이하', min: 0, max: 33 },
    { label: '10-20평', min: 33, max: 66 },
    { label: '20-30평', min: 66, max: 99 },
    { label: '30-40평', min: 99, max: 132 },
    { label: '40평 이상', min: 132, max: 999 },
  ];

  const priceRanges = [
    { label: '전체', value: null },
    { label: '5억 이하', min: 0, max: 50000 },
    { label: '5-10억', min: 50000, max: 100000 },
    { label: '10-15억', min: 100000, max: 150000 },
    { label: '15억 이상', min: 150000, max: 999999 },
  ];

  const propertyTypes = [
    { label: '전체', value: null },
    { label: '아파트', value: '아파트' },
    { label: '오피스텔', value: '오피스텔' },
    { label: '연립다세대', value: '연립다세대' },
  ];

  const handleAreaChange = (range) => {
    onFilterChange({
      min_area: range.min,
      max_area: range.max,
    });
  };

  const handlePriceChange = (range) => {
    onFilterChange({
      min_price: range.min,
      max_price: range.max,
    });
  };

  const handleTypeChange = (type) => {
    onFilterChange({
      property_type: type,
    });
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          초기화
        </button>
      </div>

      <div className="space-y-6">
        {/* 매물 유형 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">매물 유형</h3>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => handleTypeChange(type.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.property_type === type.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 면적 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">면적</h3>
          <div className="space-y-2">
            {areaRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleAreaChange(range)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.min_area === range.min && filters.max_area === range.max
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 가격대 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">가격대</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange(range)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.min_price === range.min && filters.max_price === range.max
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
