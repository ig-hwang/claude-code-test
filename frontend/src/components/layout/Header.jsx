import React from 'react';
import { Home, BarChart3, Database, TrendingUp } from 'lucide-react';

const Header = () => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-2 mr-3">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                마포구 부동산 시세 분석
              </h1>
              <p className="text-xs text-blue-100">실거래가 및 건축정보 통합 조회 시스템</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-white">
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-1.5">
                <Database className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-medium">국토부 실거래가</span>
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-1.5">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-medium">24개월 데이터</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
