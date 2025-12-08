# Film Shooting Schedule App — Plan

## 1) Objectives
- Build a responsive web app to create/manage multi-day film shooting schedules.
- Core table columns: Time From, Time To, Scene, Location, Cast, Notes; include a full-width Text Row type.
- Inline editing, drag-and-drop for days and rows, adjustable column widths (sliders).
- Project management: create/open/save (overwrite by exact name or new), rename, delete, archive (auto based on past dates), browse lists (active vs archived), add top notes and scalable JPG/PNG logo.
- Export: CSV (one row per schedule item with its date), Print/PDF with compact A4 layout, logo top-right, hidden controls, and proper text wrapping; date format DD-MM-YYYY across UI and exports.
- No auth; server-side persistence using FastAPI + MongoDB; excellent UX and manual save only.

## 2) Implementation Steps (by Phases)

### Phase 1 — Core POC (Isolation)
Rationale: Level 1 app; POC is optional. We'll run a light POC to de-risk PDF/CSV and uploads.

Scope
- Minimal backend endpoints to validate:
  - /api/health (Mongo connectivity) and simple Project model serialize/deserialize with DD-MM-YYYY.
  - /api/uploads/logo (multipart JPG/PNG) storing file and returning URL; serve static files.
  - /api/projects/export/csv (accepts mock project payload) to verify CSV flattening and date formatting.
  - /api/projects/print-preview (accepts mock payload) returns HTML using print CSS (table-layout: fixed, word-wrap, no controls) to confirm wrapping/fit.
- One Python test script test_core.py to call the above, upload a tiny in-memory PNG/JPG, validate HTTP 200, headers, sample CSV rows, and presence of logo URL in print HTML.

User Stories (POC)
1. As a user, I want the server to confirm it can connect to the database.
2. As a user, I want to upload a JPG/PNG logo and immediately get a working URL back.
3. As a user, I want a CSV export that includes one row per schedule item with DD-MM-YYYY dates.
4. As a user, I want a print preview that hides controls and wraps long text correctly.
5. As a user, I want project dates and fields to roundtrip without losing formatting.

Exit Criteria
- All POC endpoints return correct responses; test_core.py assertions pass.

---

### Phase 2 — Main App Development (Complete Feature Set)

Frontend (React + shadcn/ui + dnd-kit)
- Layout: Editor page (schedule builder), Project browser modal/page (Active/Archived tabs), Print view, Export controls.
- Schedule UI:
  - Start with 1 day and 1 empty row; add/remove/reorder days and rows via drag-and-drop (dnd-kit), including cross-day moves.
  - Inline editing (controlled inputs/contenteditable) for all fields; Text Row type spans full width.
  - Column width sliders (per project), persisted; widths applied in editor and print.
  - Unsaved changes indicator; explicit Save button with status (Saved/Unsaved/Failed).
  - Mobile: stacked cards per day and per row; ensure tap-friendly controls.
- Print/PDF:
  - Dedicated print layout route/component; @media print rules hide UI; logo top-right; table-layout: fixed; overflow-wrap:anywhere; white-space:normal; break-inside: avoid-row.
  - A4 portrait/landscape toggle (UI control affects layout class); rely on browser print to generate PDF.
- Export:
  - CSV export triggers backend endpoint with project id to stream CSV.
- Projects:
  - Toolbar to rename, upload logo (JPG/PNG; size-validated), edit top notes (scalable), browse/load/save/delete.
  - Browse view separates Active vs Archived; toggle to hide/show archived.

Backend (FastAPI + MongoDB)
- Data model (projects collection):
  - name (unique), notes (string), logo_url (string), column_widths (dict per column), days: [ { date: DD-MM-YYYY, rows: [ { type: 'item'|'text', time_from, time_to, scene, location, cast, notes } ] } ], created_at, updated_at, archived (bool, also computed by date check).
- Endpoints (all prefixed with /api):
  - GET /api/health
  - GET /api/projects?include_archived=false — list grouped (active/archived)
  - POST /api/projects/save — upsert by exact name; manual save only
  - GET /api/projects/{id}
  - PUT /api/projects/{id} — rename/update metadata/content
  - POST /api/projects/rename — rename by exact name
  - DELETE /api/projects/{id}
  - POST /api/uploads/logo — multipart JPG/PNG; return URL; static serving enabled
  - GET /api/projects/{id}/export.csv — stream CSV (DD-MM-YYYY)
  - GET /api/projects/{id}/print — return minimal HTML (used by frontend print preview if needed)
- Serialization helpers to ensure dates and ObjectIds convert to strings; enforce DD-MM-YYYY; safe file names; size/type validation.
- Auto-archive rule: mark archived true if all day dates < today; computed on list and on save.

Testing & Quality
- Lint Python/JS; ensure esbuild bundle check passes.
- Call testing agent for E2E: create project, add days/rows, reorder, edit, upload logo, save, reload, export CSV, open print preview, verify wrapping, delete project.

User Stories (Main App)
1. As a user, I can create a new project with 1 day/1 empty row and a custom name.
2. As a user, I can add and reorder days and rows via drag-and-drop.
3. As a user, I can insert a full-width Text Row for section headlines.
4. As a user, I can edit any field inline without modals.
5. As a user, I can adjust column widths with sliders and see changes applied instantly.
6. As a user, I can upload a JPG/PNG logo that scales and appears top-right in print.
7. As a user, I can add top notes that scale and print.
8. As a user, I can save (overwrite by exact name) or save as new; see clear save status.
9. As a user, I can browse all projects, load, rename, delete; archived items appear separately or can be hidden.
10. As a user, I can export CSV (one row per item with its date) and print to PDF where all text wraps and fits on A4.

Tech/Lib Choices
- Drag-and-drop: dnd-kit.
- Styling/UI: shadcn/ui + custom CSS; table-layout: fixed for wrapping.
- CSV: Python csv with streaming Response; UTF-8 with BOM optional for Excel.
- Print: CSS-driven @media print; browser print-to-PDF; A4 sizing classes for portrait/landscape.
- Images: Stored on disk (e.g., /static/uploads) with sanitized names; URL persisted in project.

Environment/Conventions
- API routes under /api; backend binds 0.0.0.0:8001; frontend uses REACT_APP_BACKEND_URL.
- Dates stored and returned as DD-MM-YYYY; timezone-aware checks for archiving.
- No autosave; front-end state tracks dirty changes; Save button triggers POST /save.

Deliverables
- Working FastAPI backend with all endpoints + Mongo models.
- React frontend with complete editor, browser, print, export.
- Print-optimized CSS and CSV export.
- E2E tests via testing agent; all major flows green.

## 3) Next Actions
1. Implement Phase 1 minimal endpoints + print CSS skeleton and create test_core.py; run and fix until green.
2. Get design guidelines (typography, spacing, colors) and implement UI skeleton.
3. Build full backend CRUD + serialization helpers + CSV/print endpoints.
4. Build frontend editor with dnd-kit, inline editing, sliders, logo upload, save/load flows.
5. Implement print view and CSV integration; finish Active/Archived browse.
6. Run E2E testing agent; fix issues; repeat until clean.

## 4) Success Criteria
- Data: Projects persist on server; list/browse/rename/delete/overwrite by exact name works.
- UX: Clean, mobile-responsive, clear save status, manual save only.
- Schedule: Multi-day with reorderable days/rows; inline editing; Text Rows; adjustable column widths persisted.
- Exports: CSV correct with DD-MM-YYYY; Print/PDF fits on A4 (both orientations), all text wrapped, no UI controls, logo top-right.
- Archiving: Projects with past dates auto-archived and can be shown/hidden or in separate section.
- Quality: No red console errors, frontend builds/bundles, API uses /api prefix, images upload/serve, all tests pass.
