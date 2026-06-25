# Fivo Sense — Build Process & Engineering Plan

<aside>
🛠️

**Build Process & Engineering Plan** — **FivoCore neuro-symbolic** approach. Asli IP = ek taint-graph engine (real code, copy-proof), AI sirf smart path-judge. Research-grade accuracy (F1 0.91–0.95), phir bhi lean. Ye main Blueprint ka companion hai.

</aside>

## 1. Build Philosophy

- **Engine = moat.** Asli value FivoCore (taint-graph) hai — yeh real code hai, copy/paste nahi ho sakta, install karna padta hai. *(Isiliye log star/fork/install karenge.)*
- **Neuro-symbolic split:** pakka code → data-flow graph (recall + completeness); host AI → har path judge (FP pruning + reasoning). [Research](https://arxiv.org/html/2405.17238v3) yahi jeetata hai.
- **AI ko poora codebase mat do** — sirf focused source→sink paths. Fast, sasta, accurate.
- **Reliability-critical (block/secret) deterministic**, AI sirf judgement.
- **Commodity dobara mat banao** — jo Anthropic/Snyk free de rahe unse mat lado; differentiator = proof + neuro-symbolic + cross-editor.

## 2. Tech Stack

| Cheez | Tech | Kyun |
| --- | --- | --- |
| Engine base | tree-sitter (MIT, multi-lang) | AST → data-flow graph |
| Engine code | TypeScript (Node 20+) | graph, taint, verify |
| Path-judge | Host AI (skill) + optional BYOK | sanitized? exploitable? |
| Hooks | TypeScript | PreToolUse + git hooks |
| Packaging | npm + VS Code Marketplace | distribution |
| Tests | Vitest + fixture repos + golden set | accuracy regression |

## 3. Codebase Structure

```jsx
fivosense/
├── package.json / README.md (MIT, badge, demo gif) / LICENSE
├── skill/
│   ├── SKILL.md            # path-judge instructions (host AI)
│   ├── AGENTS.md           # cross-CLI hookup
│   └── prompts/            # judge / roast / fix templates
├── engine/                 # ★ FivoCore — asli IP
│   ├── graph.ts            # tree-sitter → data-flow graph
│   ├── sources.ts          # untrusted input catalog
│   ├── sinks.ts            # dangerous sink catalog
│   ├── taint.ts            # source→sink path tracer (proof)
│   ├── reach.ts            # reachability filter (entry-point reachable)
│   ├── verify.ts           # fix ke baad graph re-check
│   ├── adversary.ts        # adversarial verify (AI attacker)
│   └── poc.ts              # optional failing security test
├── hooks/
│   ├── agent.ts            # PreToolUse intercept → block (exit 2)
│   └── git.ts              # pre/post-push audit
├── rules/
│   ├── destructive.ts      # rm -rf, DROP TABLE, mass delete
│   └── secrets.ts          # API key / token regex
├── core/
│   ├── scope.ts            # git diff → changed code
│   └── orchestrator.ts     # flow control
├── features/               # roast.ts, badge.ts, fix.ts
├── ai/                     # host-AI bridge + optional BYOK
├── editors/                # vscode.ts (pehla adapter)
├── cli/                    # npx fivo-sense init
└── test/fixtures/          # jaan-boojh ke buggy repos
```

## 4. Codebase Size

| Stage | Size | Note |
| --- | --- | --- |
| Engine (FivoCore) | ~3,000–5,000 lines TS | apni AI model nahi; tree-sitter ready-made |
| Skill + hooks + rules + features | ~1,500–2,000 lines + markdown | host AI chalaye |
| **Total realistic** | **~5k–7k lines** | heavy SAST se chhota, "sirf prompt" se bada |

<aside>
💡

Bulk reasoning host AI karta hai → koi 10MB knowledge pack nahi. Par engine (graph/taint) real compiled code hai — yahi serious product banata hai.

</aside>

## 5. Phase-by-Phase Build Plan

### Phase 0 — Setup · 3 kaam (~2-3 din)

- [ ]  Repo + MIT + README skeleton
- [ ]  TypeScript + Vitest + lint
- [ ]  `npx fivo-sense init` skeleton

### Phase 1 — FivoCore MVP · 7 kaam (~2-3 hafte)

- [ ]  `engine/graph.ts` — tree-sitter se JS/TS ka data-flow graph
- [ ]  `engine/sources.ts` + `engine/sinks.ts` — input/sink catalog
- [ ]  `engine/taint.ts` — source→sink path tracer
- [ ]  `rules/destructive.ts` + `rules/secrets.ts`
- [ ]  `hooks/agent.ts` — PreToolUse block (exit 2)
- [ ]  `core/scope.ts` — git diff scope
- [ ]  `engine/reach.ts` — reachability filter (sirf external entry-point se reachable code)

**Done when:** ek buggy fixture repo pe engine sahi source→sink paths nikaal de + destructive action block ho.

### Phase 2 — Neuro-Symbolic + Proof · 8 kaam (~2-3 hafte)

- [ ]  `skill/SKILL.md` + path-judge prompt — host AI har path judge kare (sanitized? exploitable?)
- [ ]  FP pruning (AI confirm)
- [ ]  Taint-trace proof output (exact path findings mein)
- [ ]  `features/fix.ts` + `engine/verify.ts` — self-verified fix
- [ ]  `engine/poc.ts` — optional failing security test
- [ ]  `engine/adversary.ts` — adversarial verify (AI attacker exploitability check)
- [ ]  `features/roast.ts` + `features/badge.ts`
- [ ]  `editors/vscode.ts` + `/sense` trigger → **Publish (npm + GitHub MIT)**

**Done when:** har finding ke saath data-flow proof + verified fix mile, FP under 10%.

### Phase 3 — Expand · 4 kaam (~3-4 hafte)

- [ ]  Generation-guard mode (PreToolUse real-time secure-by-construction)
- [ ]  Dead-code + "code working" mode (usi graph se) — dead-code **delete nahi**, project root ke **`.fivosense/archive/`** mein move (pehle `.fivosense/` ghar banta, uske andar `archive/`); `.fivosense/` default **gitignored** (commit clutter na ho, local restore easy) + optional `archiveCommit` flag se track bhi ho sake; `.gitignore` samajh ke already-ignored files dobara archive na kare — zaroorat pe wapas laaya ja sake
- [ ]  More languages (tree-sitter grammars) + editors (Cursor/JetBrains/Neovim)
- [ ]  Optional BYOK (`ai/client.ts`) for plain editors

### Phase 4 — Launch · 2 kaam (~1-2 hafte)

- [ ]  VS Code Marketplace + npm + docs site
- [ ]  Demo gif + launch post (Product Hunt / Reddit / X)

**Done when:** public, polished, MIT par live.

## 5.1 🔄 Git Push Audit — exact behaviour

- **Auto-trigger:** har `git push` se pehle apne aap chale (`pre-push` hook).
- **Pehli baar:** poora codebase audit → baseline result cache.
- **Incremental (aage har baar):** sirf `git diff` ka **badla hua code** scan → fast + sasta; saara repo dobara nahi.
- **Mode = `block` (default):** critical/high bug mile to push **ROK** + reason + fix dikhae.
- **Mode = `warn-only`:** sirf warning, push jaane do (rokega nahi).
- **Severity threshold:** config se set — kis level pe roke (sirf critical / ya high+).
- **Escape hatch:** emergency mein `git push --no-verify` ya `fivosense skip`.
- **Cache:** pichhle findings cache; sirf naya diff re-judge hota hai (tez).
- **Config file:** `.fivosense.json` — mode, threshold, ignore paths.

## 6. Bade pieces kaise banenge (mini how-to)

- **Graph builder (`graph.ts`):** tree-sitter grammar load → parse → AST traverse → variables + function calls ka data-flow graph; har node tag (source / sink / pass-through).
- **Taint tracer (`taint.ts`):** har sink se peeche (backward) trace → agar koi untrusted source tak bina sanitizer ke pahunche → "tainted path" mark, exact hops record (= proof).
- **Path-judge (skill):** sirf woh ek path AI ko do → AI bole exploitable hai ya FP → noise kam.
- **PreToolUse hook:** agent ka proposed action read → rules + (Phase 3) live graph check → dangerous to exit code 2 + reason.
- **Verify (`verify.ts`):** fix apply ke baad graph dobara banao → tainted path gaya? regression aaya? confirm.
- **PoC (`poc.ts`):** tainted path ke liye chhota failing test; user apne env mein chalaye.
- **Badge:** findings → grade A–F → README markdown badge string.
- **Reachability filter (`reach.ts`):** graph se sirf woh nodes rakho jo external entry-point (API/route/input) se pahunche → surface karib 97% kam ([OpenAnt](https://arxiv.org/html/2606.19149)), AI ko kam kaam.
- **Adversarial verify (`adversary.ts`):** path-judge ke baad AI ko attacker banao — "is path ko exploit kaise karoge?" exploit na bane to FP; bane to "proven exploitable" label.

## 7. Testing & Quality (per-component accuracy targets)

| Component | Tarika | Target |
| --- | --- | --- |
| Graph/taint recall | fixture vulns | pakad ~85–95% |
| AI path-judge (FP pruning) | golden set | FP **under 10%** |
| Auto-fix | re-verify | regression ~0 |
| Overall (neuro-symbolic) | OWASP-style fixtures | F1 ~0.90+ ([research benchmark](https://www.researchgate.net/publication/397820307_Large_Language_Models_Versus_Static_Code_Analysis_Tools_A_Systematic_Benchmark_for_Vulnerability_Detection)) |
- **Fixture repos:** jaan-boojh ke buggy code → har release pe run → regression pakdo.
- **Golden findings set:** known vulns kitne pakde + kitne FP measure karo.

## 8. Build Timeline (summary)

| Phase | Kya milta hai | Time |
| --- | --- | --- |
| 0 | Setup | ~2-3 din |
| 1 | FivoCore engine (graph + taint + rules + block) | ~2-3 hafte |
| 2 | Neuro-symbolic path-judge + proof + verified fix — SHIP | ~2-3 hafte |
| 3 | Generation-guard + dead-code + more langs/editors | ~3-4 hafte |
| 4 | Launch | ~1-2 hafte |

<aside>
🚀

**Sabse zaroori:** engine (graph + taint) hi asli moat hai — Phase 1-2 mein isi pe focus. Yeh "sirf skill" nahi, real research-grade product hai → isliye log star/install karenge.

</aside>