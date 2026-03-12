from __future__ import annotations

import re
import zipfile
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from xml.etree import ElementTree


WORD_NAMESPACE = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


@dataclass(slots=True)
class SpireAvailability:
    available: bool
    error: str | None = None


@dataclass(slots=True)
class InspectionResult:
    paragraph_count: int
    table_count: int
    word_count: int
    page_count: int | None
    docx_roundtrip_supported: bool
    pdf_export_verified: bool
    warnings: list[str]


class SpireDocumentAdapter:
    def __init__(self, paragraph_limit: int, table_limit: int, pdf_page_limit: int) -> None:
        self.paragraph_limit = paragraph_limit
        self.table_limit = table_limit
        self.pdf_page_limit = pdf_page_limit

    @staticmethod
    def availability() -> SpireAvailability:
        try:
            __import__("spire.doc")
        except Exception as exc:  # pragma: no cover - depends on local environment
            return SpireAvailability(available=False, error=str(exc))
        return SpireAvailability(available=True)

    def inspect(self, file_bytes: bytes, filename: str, pdf_requested: bool) -> InspectionResult:
        warnings: list[str] = []
        paragraph_count, table_count, word_count = self._inspect_docx_xml(file_bytes)
        page_count: int | None = None
        docx_roundtrip_supported = False
        pdf_export_verified = False

        availability = self.availability()
        if not availability.available:
            warnings.append(
                "Spire.Doc.Free is not importable in the current environment; XML-only inspection was used."
            )
            return InspectionResult(
                paragraph_count=paragraph_count,
                table_count=table_count,
                word_count=word_count,
                page_count=page_count,
                docx_roundtrip_supported=docx_roundtrip_supported,
                pdf_export_verified=pdf_export_verified,
                warnings=warnings,
            )

        try:
            page_count, docx_roundtrip_supported, pdf_export_verified = self._run_spire_proof(
                file_bytes=file_bytes,
                filename=filename,
                pdf_requested=pdf_requested,
                warnings=warnings,
            )
        except Exception as exc:  # pragma: no cover - depends on vendor library behavior
            warnings.append(f"Spire proof step failed: {exc}")

        if paragraph_count > self.paragraph_limit:
            warnings.append(
                f"Document exceeds the free-tier paragraph limit ({paragraph_count}/{self.paragraph_limit})."
            )
        if table_count > self.table_limit:
            warnings.append(
                f"Document exceeds the free-tier table limit ({table_count}/{self.table_limit})."
            )
        if pdf_requested and page_count and page_count > self.pdf_page_limit:
            warnings.append(
                f"PDF export is limited to the first {self.pdf_page_limit} pages in Spire.Doc.Free."
            )

        return InspectionResult(
            paragraph_count=paragraph_count,
            table_count=table_count,
            word_count=word_count,
            page_count=page_count,
            docx_roundtrip_supported=docx_roundtrip_supported,
            pdf_export_verified=pdf_export_verified,
            warnings=warnings,
        )

    def _run_spire_proof(
        self,
        file_bytes: bytes,
        filename: str,
        pdf_requested: bool,
        warnings: list[str],
    ) -> tuple[int | None, bool, bool]:
        from spire.doc import Document, FileFormat  # type: ignore

        with TemporaryDirectory(prefix="doc-shrink-") as temp_dir:
            temp_path = Path(temp_dir)
            input_path = temp_path / filename
            output_docx_path = temp_path / "proof-output.docx"
            output_pdf_path = temp_path / "proof-output.pdf"
            input_path.write_bytes(file_bytes)

            document = Document()
            document.LoadFromFile(str(input_path))

            page_count: int | None = None
            if hasattr(document, "GetPageCount"):
                page_count = int(document.GetPageCount())

            document.SaveToFile(str(output_docx_path), FileFormat.Docx2019)
            docx_roundtrip_supported = output_docx_path.exists()
            pdf_export_verified = False

            if pdf_requested:
                if page_count is not None and page_count <= self.pdf_page_limit:
                    document.SaveToFile(str(output_pdf_path), FileFormat.PDF)
                    pdf_export_verified = output_pdf_path.exists()
                else:
                    warnings.append(
                        "PDF verification was skipped because the page count is unknown or exceeds the free-tier cap."
                    )

            if hasattr(document, "Close"):
                document.Close()

            return page_count, docx_roundtrip_supported, pdf_export_verified

    def _inspect_docx_xml(self, file_bytes: bytes) -> tuple[int, int, int]:
        with zipfile.ZipFile(BytesIO(file_bytes)) as archive:
            document_xml = archive.read("word/document.xml")

        root = ElementTree.fromstring(document_xml)
        paragraph_count = len(root.findall(".//w:p", WORD_NAMESPACE))
        table_count = len(root.findall(".//w:tbl", WORD_NAMESPACE))
        text_fragments = [node.text or "" for node in root.findall(".//w:t", WORD_NAMESPACE)]
        word_count = len(re.findall(r"\b\w+\b", " ".join(text_fragments)))
        return paragraph_count, table_count, word_count
