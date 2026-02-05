/**
 * 숫자를 한국 화폐 형식으로 포맷
 * @param {number} amount - 금액 (만원 단위)
 * @returns {string} 포맷된 금액
 */
export const formatPrice = (amount) => {
  if (!amount) return '0만원';

  if (amount >= 10000) {
    const billion = Math.floor(amount / 10000);
    const remainder = amount % 10000;
    if (remainder === 0) {
      return `${billion}억원`;
    }
    return `${billion}억 ${remainder.toLocaleString()}만원`;
  }

  return `${amount.toLocaleString()}만원`;
};

/**
 * 면적을 평수로 변환
 * @param {number} area - 면적 (㎡)
 * @returns {string} 평수
 */
export const formatArea = (area) => {
  if (!area) return '0㎡';

  const pyeong = (area / 3.3).toFixed(1);
  return `${area.toFixed(1)}㎡ (${pyeong}평)`;
};

/**
 * 평당 가격 계산
 * @param {number} price - 가격 (만원)
 * @param {number} area - 면적 (㎡)
 * @returns {string} 평당 가격
 */
export const formatPricePerPyeong = (price, area) => {
  if (!price || !area) return '0만원/평';

  const pyeong = area / 3.3;
  const pricePerPyeong = (price / pyeong).toFixed(0);
  return `${parseInt(pricePerPyeong).toLocaleString()}만원/평`;
};

/**
 * 날짜 포맷
 * @param {string|number} year - 년도
 * @param {string|number} month - 월
 * @param {string|number} day - 일
 * @returns {string} 포맷된 날짜
 */
export const formatDate = (year, month, day) => {
  if (!year || !month || !day) return '-';

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * 변동률 포맷
 * @param {number} rate - 변동률 (%)
 * @returns {string} 포맷된 변동률
 */
export const formatChangeRate = (rate) => {
  if (rate === null || rate === undefined) return '-';

  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}%`;
};

/**
 * 변동률 색상 클래스 반환
 * @param {number} rate - 변동률 (%)
 * @returns {string} Tailwind CSS 색상 클래스
 */
export const getChangeRateColor = (rate) => {
  if (rate === null || rate === undefined) return 'text-gray-500';
  if (rate > 0) return 'text-red-600';
  if (rate < 0) return 'text-blue-600';
  return 'text-gray-500';
};

/**
 * 거리 포맷
 * @param {number} distance - 거리 (m)
 * @returns {string} 포맷된 거리
 */
export const formatDistance = (distance) => {
  if (!distance) return '0m';

  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}km`;
  }

  return `${Math.round(distance)}m`;
};

/**
 * 도보 시간 계산
 * @param {number} distance - 거리 (m)
 * @returns {string} 도보 시간
 */
export const formatWalkTime = (distance) => {
  if (!distance) return '0분';

  const minutes = Math.ceil(distance / 80); // 80m/분 가정
  return `도보 ${minutes}분`;
};

/**
 * 숫자를 천 단위로 포맷
 * @param {number} num - 숫자
 * @returns {string} 포맷된 숫자
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};

/**
 * 입지 점수에 따른 등급 반환
 * @param {number} score - 점수 (0-100)
 * @returns {string} 등급
 */
export const getLocationGrade = (score) => {
  if (score >= 90) return 'S급';
  if (score >= 80) return 'A급';
  if (score >= 70) return 'B급';
  if (score >= 60) return 'C급';
  return 'D급';
};

/**
 * 입지 점수에 따른 색상 클래스 반환
 * @param {number} score - 점수 (0-100)
 * @returns {string} Tailwind CSS 색상 클래스
 */
export const getLocationScoreColor = (score) => {
  if (score >= 90) return 'text-purple-600';
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-gray-600';
};
