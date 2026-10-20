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
