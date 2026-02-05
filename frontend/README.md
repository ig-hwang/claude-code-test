# 마포구 부동산 정보 - Frontend

React + Vite 기반 부동산 정보 조회 및 분석 웹 애플리케이션

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Axios
- Recharts
- Lucide React (아이콘)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버: http://localhost:5173

### 3. 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

### 4. 빌드 미리보기

```bash
npm run preview
```

## 주요 기능

### 매물 조회
- 아파트, 오피스텔, 연립다세대 실거래 매물 목록
- 매물 유형, 면적, 가격대별 필터링
- 그리드/리스트 뷰 전환
- 페이지네이션

### 매물 상세
- 기본 정보 (가격, 면적, 층수, 건축년도 등)
- 가격 추이 분석
- 입지 분석 (역세권, 학군, 상권)

### 분석 기능
- 가격 추이 차트 (월별 평균가, 최고가, 최저가)
- 거래량 추이
- 시세 비교 (평형대별 평균 시세)
- 입지 점수 (종합 점수 및 세부 점수)

## 프로젝트 구조

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          # 헤더
│   │   │   └── Sidebar.jsx         # 사이드바 (필터)
│   │   ├── property/
│   │   │   ├── PropertyCard.jsx    # 매물 카드
│   │   │   ├── PropertyList.jsx    # 매물 목록
│   │   │   └── PropertyDetail.jsx  # 매물 상세
│   │   ├── analysis/
│   │   │   ├── PriceChart.jsx      # 가격 추이 차트
│   │   │   ├── MarketComparison.jsx # 시세 비교
│   │   │   └── LocationAnalysis.jsx # 입지 분석
│   │   └── common/
│   │       ├── Loading.jsx         # 로딩 컴포넌트
│   │       └── ErrorMessage.jsx    # 에러 메시지
│   ├── services/
│   │   └── api.js                  # API 호출 서비스
│   ├── hooks/
│   │   └── useProperties.js        # 커스텀 훅
│   ├── utils/
│   │   └── formatters.js           # 데이터 포맷팅 유틸리티
│   ├── App.jsx                     # 메인 애플리케이션
│   ├── main.jsx                    # 엔트리 포인트
│   └── index.css                   # 전역 스타일
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 컴포넌트 설명

### Layout
- **Header**: 앱 로고 및 네비게이션
- **Sidebar**: 필터링 옵션 (매물 유형, 면적, 가격대)

### Property
- **PropertyCard**: 매물 요약 카드 (가격, 면적, 거래일 등)
- **PropertyList**: 매물 목록 표시 및 페이지네이션
- **PropertyDetail**: 매물 상세 정보 모달 (탭: 기본정보/가격추이/입지분석)

### Analysis
- **PriceChart**: Recharts를 사용한 가격 추이 라인 차트 및 거래량 바차트
- **MarketComparison**: 평형대별 시세 비교 바차트 및 테이블
- **LocationAnalysis**: 입지 점수 레이더 차트 및 인근 시설 정보

### Common
- **Loading**: 로딩 스피너
- **ErrorMessage**: 에러 메시지 및 재시도 버튼

## API 연동

백엔드 API 기본 URL: `http://localhost:8000/api`

### 주요 엔드포인트
- `GET /properties` - 매물 목록
- `GET /properties/{id}` - 매물 상세
- `GET /analysis/price-trend` - 가격 추이
- `GET /analysis/market-comparison` - 시세 비교
- `GET /analysis/location/{id}` - 입지 분석

자세한 API 문서는 백엔드 README를 참조하세요.

## 커스텀 훅

### useProperties
매물 목록을 조회하고 상태를 관리하는 커스텀 훅

```javascript
const { properties, loading, error, pagination, fetchProperties } = useProperties(filters);
```

### useProperty
특정 매물의 상세 정보를 조회하는 커스텀 훅

```javascript
const { property, loading, error, refetch } = useProperty(propertyId);
```

### usePropertyStats
매물 통계를 조회하는 커스텀 훅

```javascript
const { stats, loading, error, refetch } = usePropertyStats(filters);
```

## 유틸리티 함수

### formatters.js
- `formatPrice(amount)`: 금액을 한국 화폐 형식으로 포맷 (억/만원)
- `formatArea(area)`: 면적을 ㎡와 평으로 표시
- `formatPricePerPyeong(price, area)`: 평당 가격 계산
- `formatDate(year, month, day)`: 날짜 포맷
- `formatChangeRate(rate)`: 변동률 포맷
- `getChangeRateColor(rate)`: 변동률에 따른 색상 클래스
- `formatDistance(distance)`: 거리 포맷 (m/km)
- `getLocationGrade(score)`: 입지 점수에 따른 등급 (S/A/B/C/D)

## 스타일링

Tailwind CSS를 사용한 유틸리티 기반 스타일링

### 주요 색상
- Primary (파랑): `blue-600`
- Success (초록): `green-600`
- Danger (빨강): `red-600`
- Warning (노랑): `yellow-600`

### 반응형 브레이크포인트
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 개발 가이드

### 새 컴포넌트 추가
1. `src/components/` 아래 적절한 디렉토리에 컴포넌트 생성
2. Tailwind CSS 클래스 사용
3. PropTypes 또는 TypeScript 사용 권장

### 새 API 호출 추가
1. `src/services/api.js`에 API 함수 추가
2. 필요시 커스텀 훅 생성 (`src/hooks/`)

### 데이터 포맷팅
공통 포맷팅 로직은 `src/utils/formatters.js`에 추가

## 환경변수

현재 환경변수는 사용하지 않지만, 필요시 `.env` 파일 생성:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

사용 방법:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 트러블슈팅

### CORS 에러
백엔드 서버에서 CORS 설정을 확인하세요.

### 데이터가 표시되지 않음
1. 백엔드 서버가 실행 중인지 확인
2. 브라우저 콘솔에서 에러 확인
3. 네트워크 탭에서 API 응답 확인

## 라이선스

MIT License
