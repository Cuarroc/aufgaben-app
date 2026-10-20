REF-APP-1 / S1 DURCHSTICH (OPERATOR: UMSETZEN)
Repo: this project (C:\Users\Cuarr\orca\aufgaben-app, origin github.com/Cuarroc/aufgaben-app, base main@3bdbb2f).
Read first: README.md and docs/ABNAHMEVERTRAG.md (approved contract v1, do NOT edit it). Design images: docs/entwurf/*.png and docs/entwurf/index.html (reuse its CSS look).

GOAL: the smallest real Windows desktop app "Aufgaben" in which a user creates ONE project with ONE task, closes the app completely, reopens it and finds both again. This slice becomes part of the final app.

BUILD:
- Tauri 2 + React + TypeScript (Vite), app name "Aufgaben", identifier "dev.cuarroc.aufgaben", German UI, window 1200x760.
- Rust store: data file %APPDATA%\Aufgaben\daten.json (use Tauri app data dir resolved for that identifier or an explicit Aufgaben folder); schema {version:1, projects:[{id,name,archived,createdAt}], tasks:[{id,projectId,title,description,status:"offen"|"in_arbeit"|"erledigt",due?,archived,createdAt}], lastProjectId?}.
- Atomic save: write daten.json.tmp, flush, rename over daten.json; keep previous version as daten.bak.json. A corrupt or unreadable file must not be overwritten silently: return an error the UI shows.
- Tauri commands: load_data, save_data (or finer create/update commands). Validation in Rust: project name and task title must be non-empty after trim.
- UI for this slice: sidebar with projects + "Neues Projekt"; main area with tasks of the selected project + "Neue Aufgabe"; inline error "Bitte einen Titel eingeben." for empty title; restore last selected project on start. Status/filter/archive come in later slices, keep the code ready for them.

TESTS (red-first where practical, all must pass):
- Rust unit tests: save->load roundtrip; atomic write leaves the old file intact when the temp write fails; .bak written; empty title rejected; corrupt JSON reported as error, file untouched.
- Frontend: vitest test for the empty-title validation message.

CI: add .github/workflows/ci.yml (windows-latest): npm ci, npm test, cargo test (src-tauri), and `npm run tauri build` uploading the NSIS installer as an artifact.

EVIDENCE: run locally `npm test`, `cargo test` (in src-tauri), `npm run tauri build`; put command + exit code + installer path into the PR text.
Then a manual restart check: start the built exe, create project "Testprojekt A" with task "Erste Aufgabe", close the app (process gone), reopen, confirm both are there; record what you observed. Use only test data.

GIT: branch s1-durchstich, small commits, push, open a DRAFT PR to main titled "S1: Durchstich – ein Projekt mit einer Aufgabe übersteht Neustart". PR text: 3 German sentences for Elias, then "## Report" with changes, evidence (commands + exit codes), what is NOT covered.
Never commit secrets, never --no-verify, never force-push. Do not touch docs/ABNAHMEVERTRAG.md.
If you need a decision, ask via ProjectA (pa ask) and wait. On a real blocker stop with "BLOCKIERT: <reason>".
