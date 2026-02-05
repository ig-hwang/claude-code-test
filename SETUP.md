# 빠른 시작 가이드

마포구 부동산 정보 웹사이트를 로컬 환경에서 실행하는 방법입니다.

## 사전 요구사항

- Python 3.11 이상
- Node.js 18 이상
- 국토교통부 API 키 ([공공데이터포털](https://www.data.go.kr)에서 발급)

## 1. 저장소 클론

```bash
cd /Users/tobi
# 이미 claude-code-test 디렉토리에 있다면 이 단계는 건너뜁니다
```

## 2. 백엔드 설정 및 실행

### 2.1 가상환경 생성 및 활성화

```bash
cd claude-code-test/backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
# venv\Scripts\activate
```

### 2.2 의존성 설치

```bash
pip install -r requirements.txt
```

### 2.3 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 내용을 수정:

```
MOLIT_API_KEY=여기에_실제_API_키_입력
CACHE_DURATION=3600
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**API 키 발급 방법:**
1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인
3. "국토교통부 아파트매매 실거래 상세 자료" 검색
4. 활용신청 (즉시 승인됨)
5. 마이페이지 > 인증키 발급현황에서 키 확인

### 2.4 백엔드 서버 실행

```bash
uvicorn app.main:app --reload
```

서버가 다음 주소에서 실행됩니다:
- API 서버: http://localhost:8000
- API 문서: http://localhost:8000/docs
- 대체 문서: http://localhost:8000/redoc

## 3. 프론트엔드 설정 및 실행

**새 터미널 창을 열고:**

### 3.1 프론트엔드 디렉토리로 이동

```bash
cd claude-code-test/frontend
```

### 3.2 의존성 설치

```bash
npm install
```

### 3.3 개발 서버 실행

```bash
npm run dev
```

프론트엔드가 다음 주소에서 실행됩니다:
- 웹 애플리케이션: http://localhost:5173

## 4. 애플리케이션 사용

1. 브라우저에서 http://localhost:5173 접속
2. 좌측 사이드바에서 필터 선택 (매물 유형, 면적, 가격대)
3. 매물 카드를 클릭하여 상세 정보 확인
4. 상세 모달에서 탭 전환:
   - 기본정보: 매물의 기본 정보
   - 가격추이: 가격 변화 차트
   - 입지분석: 역세권, 학군, 상권 점수

## 5. 주요 기능

### 매물 조회
- 실거래가 기반 매물 목록
- 다양한 필터 옵션
- 그리드/리스트 뷰 전환
- 페이지네이션

### 가격 분석
- 월별 가격 추이
- 평형대별 시세 비교
- 거래량 통계

### 입지 분석
- 역세권 점수 (지하철역 거리)
- 교육환경 점수 (학교 접근성)
- 상권 점수 (주요 상권 거리)
- 종합 입지 점수 (0-100점)

## 6. 데이터 확인

백엔드가 정상적으로 작동하는지 확인:

```bash
# 헬스 체크
curl http://localhost:8000/health

# 매물 목록 조회 (첫 페이지)
curl http://localhost:8000/api/properties?page=1&page_size=10

# 통계 요약
curl http://localhost:8000/api/properties/stats/summary
```

## 7. 트러블슈팅

### 백엔드 오류

**문제: ModuleNotFoundError**
```bash
# 가상환경이 활성화되어 있는지 확인
which python  # venv 경로가 나와야 함

# 의존성 재설치
pip install -r requirements.txt
```

**문제: API 키 오류**
- `.env` 파일에 올바른 API 키가 설정되어 있는지 확인
- API 키에 공백이나 따옴표가 없는지 확인

**문제: 포트 충돌**
```bash
# 다른 포트로 실행
uvicorn app.main:app --reload --port 8001
```

### 프론트엔드 오류

**문제: npm install 실패**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

**문제: CORS 에러**
- 백엔드 `.env` 파일의 CORS_ORIGINS 설정 확인
- 프론트엔드가 http://localhost:5173에서 실행되는지 확인

**문제: API 데이터 로딩 실패**
- 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
- 브라우저 개발자 도구 > 네트워크 탭에서 API 요청 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 데이터가 없는 경우

처음 실행 시 데이터가 없을 수 있습니다:
1. API 키가 올바른지 확인
2. 국토교통부 API가 응답하는지 대기 (최대 30초)
3. 캐시 디렉토리 확인: `backend/app/data/cache/`
4. 캐시 파일이 생성되었는지 확인

## 8. 개발 모드

### 백엔드 개발
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

코드 변경 시 자동으로 서버가 재시작됩니다.

### 프론트엔드 개발
```bash
cd frontend
npm run dev
```

코드 변경 시 브라우저가 자동으로 새로고침됩니다 (HMR).

## 9. 프로덕션 빌드

### 프론트엔드 빌드
```bash
cd frontend
npm run build
npm run preview  # 빌드 결과 미리보기
```

빌드 결과물은 `frontend/dist/` 디렉토리에 생성됩니다.

## 10. 디렉토리 구조

```
claude-code-test/
├── backend/                # FastAPI 백엔드
│   ├── app/
│   │   ├── api/           # API 엔드포인트
│   │   ├── services/      # 비즈니스 로직
│   │   ├── models/        # 데이터 모델
│   │   ├── core/          # 설정
│   │   └── data/cache/    # 캐시 데이터
│   ├── requirements.txt
│   └── .env               # 환경변수 (직접 생성)
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── services/      # API 서비스
│   │   ├── hooks/         # 커스텀 훅
│   │   └── utils/         # 유틸리티
│   └── package.json
└── README.md              # 프로젝트 소개
```

## 11. 추가 정보

- 백엔드 상세 가이드: `backend/README.md`
- 프론트엔드 상세 가이드: `frontend/README.md`
- 프로젝트 개요: `README.md`

## 12. 문의 및 지원

문제가 발생하면:
1. 백엔드 로그 확인 (터미널 출력)
2. 프론트엔드 브라우저 콘솔 확인
3. API 문서 확인: http://localhost:8000/docs

Happy coding!
