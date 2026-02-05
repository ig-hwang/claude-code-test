from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """애플리케이션 설정"""

    # API 설정
    MOLIT_API_KEY: str = ""
    MOLIT_API_BASE_URL: str = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc"

    # 캐시 설정
    CACHE_DURATION: int = 3600  # 1시간
    CACHE_DIR: str = "app/data/cache"

    # CORS 설정
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # 마포구 지역코드
    MAPO_REGION_CODE: str = "11440"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
