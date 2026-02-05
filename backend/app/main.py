from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import properties, analysis

app = FastAPI(
    title="마포구 부동산 정보 API",
    description="국토교통부 실거래가 데이터 기반 부동산 정보 조회 및 분석 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(properties.router, prefix="/api/properties", tags=["매물"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["분석"])


@app.get("/")
async def root():
    """API 루트 엔드포인트"""
    return {
        "message": "마포구 부동산 정보 API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy"}
