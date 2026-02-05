import React from 'react';
import { Home, BarChart3 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                마포구 부동산 정보
              </h1>
              <p className="text-xs text-gray-500">실거래가 기반 분석 시스템</p>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <a
              href="#properties"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">매물</span>
            </a>
            <a
              href="#analysis"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">분석</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
