from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """애플리케이션 설정"""
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    # API 설정
    MOLIT_API_KEY: str = ""
    MOLIT_API_BASE_URL: str = "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc"

    # 캐시 설정
    CACHE_DURATION: int = 3600  # 1시간
    CACHE_DIR: str = "app/data/cache"

    # CORS 설정
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # 마포구 지역코드
    MAPO_REGION_CODE: str = "11440"

    @property
    def cors_origins_list(self) -> List[str]:
        """CORS origins를 리스트로 반환"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
