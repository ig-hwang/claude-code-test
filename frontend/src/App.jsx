import React, { useState } from 'react';
import { BarChart3, List, ShoppingCart } from 'lucide-react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PropertyList from './components/property/PropertyList';
import Dashboard from './components/analysis/Dashboard';
import { useTradeHistory, useCurrentListings } from './hooks/useProperties';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'trades', 'listings'
  const [filters, setFilters] = useState({
    property_type: null,
    min_area: null,
    max_area: null,
    min_price: null,
    max_price: null,
  });

  // 대시보드용 전체 데이터 (6832건)
  const {
    properties: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useTradeHistory({ months: 24, page_size: 10000 });

  // 실거래가 내역용 페이지별 데이터 (50건씩)
  const {
    properties: tradeHistory,
    loading: tradesLoading,
    error: tradesError,
    pagination: tradesPagination,
    fetchProperties: fetchTrades
  } = useTradeHistory({ ...filters, months: 24 });

  // 현재 매물 데이터 (부동산114)
  const {
    properties: currentListings,
    loading: listingsLoading,
    error: listingsError,
    pagination: listingsPagination,
    fetchProperties: fetchListings
  } = useCurrentListings(filters, activeTab === 'listings');

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      property_type: null,
      min_area: null,
      max_area: null,
      min_price: null,
      max_price: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <main className="flex-1 p-6">
          {/* 탭 메뉴 */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              시세 분석
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'trades'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5 mr-2" />
              실거래가 내역
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'listings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              현재 매물
            </button>
          </div>

          {/* 콘텐츠 */}
          {activeTab === 'dashboard' ? (
            <Dashboard properties={dashboardData} loading={dashboardLoading} error={dashboardError} />
          ) : activeTab === 'trades' ? (
            <PropertyList
              properties={tradeHistory}
              loading={tradesLoading}
              error={tradesError}
              pagination={tradesPagination}
              onPageChange={(page) => fetchTrades({ page })}
              onRetry={() => fetchTrades()}
              title="실거래가 내역"
              description="국토교통부 실거래가 데이터"
            />
          ) : (
            <PropertyList
              properties={currentListings}
              loading={listingsLoading}
              error={listingsError}
              pagination={listingsPagination}
              onPageChange={(page) => fetchListings({ page })}
              onRetry={() => fetchListings()}
              title="현재 매물"
              description="부동산114 현재 판매 중인 매물 (호가)"
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
