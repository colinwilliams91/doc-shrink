import type { HealthStatus, InspectionResponse, ProviderMode } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Failed to load API health.");
  }
  return response.json() as Promise<HealthStatus>;
}

export async function inspectResume(input: {
  file: File;
  providerMode: ProviderMode;
  wantsPdf: boolean;
}): Promise<InspectionResponse> {
  const body = new FormData();
  body.append("file", input.file);
  body.append("provider_mode", input.providerMode);
  body.append("output_formats", input.wantsPdf ? "docx,pdf" : "docx");

  const response = await fetch(`${API_BASE_URL}/process/inspect`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(payload?.detail ?? "Failed to inspect resume.");
  }

  return response.json() as Promise<InspectionResponse>;
}
