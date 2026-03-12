from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Doc Shrink API"
    api_prefix: str = "/api"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )
    spire_pdf_page_limit: int = 3
    spire_paragraph_limit: int = 500
    spire_table_limit: int = 25

    model_config = SettingsConfigDict(
        env_prefix="DOC_SHRINK_",
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
