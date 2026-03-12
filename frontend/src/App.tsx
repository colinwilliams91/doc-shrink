import { useEffect, useState } from "react";

import { InspectionResult } from "./components/InspectionResult";
import { ResumeInspectorForm } from "./components/ResumeInspectorForm";
import { fetchHealth } from "./lib/api";
import type { HealthStatus, InspectionResponse } from "./types";

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [result, setResult] = useState<InspectionResponse | null>(null);

  useEffect(() => {
    let active = true;

    fetchHealth()
      .then((response) => {
        if (!active) {
          return;
        }
        setHealth(response);
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }
        setHealthError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-10 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white/75 p-8 shadow-card backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Doc Shrink</p>
              <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Shrink resumes without forcing users into a builder-first workflow.
              </h1>
              <p className="text-base leading-7 text-ink/72">
                This implementation pass focuses on the system boundary: accept DOCX, inspect it,
                prove the Spire engine can round-trip it, and surface the constraints that shape the MVP.
              </p>
            </div>

            <div className="min-w-64 rounded-[1.75rem] bg-ink p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                API readiness
              </p>
              {health ? (
                <div className="mt-3 space-y-2 text-sm">
                  <p>Status: {health.status}</p>
                  <p>Spire import: {health.spire_available ? "available" : "missing"}</p>
                  {health.spire_import_error ? (
                    <p className="text-white/70">{health.spire_import_error}</p>
                  ) : null}
                </div>
              ) : healthError ? (
                <p className="mt-3 text-sm text-red-200">{healthError}</p>
              ) : (
                <p className="mt-3 text-sm text-white/70">Checking backend health...</p>
              )}
            </div>
          </div>
        </header>

        <ResumeInspectorForm onResult={setResult} />
        {result ? <InspectionResult result={result} /> : null}
      </div>
    </main>
  );
}

export default App;
