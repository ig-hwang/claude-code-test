import React from 'react';
import { MapPin, Calendar, Home, Building2, Info } from 'lucide-react';
import { formatPrice, formatArea, formatPricePerPyeong, formatDate } from '../../utils/formatters';

const PropertyCard = ({ property, onClick }) => {
  const hasBuildingInfo = property.floor_area_ratio || property.building_coverage_ratio || property.land_share;

  return (
    <div
      onClick={() => onClick(property)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {property.apartment_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.dong} {property.jibun}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {property.property_type}
          </span>
          {hasBuildingInfo && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Building2 className="w-3 h-3 mr-1" />
              상세정보
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">거래가</span>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(property.deal_amount)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">면적</span>
          <span className="text-sm font-medium text-gray-900">
            {formatArea(property.exclusive_area)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">평당가</span>
          <span className="text-sm font-medium text-gray-700">
            {formatPricePerPyeong(property.deal_amount, property.exclusive_area)}
          </span>
        </div>

        {property.build_year && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">건축년도</span>
            <span className="text-sm font-medium text-gray-700">
              {property.build_year}년 ({new Date().getFullYear() - property.build_year}년차)
            </span>
          </div>
        )}
      </div>

      {/* 건축 정보 미리보기 */}
      {hasBuildingInfo && (
        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {property.floor_area_ratio && (
              <div className="text-center">
                <div className="text-gray-600">용적률</div>
                <div className="font-semibold text-green-700">{property.floor_area_ratio.toFixed(0)}%</div>
              </div>
            )}
            {property.building_coverage_ratio && (
              <div className="text-center">
                <div className="text-gray-600">건폐율</div>
                <div className="font-semibold text-green-700">{property.building_coverage_ratio.toFixed(0)}%</div>
              </div>
            )}
            {property.land_share && (
              <div className="text-center">
                <div className="text-gray-600">대지지분</div>
                <div className="font-semibold text-purple-700">{property.land_share.toFixed(1)}㎡</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(property.deal_year, property.deal_month, property.deal_day)}</span>
        </div>
        {property.floor && (
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-1" />
            <span>{property.floor}층</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
