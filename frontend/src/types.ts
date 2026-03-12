export type ProviderMode = "free" | "byok";

export interface HealthStatus {
  app: string;
  status: "ok";
  spire_available: boolean;
  spire_import_error: string | null;
}

export interface InspectionResponse {
  filename: string;
  stage: "completed" | "failed" | "idle" | "inspecting";
  provider_mode: ProviderMode;
  constraints: {
    paragraph_limit: number;
    table_limit: number;
    pdf_page_limit: number;
    pdf_requested: boolean;
    pdf_eligible: boolean;
  };
  metrics: {
    paragraph_count: number;
    table_count: number;
    word_count: number;
    page_count: number | null;
    docx_roundtrip_supported: boolean;
    pdf_export_verified: boolean;
  };
  warnings: string[];
}
