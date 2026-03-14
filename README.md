# Doc Shrink

Doc Shrink is a web-first resume optimization tool for shrinking existing software-engineering resumes. The MVP accepts DOCX input, inspects document structure, and is being built toward a pipeline that condenses wording, tightens layout, and exports recruiter-ready output.

## Current Status

Implementation has started with Epic 1 foundations:

- FastAPI backend scaffold
- React + TailwindCSS frontend scaffold
- `Spire.Doc.Free` document-engine boundary
- DOCX upload + inspection proof path
- API health endpoint exposing document-engine readiness

The current app does not condense resumes yet. It verifies the highest-risk integration first: loading DOCX files, inspecting free-tier constraints, and proving roundtrip support before deeper rewrite work begins.

## Repository Layout

```text
backend/
  app/
    api/
    services/
frontend/
  src/
```

## Approved MVP Stack

- Backend: Python + FastAPI
- Frontend: React + TailwindCSS + Vite
- LLM abstraction: LiteLLM
- Document engine: `Spire.Doc.Free`
- Default no-cost provider path: Hugging Face
- Optional provider mode: bring your own key

## Local Development

### Backend

```ps1
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000` and exposes:

- `GET /api/health`
- `POST /api/process/inspect`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

If your backend is not on the default port, set `VITE_API_BASE_URL`.

## Current Proof Flow

The first implemented user flow is:

1. Upload a DOCX resume
2. Choose provider mode and whether to request PDF verification
3. Run inspection
4. View counts for words, paragraphs, tables, pages, and Spire verification state

## Spire.Doc.Free Constraints

The implementation currently treats these as explicit product constraints:

- 500 paragraph read/write limit
- 25 table read/write limit
- PDF export capped to the first 3 pages in the free tier

Those constraints are surfaced during inspection so they can shape Phase 1 behavior before condensation and layout work ship.

## Next Planned Implementation Work

1. Internal resume model and DOCX parsing normalization
2. LiteLLM provider adapter
3. Prompt contract and guarded condensation pipeline
4. Deterministic layout compression
5. Artifact generation and optional PDF export
