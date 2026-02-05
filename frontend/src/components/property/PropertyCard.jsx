import React from 'react';
import { MapPin, Calendar, Home } from 'lucide-react';
import { formatPrice, formatArea, formatPricePerPyeong, formatDate } from '../../utils/formatters';

const PropertyCard = ({ property, onClick }) => {
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {property.property_type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
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
      </div>

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
