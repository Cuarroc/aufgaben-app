# PROJECTA_ABNAHME: REF-APP-1 (in progress, not final)

- **Status:** working draft. Last updated 2026-10-20T19:46Z by Root. Nothing in this file is an acceptance yet.
- **Target:** `ProjectA_Neustart_FINAL.md` (2026-10-20), refined by the follow-up instruction of 2026-10-20 ("Präzisierung des laufenden Auftrags").

## 0. Two separate closing statements (both still open)

| # | Statement | Status | Evidence |
|---|---|---|---|
| S-A | The approved planner app ("Aufgaben") is usable. | open | Acceptance matrix §2, criteria A1–A11 |
| S-B | The development flow that was actually checked works through ProjectA. Necessary external interventions and remaining limits are listed. | open | §2 A12, §3, Before/after table §3a |

A finished reference app alone does **not** prove S-B.

## 1. Result and identity

| Field | Value |
|---|---|
| Goal ID | REF-APP-1 (AgentsRoom backlog `f5276c87`) |
| Approved scope | `docs/ABNAHMEVERTRAG.md` v1 (Elias "Ja", 2026-10-20 ~19:00Z) |
| ProjectA version used | ProjectA Dev 1.6.6, build from main `78f6df5e` (auto-update 2026-10-20T18:42Z) |
| App repo | github.com/Cuarroc/aufgaben-app |
| App commit / build | open |
| Windows environment | Windows 11 Pro 10.0.26200, 16 GB RAM (Elias's PC) |

## 2. Acceptance matrix

Criteria A1–A12 come from `docs/ABNAHMEVERTRAG.md`. All are open. Each row will be filled with: target, observed result, method, time, checker, commit/build, verdict and evidence.

## 3. Problems and fixes

| ID | Symptom | Cause (evidence or hypothesis) | Failed attempts | Fix | Re-check |
|---|---|---|---|---|---|
| P1 | The ProjectA codex worker does nothing for 10+ min. The card says "vermutlich festgefahren". | Observed: the Codex 0.162.1 start dialog "Hooks need review", caused by the user's full `~/.codex` configuration (`docs/nachweise/haenger-analyse.md`). | Chose "continue without trusting" → Codex exited with "config/read failed in TUI". | Configuration only, not a ProjectA commit: `agents.json` next to the Dev exe gives the codex profile `CODEX_HOME` = the slim worker home | S1 re-queued at 19:19Z; result open |
| P2 | ProjectA reports "task written and echoed; agent output observed" although the text only reached the dialog. | ProjectA defect: the submit guard does not recognise the hooks dialog as a blocker (hypothesis: a new dialog variant in the known NT-17 startup chain). | – | open (planned: red-first fix in ProjectA) | open |
| P3 | Task text loses newlines and `→`; the visible draft ends early. | Confirmed 19:42Z (attempt 4): the unsent composer text ended mid-sentence ("…pusht den Branch und oeffnet den"), so the tail is really lost, not just hidden. Cause still open (PTY write path). | – | Workaround, not a fix: a short task that points to a brief file in the repo | open |
| P5 | Codex "Update available" dialog at worker start; the submit guard typed the task + Enter into it → "Update now" → global `npm install -g @openai/codex` (0.162.1 → 0.163.0). | ProjectA defect, same class as P2: the guard does not know this startup modal and presses Enter blindly. | – | Config workaround: `check_for_update_on_startup = false` in the worker home. ProjectA fix: package PA-HOOKS-1 (red-first, tier A), in progress. Elias approved the update afterwards. | open |
| P6 | Attempt 4: Codex 0.163 opens the "/hooks" panel, "3 hooks need review" (ponytail plugin: SessionStart, UserPromptSubmit, SubagentStart); the worker idles 10+ min. | Observed: Codex 0.163 runs plugin hooks and asks for trust (0.160/0.161 did not). Plugin installed in the worker home on Elias's order (13.10.). | – | Root chose "trust all" in the panel (worker-home config), then sent the stuck task by hand (external intervention). | Next fresh worker start (S2) must start without any dialog |
| P7 | No pull request before review: ProjectA pushes and opens the PR only inside "merge worker", which then merges right away (`workers.rs:2371-2440`, `gh.rs:600`). | Design, observed in source. External review and repo CI cannot run on a PR before the merge; the review reads the local branch instead. | – | open (decide: accept, or add a "publish draft PR" step to ProjectA) | – |
| P8 | The worker renamed ProjectA's branch `pa/wk-…` to the name the brief asked for (`s1-durchstich`); ProjectA would have merged a branch that no longer exists. | Root's brief error (named a branch). ProjectA does not notice that its branch is gone. | – | Root renamed it back (`git branch -m`); later briefs never name a branch. ProjectA should check this (open). | open |
| P9 | A follow-up `pa worker send` to an idle Codex worker is never delivered: "readiness marker never appeared; task not written" (2×). The card asks the user to press Enter by hand, and `send ""` does not help. | ProjectA defect (hypothesis: the guard looks for the readiness marker only in output it receives after the send, and an idle Codex prints nothing new). | `pa worker send` 2×, `send ""` | Workaround: Root typed the text into the terminal by hand. ProjectA fix: separate red-first package after #1753 (same files, so serial). | open |
| P4 | `pa project create` is refused: "registering a project is a human decision" | Intended (`decisions.md:650`, verdict-token gate) | – | No fix. Elias registered the project in the window. Listed as a necessary human step. | – |

## 3a. Before/after: ProjectA

| Observed ProjectA problem | Concrete change / commit | Flow re-run | Actual result and evidence |
|---|---|---|---|
| P1 Codex worker blocked by the hooks dialog | `agents.json` override (local configuration, not a ProjectA commit) | S1 re-queued: `tq-1a15ac0ff71-1` → `wk-1a15ac13c7c-2` | open |
| P2 False "echoed" signal | open | open | open |
| P3 Task text distorted | open | open | open |

## 4. Work record: ProjectA vs. external

The full log is `docs/nachweise/projecta-protokoll.md`. Each line names where the step ran: "ProjectA" or "outside".

- **Through ProjectA so far:**
  - creating the GitHub repo (`pa github create`);
  - queuing tasks (`pa queue add`);
  - the dispatcher handing the task to a Codex worker;
  - stall detection on the agent card.
- **Outside ProjectA (AgentsRoom/Root):**
  - the draft and its mockup images (Codex CLI directly);
  - git init and the acceptance contract;
  - the `agents.json` configuration;
  - choosing the dialog option, screenshots and this report.
- **Human (Elias):**
  - approving the draft;
  - registering the project (verdict gate).

## 5. Open points and acceptance

These separate verdicts are open:
- Root;
- independent reviewers;
- ChatGPT;
- Elias.
