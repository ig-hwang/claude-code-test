import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PropertyList from './components/property/PropertyList';
import { useProperties } from './hooks/useProperties';

function App() {
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
          <PropertyList
            properties={properties}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRetry={() => fetchProperties()}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
