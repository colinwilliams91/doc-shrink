from fastapi import UploadFile

from app.models import InspectionConstraints, InspectionMetrics, InspectionResponse
from app.services.spire_document_adapter import SpireDocumentAdapter


class InspectionService:
    def __init__(self, adapter: SpireDocumentAdapter) -> None:
        self.adapter = adapter

    async def inspect(
        self,
        file: UploadFile,
        provider_mode: str,
        output_formats: list[str],
    ) -> InspectionResponse:
        file_bytes = await file.read()
        pdf_requested = "pdf" in output_formats
        result = self.adapter.inspect(
            file_bytes=file_bytes,
            filename=file.filename or "resume.docx",
            pdf_requested=pdf_requested,
        )
        pdf_eligible = result.page_count is not None and result.page_count <= self.adapter.pdf_page_limit
        if not pdf_requested:
            pdf_eligible = False

        return InspectionResponse(
            filename=file.filename or "resume.docx",
            provider_mode=provider_mode,
            constraints=InspectionConstraints(
                paragraph_limit=self.adapter.paragraph_limit,
                table_limit=self.adapter.table_limit,
                pdf_page_limit=self.adapter.pdf_page_limit,
                pdf_requested=pdf_requested,
                pdf_eligible=pdf_eligible,
            ),
            metrics=InspectionMetrics(
                paragraph_count=result.paragraph_count,
                table_count=result.table_count,
                word_count=result.word_count,
                page_count=result.page_count,
                docx_roundtrip_supported=result.docx_roundtrip_supported,
                pdf_export_verified=result.pdf_export_verified,
            ),
            warnings=result.warnings,
        )
