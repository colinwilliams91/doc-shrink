from typing import Literal

from pydantic import BaseModel, Field


ProviderMode = Literal["free", "byok"]
JobStage = Literal["idle", "inspecting", "completed", "failed"]


class HealthStatus(BaseModel):
    app: str
    status: Literal["ok"] = "ok"
    spire_available: bool
    spire_import_error: str | None = None


class InspectionConstraints(BaseModel):
    paragraph_limit: int
    table_limit: int
    pdf_page_limit: int
    pdf_requested: bool
    pdf_eligible: bool


class InspectionMetrics(BaseModel):
    paragraph_count: int
    table_count: int
    word_count: int
    page_count: int | None = None
    docx_roundtrip_supported: bool = False
    pdf_export_verified: bool = False


class InspectionResponse(BaseModel):
    filename: str
    stage: JobStage = "completed"
    provider_mode: ProviderMode = "free"
    constraints: InspectionConstraints
    metrics: InspectionMetrics
    warnings: list[str] = Field(default_factory=list)
