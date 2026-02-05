# 마포구 부동산 정보 리서치 웹사이트

국토교통부 실거래가 데이터를 기반으로 한 마포구 부동산 매물 정보 조회 및 전문가급 분석 시스템

## 주요 기능

- 📊 **실거래가 조회**: 국토교통부 공식 데이터 기반 아파트/오피스텔/연립다세대 실거래가 조회
- 📈 **가격 추이 분석**: 월별/분기별 가격 변화 추이 시각화
- 🏘️ **시세 비교**: 평형대별 평균 시세 및 거래량 분석
- 📍 **입지 분석**: 역세권, 학군, 상권 접근성 기반 입지 점수
- 🔍 **스마트 필터링**: 지역, 평형, 가격대별 매물 필터링

## 기술 스택

### Backend
- **FastAPI**: 고성능 Python 웹 프레임워크
- **Python 3.11+**: 최신 Python 기능 활용
- **Pydantic**: 데이터 검증 및 스키마 관리
- **httpx**: 비동기 HTTP 클라이언트

### Frontend
- **React 18**: 최신 React 기능 활용
- **Vite**: 빠른 개발 환경
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Recharts**: 데이터 시각화
- **Axios**: HTTP 클라이언트

## 프로젝트 구조

```
claude-code-test/
├── backend/          # FastAPI 백엔드
│   ├── app/
│   │   ├── api/      # API 엔드포인트
│   │   ├── services/ # 비즈니스 로직
│   │   ├── models/   # 데이터 모델
│   │   └── core/     # 설정 및 유틸리티
│   └── requirements.txt
├── frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
└── README.md
```

## 설치 및 실행

### 사전 요구사항
- Python 3.11 이상
- Node.js 18 이상
- 국토교통부 API 키 (공공데이터포털에서 발급)

### 백엔드 설정

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에 API 키 입력

# 서버 실행
uvicorn app.main:app --reload
```

백엔드 서버: http://localhost:8000
API 문서: http://localhost:8000/docs

### 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

프론트엔드 서버: http://localhost:5173

## API 문서

백엔드 서버 실행 후 http://localhost:8000/docs 에서 대화형 API 문서 확인 가능

### 주요 엔드포인트

#### 매물 정보
- `GET /api/properties` - 매물 목록 조회
- `GET /api/properties/{id}` - 매물 상세 조회
- `GET /api/properties/stats` - 통계 요약

#### 분석
- `GET /api/analysis/price-trend` - 가격 추이 분석
- `GET /api/analysis/market-comparison` - 시세 비교
- `GET /api/analysis/location` - 입지 분석

## 데이터 소스

- **국토교통부 실거래가 공개 시스템**: 공식 부동산 실거래가 데이터
- **마포구 지역코드**: 11440

## 주요 분석 기능

### 1. 가격 추이 분석
- 월별 평균 거래가 추이
- 전월/전년 대비 변동률
- 거래량 추이
- 최고가/최저가 추적

### 2. 시세 비교
- 평형대별 평균 시세
- 평당 가격 계산
- 가격 분포도
- 지역 내 시세 순위

### 3. 입지 분석
- 역세권 평가 (지하철역 거리)
- 교육환경 (초/중/고등학교 접근성)
- 상권 접근성 (홍대, 합정, 공덕 등)
- 종합 입지 점수 (0-100점)

## 개발 가이드

### 백엔드 개발
```bash
# 개발 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 프론트엔드 개발
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 환경변수

### Backend (.env)
```
MOLIT_API_KEY=your_api_key_here
CACHE_DURATION=3600
```

## 라이선스

MIT License

## 기여

이슈 및 풀 리퀘스트를 환영합니다.

## 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
