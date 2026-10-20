REF-APP-1 / S2 VOLLUMFANG (OPERATOR: UMSETZEN)
Repo: this project (aufgaben-app). Base: main after S1 is merged (git pull first; if S1 is not on main, stop with "BLOCKIERT: S1 fehlt").
Read first: docs/ABNAHMEVERTRAG.md (contract v1, do NOT edit) and docs/entwurf/*.png + index.html (the approved look; match it).

GOAL: complete the approved scope on top of S1 so every contract criterion A2–A10 can be checked in the built app.
BUILD:
- Projects: create, rename, archive. Tasks: create, edit in a right side panel (title required, description, status, due date), archive.
- Status "Offen" / "In Arbeit" / "Erledigt": click on the status control cycles it; filter chips "Alle · Offen · In Arbeit · Erledigt" with correct counts.
- Archive view (sidebar "Archiv"): restore; "Endgültig löschen" only there, behind a confirm dialog naming the item; deleted stays deleted after restart.
- Empty state for a project without tasks ("Erste Aufgabe anlegen").
- Save error: if saving fails (e.g. daten.json read-only), show the banner "Konnte nicht speichern: <Grund>. Deine Eingaben sind noch da." with "Erneut versuchen"; the edited text stays; retry succeeds once the cause is gone.
- Keyboard: all main actions reachable without mouse, visible focus; Esc closes panel/dialog.
- Keep the atomic save and .bak from S1.
TESTS: unit tests for filter counts, status cycle, archive/restore/delete, validation, save-error path (Rust: write failure keeps data and returns an error; frontend: banner shown and input kept). Add an axe-core check (vitest + jsdom or Playwright against the Vite build) with zero contrast violations.
EVIDENCE: npm test, cargo test, npm run tauri build (command + exit code + installer path) in the PR text; screenshots of the 8 contract views from the built app (not the mockup) under docs/nachweise/s2/.
GIT: branch s2-vollumfang, push, DRAFT PR "S2: Vollumfang laut Abnahmevertrag v1", PR text 3 German sentences + "## Report" (changes, evidence, NOT covered). No secrets, no --no-verify, no force-push.
Ask via ProjectA (pa ask) if a decision is needed. On a blocker: "BLOCKIERT: <reason>".
