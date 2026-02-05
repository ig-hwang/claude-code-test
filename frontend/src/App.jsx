import React, { useState } from 'react';
import { BarChart3, List } from 'lucide-react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PropertyList from './components/property/PropertyList';
import Dashboard from './components/analysis/Dashboard';
import { useProperties } from './hooks/useProperties';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'properties'
  const [filters, setFilters] = useState({
    property_type: null,
    min_area: null,
    max_area: null,
    min_price: null,
    max_price: null,
  });

  const { properties, loading, error, pagination, fetchProperties } = useProperties(filters);

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

  const handlePageChange = (page) => {
    fetchProperties({ page });
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
              시세 분석 대시보드
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5 mr-2" />
              매물 목록
            </button>
          </div>

          {/* 콘텐츠 */}
          {activeTab === 'dashboard' ? (
            <Dashboard properties={properties} />
          ) : (
            <PropertyList
              properties={properties}
              loading={loading}
              error={error}
              pagination={pagination}
              onPageChange={handlePageChange}
              onRetry={() => fetchProperties()}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
