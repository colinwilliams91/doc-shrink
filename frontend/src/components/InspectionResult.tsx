import type { InspectionResponse } from "../types";

interface InspectionResultProps {
  result: InspectionResponse;
}

const metricClassName =
  "rounded-2xl border border-ink/10 bg-white/80 p-4 shadow-card backdrop-blur-sm";

export function InspectionResult({ result }: InspectionResultProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Inspection Result</h2>
          <p className="text-sm text-ink/70">{result.filename}</p>
        </div>
        <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          {result.stage}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">Words</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{result.metrics.word_count}</p>
        </article>
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">Paragraphs</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{result.metrics.paragraph_count}</p>
        </article>
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">Tables</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{result.metrics.table_count}</p>
        </article>
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">Pages</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {result.metrics.page_count ?? "Unknown"}
          </p>
        </article>
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">DOCX Roundtrip</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {result.metrics.docx_roundtrip_supported ? "Verified" : "Not verified"}
          </p>
        </article>
        <article className={metricClassName}>
          <p className="text-sm uppercase tracking-[0.16em] text-ink/50">PDF Export</p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {result.metrics.pdf_export_verified
              ? "Verified"
              : result.constraints.pdf_requested
                ? "Requested but not verified"
                : "Not requested"}
          </p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-ink/10 bg-white/75 p-5 shadow-card backdrop-blur-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">
            Constraints
          </h3>
          <dl className="mt-4 space-y-2 text-sm text-ink/80">
            <div className="flex justify-between gap-4">
              <dt>Paragraph limit</dt>
              <dd>{result.constraints.paragraph_limit}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Table limit</dt>
              <dd>{result.constraints.table_limit}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>PDF page limit</dt>
              <dd>{result.constraints.pdf_page_limit}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>PDF eligible</dt>
              <dd>{result.constraints.pdf_eligible ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-ink/10 bg-white/75 p-5 shadow-card backdrop-blur-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">
            Warnings
          </h3>
          {result.warnings.length === 0 ? (
            <p className="mt-4 text-sm text-ink/70">No warnings for this inspection pass.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              {result.warnings.map((warning) => (
                <li key={warning} className="rounded-2xl bg-accent/10 px-3 py-2 text-accent">
                  {warning}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
