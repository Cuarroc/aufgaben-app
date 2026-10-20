# Stall analysis: agents on 2026-10-20 (REF-APP-1)

**Observer:** Root (Claude Opus 5.5). Sources: ProjectA Dev 78f6df5e (`pa` CLI, window screenshots, DB read-only), process list, AgentsRoom `agents_list_live`. All times are UTC.

## 1. ProjectA worker `wk-1a15ab14a14-3` (Codex profile, task S1): STUCK

**Course of events:**
- 19:02, queue: `tq-1a15ab0d9f1-2` ready → dispatched → worker created (profile codex). The start took about 1–2 minutes, which is the normal dispatcher interval (30 s per sweep, `queue.rs:41`).
- 19:02, ProjectA activity log: "submit_guard: task written and echoed; agent output observed".
- Visible in the worker terminal: **Codex 0.162.1 never got to work.** At startup it showed the dialog "Hooks need review — 4 hooks are new or changed. Hooks can run outside the sandbox after you trust them". The task text was typed into that dialog and was never submitted.
- After 10 min ProjectA's stall detector flagged the worker correctly: card "Fehler — kein Output und keine Dateiänderung seit mindestens 10 min — vermutlich festgefahren".
- The worktree contains only `.agents/` (skills from ProjectA), and there is no commit.
- 19:15, Root chose "3. Continue without trusting (hooks won't run)" in the dialog, because that is the safe option. Codex then exited with `Error: config/read failed in TUI` and printed the task as "Unsent draft".

**Causes (observed):**
- **U1:** ProjectA's `codex` profile starts Codex with the user's **full personal configuration** (`~/.codex`: plugins claude-mem, impeccable, ecc, obsidian, plus project hooks). A new or changed hook there blocks every headless start with a dialog.
  - The same problem was already solved outside ProjectA: pa-orch uses a slim `CODEX_HOME` with no plugins, hooks or MCP (config comment from 02.10.: "headless workers hung after the first PreToolUse hook").
  - In ProjectA the codex profile has `"env": {}` (`agent-defaults.json`), so it does not use that slim home.
- **U2, false success signal:** the submit guard reported "task echoed; agent output observed" although only the dialog had received the text. This is the same error class as the known NT-17 / v1.4.0 problem ("modal startup chain trust → hooks review → usage notice"); the hooks dialog is evidently a new link in that chain.
- **U3, task text distorted:** newlines are lost (paragraphs run together, e.g. "...main@3bdbb2f).Read first"), the arrow `→` disappeared ("save→load" became "saveload"), and the visible draft ends after "npm ci, npm test, cargo test". It is unclear whether the text was truncated or the terminal only shows that much (hypothesis, unchecked).

**Effect:** none of S1 has been built. The ProjectA path (queue → worker) breaks at worker start whenever the profile is codex.

**Next step (Root):**
- Run the codex profile in ProjectA with the slim worker configuration: profile env `CODEX_HOME=<pa-orch codex-worker-home>`, set through the ProjectA settings.
- Then put S1 back in the queue and check that it really starts working (files and commits, not just the "echo").
- Track U2 and U3 as ProjectA defects, with red-first tests in ProjectA.

## 2. AgentsRoom agents (19:16)

- **No stuck agent.** Root is busy. Idle: UX-Architekt, UI-Designer (paused until 03:00 by agreement) and the temporary agent "Windows-Testfehler hq-test (PC)", which has one unread message. All others are offline.
- **Overhead seen in passing:**
  - 31 saved agents, two of them named "Orchestrator".
  - Four coordinators are registered for the project inbox: Orchestrator ×2, Stabschef · Ausführung and chief-of-staff.
  - That makes it unclear who actually coordinates (see the organisation review, F15).

## 3. Process list (19:12)

- Several `codex.exe` and `node.exe` processes, plus `codex-computer-use-swift` with the window title "ChatGPT is using your computer".
- Which session these belong to was not assigned (they may belong to Codex desktop/computer-use and not to ProjectA). Hypothesis, unchecked.
