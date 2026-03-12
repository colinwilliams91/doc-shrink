import { useMemo, useState } from "react";

import { inspectResume } from "../lib/api";
import type { InspectionResponse, ProviderMode } from "../types";

interface ResumeInspectorFormProps {
  onResult: (result: InspectionResponse) => void;
}

export function ResumeInspectorForm({ onResult }: ResumeInspectorFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [providerMode, setProviderMode] = useState<ProviderMode>("free");
  const [omissionLevel, setOmissionLevel] = useState(35);
  const [wantsPdf, setWantsPdf] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const omissionLabel = useMemo(() => {
    if (omissionLevel <= 15) {
      return "Light trim";
    }
    if (omissionLevel <= 45) {
      return "Balanced compression";
    }
    return "Aggressive shrink";
  }, [omissionLevel]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a DOCX resume before running inspection.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await inspectResume({
        file,
        providerMode,
        wantsPdf,
      });
      onResult(result);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Inspection failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-[2rem] border border-ink/10 bg-white/80 p-6 shadow-card backdrop-blur-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">
          Phase 1 intake
        </p>
        <h2 className="text-3xl font-semibold text-ink">Inspect a DOCX resume</h2>
        <p className="max-w-2xl text-sm leading-6 text-ink/70">
          This first implementation pass verifies the document engine boundary before condensation,
          layout compression, and final export are built out.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="flex min-h-48 cursor-pointer flex-col justify-between rounded-[1.75rem] border border-dashed border-ink/20 bg-paper/70 p-5 transition hover:border-accent/70 hover:bg-paper">
          <div>
            <p className="text-lg font-semibold text-ink">Upload resume</p>
            <p className="mt-2 text-sm text-ink/70">DOCX only for Phase 1.</p>
          </div>
          <div>
            <p className="text-sm text-ink/70">
              {file ? file.name : "Drag a file here or click to browse."}
            </p>
            <input
              accept=".docx"
              className="sr-only"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
        </label>

        <div className="space-y-5 rounded-[1.75rem] border border-ink/10 bg-paper/50 p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
              Provider mode
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["free", "byok"] as const).map((mode) => (
                <button
                  key={mode}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    providerMode === mode
                      ? "bg-ink text-white"
                      : "bg-white text-ink hover:bg-white/80"
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    setProviderMode(mode);
                  }}
                  type="button"
                >
                  {mode === "free" ? "Hugging Face free" : "BYOK"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
                Omission level
              </p>
              <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sage">
                {omissionLabel}
              </span>
            </div>
            <input
              className="mt-4 w-full accent-accent"
              max={75}
              min={0}
              step={5}
              type="range"
              value={omissionLevel}
              onChange={(event) => setOmissionLevel(Number(event.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs text-ink/50">
              <span>0%</span>
              <span>{omissionLevel}%</span>
              <span>75%</span>
            </div>
          </div>

          <label className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-ink">
            <span>Attempt PDF verification</span>
            <input
              checked={wantsPdf}
              className="h-4 w-4 accent-accent"
              type="checkbox"
              onChange={(event) => setWantsPdf(event.target.checked)}
            />
          </label>
        </div>
      </div>

      {error ? <p className="mt-5 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/10 pt-5">
        <p className="text-sm text-ink/60">Target range for the eventual MVP remains 350-550 words.</p>
        <button
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Inspecting..." : "Run inspection"}
        </button>
      </div>
    </form>
  );
}
