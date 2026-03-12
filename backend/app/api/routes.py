from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.config import Settings, get_settings
from app.models import HealthStatus
from app.services.inspection_service import InspectionService
from app.services.spire_document_adapter import SpireDocumentAdapter


router = APIRouter()


def get_adapter(settings: Settings = Depends(get_settings)) -> SpireDocumentAdapter:
    return SpireDocumentAdapter(
        paragraph_limit=settings.spire_paragraph_limit,
        table_limit=settings.spire_table_limit,
        pdf_page_limit=settings.spire_pdf_page_limit,
    )


def get_inspection_service(
    adapter: SpireDocumentAdapter = Depends(get_adapter),
) -> InspectionService:
    return InspectionService(adapter=adapter)


@router.get("/health", response_model=HealthStatus)
def health() -> HealthStatus:
    availability = SpireDocumentAdapter.availability()
    return HealthStatus(
        app="Doc Shrink API",
        spire_available=availability.available,
        spire_import_error=availability.error,
    )


@router.post("/process/inspect")
async def inspect_resume(
    file: UploadFile = File(...),
    provider_mode: str = Form("free"),
    output_formats: str = Form("docx"),
    inspection_service: InspectionService = Depends(get_inspection_service),
):
    if not (file.filename or "").lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Phase 1 accepts DOCX files only.")

    formats = [item.strip().lower() for item in output_formats.split(",") if item.strip()]
    allowed_formats = {"docx", "pdf"}
    if not formats or any(item not in allowed_formats for item in formats):
        raise HTTPException(status_code=400, detail="output_formats must contain docx and optionally pdf.")

    return await inspection_service.inspect(
        file=file,
        provider_mode=provider_mode,
        output_formats=formats,
    )
