import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 매물 API
export const propertyAPI = {
  // 매물 목록 조회
  getProperties: (params = {}) => {
    return api.get('/properties', { params });
  },

  // 매물 상세 조회
  getProperty: (id) => {
    return api.get(`/properties/${id}`);
  },

  // 매물 통계
  getStats: (params = {}) => {
    return api.get('/properties/stats/summary', { params });
  },
};

// 분석 API
export const analysisAPI = {
  // 가격 추이 분석
  getPriceTrend: (params = {}) => {
    return api.get('/analysis/price-trend', { params });
  },

  // 시세 비교
  getMarketComparison: (params = {}) => {
    return api.get('/analysis/market-comparison', { params });
  },

  // 시세 순위
  getMarketRanking: (params = {}) => {
    return api.get('/analysis/market-ranking', { params });
  },

  // 입지 분석
  getLocationAnalysis: (propertyId) => {
    return api.get(`/analysis/location/${propertyId}`);
  },

  // 평형대별 가격 변화
  getAreaPriceChanges: (params = {}) => {
    return api.get('/analysis/area-price-changes', { params });
  },
};

export default api;
