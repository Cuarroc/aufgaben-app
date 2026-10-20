# ProjectA run log (REF-APP-1)

Each line: UTC time | actor | where (ProjectA / outside) | action | result.

2026-10-20T18:58:36Z | Root (Claude, AgentsRoom) | outside | git init, contract v1, draft images, README | done
2026-10-20T18:59:27Z | Root | ProjectA Dev (78f6df5e) | started projecta.exe; pa providers: claude/codex/opencode/kimi connected | ok
2026-10-20T18:59:27Z | Root | ProjectA (pa CLI) | pa project create --name aufgaben-app --path ... | refused, exit 1: 'missing x-verdict-token header: registering a project is a human decision' (by design, decisions.md:650) -> Elias registers in the window
2026-10-20T19:01:50Z | Elias | ProjectA Dev window | registered project aufgaben-app (verdict gate) -> pj-1a15ab00ec1-1 | ok
2026-10-20T19:01:50Z | Root | ProjectA (pa github create --public) | created github.com/Cuarroc/aufgaben-app and pushed main 3bdbb2f | ok, exit 0, ls-remote confirms
2026-10-20T19:01:50Z | Root | ProjectA (pa queue add --profile codex) | S1 Durchstich queued as tq-1a15ab0d9f1-2 | status ready
2026-10-20T19:03:53Z | ProjectA queue dispatcher | ProjectA | tq-1a15ab0d9f1-2 dispatched -> worker wk-1a15ab14a14-3 (profile codex, worktree .projecta-worktrees/wk-1a15ab14a14-3); submit_guard: task echoed, agent output observed | running
2026-10-20T19:15Z | Root | ProjectA Dev window | worker wk-1a15ab14a14-3 stuck in Codex "Hooks need review" dialog; chose "continue without trusting" -> codex exited "config/read failed in TUI"; task never submitted (see haenger-analyse.md) | failed
2026-10-20T19:25Z | Root | outside (ProjectA Dev install dir) | agents.json override: codex profile env CODEX_HOME = slim pa-orch codex-worker-home (no plugins/hooks/MCP); Dev app closed for restart | done
2026-10-20T19:32Z | Root | ProjectA Dev window | attempt 2 (wk-1a15ac13c7c-2) again in "Hooks need review" (3 hooks): the user-level %USERPROFILE%\.codex\hooks.json is still seen even with CODEX_HOME = slim home; card showed "Blockiert - wartet am Prompt" (ProjectA detected it) | failed
2026-10-20T19:36Z | Root | outside (pa-orch codex-worker-home/config.toml, backup .bak-20261020-hooks) | these hooks marked known and disabled (enabled=false + trusted_hash); TOML validated | done
2026-10-20T19:37Z | Root | ProjectA Dev window | archived wk-1a15ac13c7c-2 ("Ja, endgueltig archivieren"); re-queued S1 as tq-1a15ac7c989-11 | queued
2026-10-20T19:27Z | ProjectA worker wk-1a15ac81b22-12 (attempt 3) | ProjectA | hooks dialog gone (slim home fix worked), Codex reached "Ask Codex to do anything", then showed "Update available 0.162.1 -> 0.163.0"; ProjectA's submit guard typed the task + Enter into it -> option 1 "Update now" -> `npm install -g @openai/codex` ran, Codex globally updated to 0.163.0, worker exited | FAILED + unauthorized install (P5)
2026-10-20T19:44Z | Root | outside (codex-worker-home/config.toml) | check_for_update_on_startup = false (key verified in the Codex binary) | done
2026-10-20T19:45Z | Root via Codex CLI | outside (ProjectA repo, worktree wt-pa-hooks) | PA-HOOKS-1 round 1: BLOCKIERT (needs seam main.rs:549); round 2 dispatched with main.rs assigned and the update dialog added | running
