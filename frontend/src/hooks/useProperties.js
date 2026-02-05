import { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';

export const useProperties = (filters = {}, autoFetch = true) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
  });

  const fetchProperties = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyAPI.getProperties({
        ...filters,
        ...params,
        page: params.page || pagination.page,
        page_size: params.page_size || pagination.pageSize,
      });

      setProperties(response.data.properties);
      setPagination({
        page: response.data.page,
        pageSize: response.data.page_size,
        total: response.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.detail || '매물 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProperties();
    }
  }, [JSON.stringify(filters)]);

  return {
    properties,
    loading,
    error,
    pagination,
    fetchProperties,
    refetch: fetchProperties,
  };
};

export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperty = async () => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await propertyAPI.getProperty(propertyId);
      setProperty(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || '매물 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
};

export const usePropertyStats = (filters = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyAPI.getStats(filters);
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || '통계 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(filters)]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
