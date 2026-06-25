# Fivo Sense — Implementation Roadmap

## Phase 0: Setup (2-3 days)
- [ ] Move docs to fivosense/ folder
- [ ] Initialize git repo with MIT license
- [ ] Setup TypeScript + Vitest + ESLint
- [ ] Create package.json with dependencies (tree-sitter, @babel/parser, etc.)
- [ ] CLI skeleton: npx fivo-sense init

## Phase 1: FivoCore MVP (2-3 weeks)
- [ ] engine/graph.ts — @babel/parser + @babel/traverse for JS/TS data-flow graph
- [ ] engine/sources.ts + engine/sinks.ts — input/sink catalogs
- [ ] engine/taint.ts — source→sink path tracer
- [ ] engine/reach.ts — reachability filter (entry-point reachable only)
- [ ] rules/destructive.ts + rules/secrets.ts — deterministic checks
- [ ] hooks/agent.ts — PreToolUse block (exit 2)
- [ ] core/scope.ts — git diff scope
- [ ] Test with 2-3 real buggy AI-generated repos

## Phase 2: Neuro-Symbolic + Proof (2-3 weeks)
- [ ] skill/SKILL.md + path-judge prompt — host AI per-path judgment
- [ ] AI FP pruning integration
- [ ] Taint-trace proof output (exact paths in findings)
- [ ] features/fix.ts + engine/verify.ts — self-verified fix
- [ ] engine/poc.ts — optional failing security test
- [ ] engine/adversary.ts — adversarial verification (AI attacker)
- [ ] features/roast.ts + features/badge.ts
- [ ] editors/vscode.ts + /sense trigger
- [ ] PUBLISH to npm + GitHub

## Phase 3: Expand (3-4 weeks)
- [ ] Generation-guard mode (PreToolUse real-time)
- [ ] Dead-code detection + .fivosense/archive/ system
- [ ] More languages (Python via tree-sitter)
- [ ] More editors (Cursor/JetBrains/Neovim)
- [ ] Optional BYOK (ai/client.ts)

## Phase 4: Launch (1-2 weeks)
- [ ] VS Code Marketplace submission
- [ ] Documentation site
- [ ] Demo gif + screenshots
- [ ] Product Hunt / Reddit / X launch

## De-Risk PoC (DO FIRST!)
- [ ] Simple buggy JS file
- [ ] @babel/parser → AST
- [ ] Extract one source→sink path
- [ ] Prove approach works

---
**Status:** Ready to start Phase 0
**Next:** De-risk PoC to validate core approach
