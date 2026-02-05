# 마포구 부동산 정보 API - Backend

FastAPI 기반 부동산 실거래가 조회 및 분석 API

## 기술 스택

- Python 3.11+
- FastAPI
- Pydantic
- httpx
- pandas

## 설치 및 실행

### 1. 가상환경 생성 및 활성화

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 정보를 입력:

```
MOLIT_API_KEY=your_api_key_here
```

**API 키 발급 방법:**
1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인
3. "국토교통부 실거래가 정보" 검색
4. 활용신청 후 인증키 발급

### 4. 서버 실행

```bash
uvicorn app.main:app --reload
```

서버가 실행되면:
- API: http://localhost:8000
- API 문서: http://localhost:8000/docs
- 대체 문서: http://localhost:8000/redoc

## API 엔드포인트

### 매물 정보

#### GET /api/properties
매물 목록 조회

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `page_size`: 페이지 크기 (기본값: 50)
- `property_type`: 매물 유형 (아파트/오피스텔/연립다세대)
- `min_area`: 최소 면적(㎡)
- `max_area`: 최대 면적(㎡)
- `min_price`: 최소 가격(만원)
- `max_price`: 최대 가격(만원)
- `apartment_name`: 아파트명
- `months`: 조회 개월 수 (기본값: 12)

#### GET /api/properties/{property_id}
매물 상세 조회

#### GET /api/properties/stats/summary
매물 통계 요약

### 분석

#### GET /api/analysis/price-trend
가격 추이 분석

**Query Parameters:**
- `apartment_name`: 아파트명 (선택)
- `min_area`: 최소 면적(㎡) (선택)
- `max_area`: 최대 면적(㎡) (선택)
- `months`: 조회 개월 수 (기본값: 12)

#### GET /api/analysis/market-comparison
시세 비교 분석

**Query Parameters:**
- `property_id`: 매물 ID (선택)
- `months`: 조회 개월 수 (기본값: 12)

#### GET /api/analysis/market-ranking
시세 순위

**Query Parameters:**
- `limit`: 조회 개수 (기본값: 10)
- `months`: 조회 개월 수 (기본값: 12)

#### GET /api/analysis/location/{property_id}
입지 분석

#### GET /api/analysis/area-price-changes
평형대별 가격 변화율

**Query Parameters:**
- `months`: 조회 개월 수 (기본값: 12)

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 애플리케이션
│   ├── api/                    # API 라우터
│   │   ├── properties.py       # 매물 엔드포인트
│   │   └── analysis.py         # 분석 엔드포인트
│   ├── services/               # 비즈니스 로직
│   │   ├── molit_api.py        # 국토부 API 연동
│   │   ├── price_analyzer.py   # 가격 분석
│   │   ├── market_analyzer.py  # 시세 분석
│   │   └── location_analyzer.py # 입지 분석
│   ├── models/                 # 데이터 모델
│   │   └── schemas.py          # Pydantic 스키마
│   ├── core/                   # 핵심 설정
│   │   └── config.py           # 환경설정
│   └── data/
│       └── cache/              # 데이터 캐시
├── requirements.txt
├── .env.example
└── README.md
```

## 캐싱

API 응답은 자동으로 캐싱되어 성능을 향상시킵니다.

- 캐시 위치: `app/data/cache/`
- 캐시 유효 시간: 1시간 (설정 변경 가능)
- 캐시 파일은 JSON 형식으로 저장

## 데이터 소스

- **국토교통부 실거래가 공개 시스템**
- 마포구 지역코드: 11440
- 지원 매물 유형:
  - 아파트
  - 오피스텔
  - 연립다세대

## 개발

### 개발 서버 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 환경변수

`.env` 파일에서 다음 환경변수를 설정할 수 있습니다:

```
MOLIT_API_KEY=your_api_key           # 국토부 API 키 (필수)
CACHE_DURATION=3600                  # 캐시 지속 시간(초)
CORS_ORIGINS=http://localhost:5173   # CORS 허용 도메인
```

## 라이선스

MIT License
