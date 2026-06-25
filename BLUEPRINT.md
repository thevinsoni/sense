# Fivo Sense — Project Blueprint (A to Z)

<aside>
🛡️

**Fivo Sense** — open-source (MIT) AI security plugin jo *har* editor/AI-CLI mein chale. Iska dimaag = **FivoCore**, ek **neuro-symbolic taint-graph engine**: pakka code se poora data-flow map banata hai, phir host AI sirf har "input → dangerous sink" path judge karta hai. Natija: har vuln ka **taint-trace proof** ("input yahan se sink tak ja raha = isliye risky") + self-verified fix, aur destructive AI actions ka real-time block. Research-grade accuracy, ek patle free tool mein.

</aside>

## 1. Vision (one line)

> AI jo bhi code likhe woh secure ho jaaye — ek free, har-editor plugin jo guess nahi, **proof** deta hai.
> 

## 2. The Problem

- AI-generated code mein **40–62% tak security flaws**. ([Contrast Security](https://www.contrastsecurity.com/glossary/vibe-coding))
- AI devs **3–4x tezi se commit, 10x rate se security issues**. ([Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-vulnerability-surge-2026/))
- **Replit AI ne production database delete kar diya** (1,200+ records), mana karne ke baad bhi. ([SoftwareSeni](https://www.softwareseni.com/ai-generated-code-security-risks-why-vulnerabilities-increase-2-74x-and-how-to-prevent-them/))
- **Aaj ke AI scanners poora codebase "dump karke dekhte" hain** → context window choke ho jaata, whole-repo reasoning fail, isse vulns miss + false positives. ([SEI CMU](https://www.sei.cmu.edu/blog/evaluating-static-analysis-alerts-with-llms/), [Augment 2026](https://www.augmentcode.com/guides/ai-vulnerability-detection))

## 3. 🔬 Research Verdict — sirf ek architecture jeetta hai

Maine 30+ papers/benchmarks padhe. Nateeja ekdum saaf hai: na sirf rules, na sirf AI — **dono ka fusion (neuro-symbolic)** sabse upar hai.

| Approach | Accuracy (F1) | Dikkat |
| --- | --- | --- |
| Sirf SAST (regex/rules) | 0.10 – 0.55 | rigid, context-blind |
| Sirf LLM (codebase dump) ← *aaj ke tools* | 0.61 – 0.68 | miss + noise, mehenga |
| **Neuro-Symbolic (static + LLM)** | **0.91 – 0.95** ✅ | best of both |

Sources: [systematic benchmark](https://www.researchgate.net/publication/397820307_Large_Language_Models_Versus_Static_Code_Analysis_Tools_A_Systematic_Benchmark_for_Vulnerability_Detection) (OWASP + CWE-Bench-Java, 2740+ cases), [IRIS — ICLR 2025](https://arxiv.org/html/2405.17238v3), [MoCQ](https://arxiv.org/html/2504.16057v2), [AdaTaint](https://arxiv.org/html/2511.04023v1) (FP −43.7%, recall +11.2%).

<aside>
💡

Teri intuition research mein word-by-word proven hai: "AI poora code dump karke dekhta hai" = pure-LLM scanners ki exact documented kamzori. Fix = **neuro-symbolic**.

</aside>

## 4. ⚠️ Honest Reality Check (build se PEHLE padho)

Is idea ke kayi tukde already bane hue hain — kuch free/MIT (Anthropic/Snyk/Cisco/Meta). Sirf "audit + block + undo" banaya to log bolenge *"ye to pehle se hai."*

| Feature | Already kaun | Free/MIT? |
| --- | --- | --- |
| AI audit + fix | Anthropic security-guidance plugin (built-in) | Free |
| Pattern + diff + verifier (3 stages) | Wahi plugin | Free |
| Audit-as-plugin (7 analyzers) | Variant Systems OSS | MIT |
| Real-time block / guardrail | roboticforce/agent-guardrails, Meta LlamaFirewall, Codacy Guardrails | MIT/free |
| Undo | Claude Code Checkpointing (built-in), ccundo | Free |
| Agent supply-chain (skills/MCP) audit | Snyk agent-scan, AgentAuditKit (MIT), Cisco MCP Scanner | MIT/free |

<aside>
🚨

**Lekin yahan white-space hai:** neuro-symbolic taint-graph approach sirf **research papers** mein hai ([IRIS](https://arxiv.org/html/2405.17238v3), [MoCQ](https://arxiv.org/html/2504.16057v2)) — kisi ne ise **free + MIT + cross-editor + proof-generating plugin** ke roop mein package NAHI kiya. **Yahi FivoCore ka moat hai.** (Aur "app chala ke prove" karna impractical hai → iski jagah taint-trace proof.)

</aside>

## 5. 🧠 Core Architecture — FivoCore (Taint-Graph Neuro-Symbolic)

AI ko poora codebase **kabhi nahi** dete. 4 systematic steps:

**Step 1 — Deterministic Skeleton (pakka code, tree-sitter/AST):** poore code se **har untrusted input (source)** aur **har dangerous sink** (`eval`, SQL `query`, `exec`, `fs`, `innerHTML`…) nikaal ke ek **data-flow graph** banao. AI nahi — deterministic code. Fast, complete, har path covered. **Reachability-first:** sirf woh code aage bhejo jo bahar (API/input/route) se reachable hai → analysis surface karib 97% tak kam ([OpenAnt](https://arxiv.org/html/2606.19149)), AI ko aur focused.

**Step 2 — Host AI sirf SMART kaam (skill):** AI ko poora repo nahi — sirf **ek-ek source → sink PATH** do. AI judge kare: "yeh path sanitize hua ya nahi, exploitable hai ya nahi?" → [IRIS/AdaTaint](https://arxiv.org/html/2511.04023v1) method. Isse path miss nahi hota, AI focused (sasta+fast), aur false positives prune hote hain. **⚔️ Adversarial check:** phir AI ko "attacker" banao — "is path ko exploit kaise karoge?" Exploit na bane to FP samajh ke hatao; bane to "proven exploitable" ([OpenAnt](https://arxiv.org/html/2606.19149) / [Cloudflare VVS](https://blog.cloudflare.com/build-your-own-vulnerability-harness/)).

**Step 3 — 🧬 Taint-Trace Proof:** har finding ke saath exact `source → … → sink` path = concrete evidence "kyun risky". Aaj ke 99% tools sirf "suspicious lagta hai" bolte hain, **reachable/exploitable prove nahi karte** ([ZeroPath](https://zeropath.com/articles/code-security-platforms-reducing-false-positives)).

**Step 4 — Verify + Fix:** surgical patch suggest karo, phir **graph pe dobara verify** karo (regression na aaye) → [SecureFixAgent](https://arxiv.org/html/2509.16275v1) method (~3 iterations mein converge).

```
CODE
  │
  ▼
[1] tree-sitter/AST → DATA-FLOW GRAPH (sources + sinks)   ← pakka code
  │
  ▼
[2] har source→sink PATH → HOST AI judge (sanitized? exploitable?)  ← skill
  │           └─► false positive? → prune
  ▼
[3] TAINT-TRACE PROOF: input → … → sink  (exact evidence)
  │
  ▼
[4] FIX suggest → graph pe re-verify → apply
```

## 6. Do Modes

- **Audit Mode (reactive):** purana/diff code scan → FivoCore se proof + verified fix.
- **Generation-Guard Mode (proactive):** jab AI code likh raha ho, `PreToolUse` hook real-time check kare → insecure code **likhne se pehle hi block/fix** = *secure-by-construction* ([Constitutional Spec-Driven research](https://arxiv.org/html/2602.02584v1)). Koi free + cross-editor + neuro-symbolic + MIT yeh nahi de raha.

## 7. Features (A to Z)

### Core

- **Neuro-symbolic audit** — injection/XSS/auth/unsafe-data, taint-graph + host AI.
- **Secret detection** — hardcoded keys/tokens (deterministic rules + AI confirm).
- **Self-verified auto-fix** — surgical patch, graph pe re-checked.
- **Dead-code + "code working" check** — usi graph se unused/unreachable + logic traps; **delete nahi**, project ke **`.fivosense/archive/`** mein move (pehle `.fivosense/` parent folder, uske andar `archive/`); `.fivosense/` default **gitignored** (commit clutter na ho, local restore easy) + optional `archiveCommit` flag se track bhi ho sake; `.gitignore` samjhe taaki already-ignored files dobara archive na ho aur zaroorat pe wapas laaya ja sake.

### Agent Safety

- **Agent guardrail** — `rm -rf`/`DROP TABLE`/mass-delete real-time block (hook, deterministic).
- **Undo** — snapshot restore jahan built-in checkpoint nahi.

### Signature

- **🧬 Taint-Trace Proof** — har finding ka exact data-flow path.
- **🧪 Optional PoC test** — ek failing security test; user apne already-working env mein chalaye.

### Distribution

- **🔥 Roast My Code** + **🛡️ Security Badge / Report Card** — viral wedge.

## 8. 🎯 Differentiation / USPs

1. **Neuro-symbolic taint-graph core (FivoCore)** — research-grade accuracy, ek free MIT cross-editor plugin mein. *(koi nahi deta)*
2. **Taint-trace exploitability proof** — har bug ka "kyun" with exact path.
3. **Generation-time block + audit** — dono modes.
4. **Cross-editor/CLI universal** — Claude Code, Cursor, Copilot, Windsurf, CLI, git hook.
5. **BYOK + host-AI** — no cloud, no data leak, free.
6. **Self-verifying fixes** (regression check).
7. **AI-powered FP pruning** → kam noise ([94–98% FP elimination research](https://arxiv.org/html/2601.18844v1)).
8. **Roast + shareable badge** — organic viral reach.
9. **MIT, fully open, no paywall.**
10. **Dead-code + working-check** bonus, usi graph se.
11. **⚔️ Adversarial verification** — AI attacker ban ke exploitability prove kare → "proven-exploitable" label + FP aur kam.
12. **Reachability-first scan** — sirf reachable code dekhe, surface karib 97% kam (tez + sasta).

## 9. Codebase Structure

```jsx
fivosense/
├── skill/              # SKILL.md + AGENTS.md (host AI path-judge instructions)
│   └── prompts/        # path-judge / roast / fix templates
├── engine/             # ★ FivoCore — asli IP
│   ├── graph.ts        # tree-sitter → data-flow graph
│   ├── sources.ts      # untrusted input catalog
│   ├── sinks.ts        # dangerous sink catalog
│   ├── taint.ts        # source→sink path tracer (proof)
│   ├── reach.ts        # reachability filter (entry-point reachable)
│   ├── verify.ts       # fix ke baad graph re-check
│   ├── adversary.ts    # adversarial verify (AI attacker)
│   └── poc.ts          # optional failing security test
├── hooks/
│   ├── agent.ts        # PreToolUse intercept → block (exit 2)
│   └── git.ts          # pre/post-push audit
├── rules/              # deterministic: destructive.ts, secrets.ts
├── core/               # scope (git diff) + orchestrator
├── features/           # roast.ts, badge.ts, fix.ts
├── ai/                 # host-AI bridge + optional BYOK client
├── editors/            # thin adapters (vscode pehle)
└── cli/                # npx fivo-sense init
```

## 10. Codebase Size

- **Engine (FivoCore):** ~3,000–5,000 lines TS — **apni koi AI model nahi**, tree-sitter ready-made (MIT).
- **Skill + hooks + rules + features:** ~1,500–2,000 lines + markdown.
- **Total realistic:** ~5k–7k lines — heavy enterprise SAST se bahut chhota, par "sirf prompt" se bahut zyada (yahi star/install laata hai).

## 11. Tech Stack (brief)

- **Language:** TypeScript (Node 20+).
- **Parsing:** tree-sitter (multi-language, MIT) — engine ka base.
- **AI:** host AI (CLI agents) + optional BYOK (Claude/OpenAI/Gemini/Ollama) for plain editors.
- **Packaging:** npm + VS Code Marketplace, GitHub MIT.
- **Tests:** Vitest + fixture buggy repos + golden findings set.

## 12. ❌ What NOT to Build

- Apni AI model / fine-tune — ❌ (host AI + skill kaafi)
- From-scratch parser/SAST — ❌ (tree-sitter use karo)
- 10MB knowledge packs — ❌ (host AI ko OWASP pata hai)
- Poora app auto-run sandbox — ❌ (impractical; taint-proof + optional PoC se kaam)
- Cloud backend / accounts / billing — ❌

## 13. Roadmap

**Phase 0 — Setup (~2-3 din):** repo, MIT, TS+Vitest, CLI skeleton.

**Phase 1 — FivoCore MVP (~2-3 hafte):** tree-sitter graph builder (JS/TS) + source/sink catalog + deterministic rules + `PreToolUse` block hook → core working.

**Phase 2 — Neuro-symbolic + Proof (~2-3 hafte):** host-AI path-judge + FP pruning + taint-trace proof output + self-verified fix + optional PoC. **Publish.**

**Phase 3 — Expand (~3-4 hafte):** generation-guard mode, dead-code, more languages/editors (Cursor/JetBrains/Neovim), roast/badge.

**Phase 4 — Launch:** npm + Marketplace + docs + demo gif + Product Hunt/Reddit/X.

## 14. Risks

- **False positives** → neuro-symbolic + AI pruning + severity tiers + allowlist.
- **Privacy** → BYOK + local-first; code server pe mat bhejo.
- **Prompt injection** → destructive actions hamesha rule-based block, AI pe nirbhar nahi.
- **Language coverage** → ek language se start (JS/TS), tree-sitter grammars se expand.

## 15. Positioning / Naam

- **Naam:** Fivo Sense (`/sense`)
- **Tagline:** *"Code ka sixth sense — proof-backed security, har editor mein, free."*
- **Target:** vibe coders, indie hackers, chhoti teams jo Snyk/Checkmarx afford nahi karte.

## 16. 📚 Research References

- [IRIS: LLM-Assisted Static Analysis (ICLR 2025)](https://arxiv.org/html/2405.17238v3) — neuro-symbolic, whole-repo, LLM taint specs.
- [MoCQ: Holistic Neuro-symbolic](https://arxiv.org/html/2504.16057v2) — LLM patterns → static queries.
- [AdaTaint](https://arxiv.org/html/2511.04023v1) — LLM source-sink + symbolic validation (FP −43.7%).
- [SecureFixAgent](https://arxiv.org/html/2509.16275v1) — verified iterative fix.
- [Reducing FPs with LLMs (industry study)](https://arxiv.org/html/2601.18844v1) — 94–98% FP elimination.
- [Systematic benchmark: LLM vs SAST vs hybrid](https://www.researchgate.net/publication/397820307_Large_Language_Models_Versus_Static_Code_Analysis_Tools_A_Systematic_Benchmark_for_Vulnerability_Detection).
- [Constitutional Spec-Driven Development](https://arxiv.org/html/2602.02584v1) — secure-by-construction.

[Fivo Sense — Build Process & Engineering Plan](https://app.notion.com/p/Fivo-Sense-Build-Process-Engineering-Plan-95edae10b52941dd853e99f4ff235b07?pvs=21)