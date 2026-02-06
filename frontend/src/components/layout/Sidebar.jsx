import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, Check } from 'lucide-react';

const Sidebar = ({ filters, onFilterChange, onReset, loading }) => {
  // 임시 필터 상태 (Apply 전)
  const [pendingFilters, setPendingFilters] = useState({
    property_type: null,
    selectedAreas: [],
    selectedPrices: [],
    selectedDongs: [],
    months: 24,
  });

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedDongs, setSelectedDongs] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const areaRanges = [
    { label: '10평 이하', min: 0, max: 33 },
    { label: '10-20평', min: 33, max: 66 },
    { label: '20-30평', min: 66, max: 99 },
    { label: '30-40평', min: 99, max: 132 },
    { label: '40평 이상', min: 132, max: 999 },
  ];

  const priceRanges = [
    { label: '5억 이하', min: 0, max: 50000 },
    { label: '5-10억', min: 50000, max: 100000 },
    { label: '10-15억', min: 100000, max: 150000 },
    { label: '15-20억', min: 150000, max: 200000 },
    { label: '20-22억', min: 200000, max: 220000 },
    { label: '22-25억', min: 220000, max: 250000 },
    { label: '25억 이상', min: 250000, max: 999999 },
  ];

  const propertyTypes = [
    { label: '전체', value: null },
    { label: '아파트', value: '아파트' },
    { label: '오피스텔', value: '오피스텔' },
    { label: '연립다세대', value: '연립다세대' },
  ];

  const dongs = [
    { label: '상암동', value: '상암동' },
    { label: '망원동', value: '망원동' },
    { label: '연남동', value: '연남동' },
    { label: '서교동', value: '서교동' },
    { label: '합정동', value: '합정동' },
    { label: '공덕동', value: '공덕동' },
    { label: '아현동', value: '아현동' },
    { label: '도화동', value: '도화동' },
    { label: '마포동', value: '마포동' },
    { label: '성산동', value: '성산동' },
    { label: '중동', value: '중동' },
    { label: '대흥동', value: '대흥동' },
  ];

  const monthsOptions = [
    { label: '1개월', value: 1 },
    { label: '3개월', value: 3 },
    { label: '6개월', value: 6 },
    { label: '12개월', value: 12 },
    { label: '24개월', value: 24 },
  ];

  const handleAreaToggle = (range) => {
    let newSelected;
    const isSelected = selectedAreas.some(r => r.min === range.min && r.max === range.max);

    if (isSelected) {
      newSelected = selectedAreas.filter(r => !(r.min === range.min && r.max === range.max));
    } else {
      newSelected = [...selectedAreas, range];
    }

    setSelectedAreas(newSelected);
    setPendingFilters(prev => ({ ...prev, selectedAreas: newSelected }));
    setHasChanges(true);
  };

  const handlePriceToggle = (range) => {
    let newSelected;
    const isSelected = selectedPrices.some(r => r.min === range.min && r.max === range.max);

    if (isSelected) {
      newSelected = selectedPrices.filter(r => !(r.min === range.min && r.max === range.max));
    } else {
      newSelected = [...selectedPrices, range];
    }

    setSelectedPrices(newSelected);
    setPendingFilters(prev => ({ ...prev, selectedPrices: newSelected }));
    setHasChanges(true);
  };

  const handleTypeChange = (type) => {
    setPendingFilters(prev => ({ ...prev, property_type: type }));
    setHasChanges(true);
  };

  const handleDongToggle = (dong) => {
    let newSelected;
    const isSelected = selectedDongs.includes(dong);

    if (isSelected) {
      newSelected = selectedDongs.filter(d => d !== dong);
    } else {
      newSelected = [...selectedDongs, dong];
    }

    setSelectedDongs(newSelected);
    setPendingFilters(prev => ({ ...prev, selectedDongs: newSelected }));
    setHasChanges(true);
  };

  const handleMonthsChange = (months) => {
    setPendingFilters(prev => ({ ...prev, months }));
    setHasChanges(true);
  };

  const handleApply = () => {
    // 선택된 면적 범위 계산
    let areaFilter = {};
    if (pendingFilters.selectedAreas.length === 0) {
      areaFilter = { min_area: null, max_area: null };
    } else {
      const minArea = Math.min(...pendingFilters.selectedAreas.map(r => r.min));
      const maxArea = Math.max(...pendingFilters.selectedAreas.map(r => r.max));
      areaFilter = { min_area: minArea, max_area: maxArea };
    }

    // 선택된 가격 범위 계산
    let priceFilter = {};
    if (pendingFilters.selectedPrices.length === 0) {
      priceFilter = { min_price: null, max_price: null };
    } else {
      const minPrice = Math.min(...pendingFilters.selectedPrices.map(r => r.min));
      const maxPrice = Math.max(...pendingFilters.selectedPrices.map(r => r.max));
      priceFilter = { min_price: minPrice, max_price: maxPrice };
    }

    // 모든 필터 적용
    onFilterChange({
      property_type: pendingFilters.property_type,
      ...areaFilter,
      ...priceFilter,
      dongs: pendingFilters.selectedDongs.length > 0 ? pendingFilters.selectedDongs : null,
      months: pendingFilters.months,
    });

    setHasChanges(false);
  };

  const handleResetLocal = () => {
    setSelectedAreas([]);
    setSelectedPrices([]);
    setSelectedDongs([]);
    setPendingFilters({
      property_type: null,
      selectedAreas: [],
      selectedPrices: [],
      selectedDongs: [],
      months: 24,
    });
    setHasChanges(false);
    onReset();
  };

  // 활성화된 필터 확인 (실제 적용된 필터)
  const hasActiveFilters = filters.property_type ||
    filters.min_area !== null ||
    filters.max_area !== null ||
    filters.min_price !== null ||
    filters.max_price !== null ||
    (filters.dongs && filters.dongs.length > 0) ||
    (filters.months && filters.months !== 24);

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetLocal}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            초기화
          </button>
        )}
      </div>

      {/* 활성 필터 요약 */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-900 mb-2">적용된 필터</div>
          <div className="space-y-1 text-xs text-blue-700">
            {filters.property_type && (
              <div>• {filters.property_type}</div>
            )}
            {selectedAreas.length > 0 && (
              <div>• 면적: {selectedAreas.map(r => r.label).join(', ')}</div>
            )}
            {selectedPrices.length > 0 && (
              <div>• 가격: {selectedPrices.map(r => r.label).join(', ')}</div>
            )}
            {selectedDongs.length > 0 && (
              <div>• 동: {selectedDongs.join(', ')}</div>
            )}
            {filters.months && filters.months !== 24 && (
              <div>• 기간: {filters.months}개월</div>
            )}
          </div>
        </div>
      )}

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
                  pendingFilters.property_type === type.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 동 선택 (중복선택) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">동 (중복선택 가능)</h3>
          <div className="grid grid-cols-2 gap-2">
            {dongs.map((dong) => {
              const isSelected = selectedDongs.includes(dong.value);
              return (
                <label
                  key={dong.value}
                  className={`flex items-center px-2 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleDongToggle(dong.value)}
                    className="mr-1.5 rounded text-green-600 focus:ring-green-500"
                  />
                  <span className="truncate">{dong.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 면적 (중복선택) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">면적 (중복선택 가능)</h3>
          <div className="space-y-2">
            {areaRanges.map((range) => {
              const isSelected = selectedAreas.some(r => r.min === range.min && r.max === range.max);
              return (
                <label
                  key={range.label}
                  className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAreaToggle(range)}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  {range.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* 가격대 (중복선택) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">가격대 (중복선택 가능)</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => {
              const isSelected = selectedPrices.some(r => r.min === range.min && r.max === range.max);
              return (
                <label
                  key={range.label}
                  className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePriceToggle(range)}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  {range.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* 조회 기간 */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            조회 기간
          </h3>
          <div className="space-y-2">
            {monthsOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleMonthsChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  pendingFilters.months === option.value
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Apply 버튼 */}
      <div className="mt-6 space-y-2">
        <button
          onClick={handleApply}
          disabled={!hasChanges || loading}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
            hasChanges && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              적용 중...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              필터 적용
            </>
          )}
        </button>
        {hasChanges && !loading && (
          <p className="text-xs text-center text-gray-500">
            변경사항이 있습니다. 적용 버튼을 눌러주세요.
          </p>
        )}
        {loading && (
          <p className="text-xs text-center text-blue-600 animate-pulse">
            데이터를 불러오는 중입니다...
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
