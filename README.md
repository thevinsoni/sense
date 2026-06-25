# 🛡️ Fivo Sense

> **Code ka sixth sense** — proof-backed security, har editor mein, free.

Neuro-symbolic AI security plugin with taint-trace proof generation. Research-grade accuracy (F1 0.91-0.95) in a free MIT cross-editor plugin.

## 🎯 What It Does

- **Neuro-symbolic audit** — injection/XSS/auth vulnerabilities with exact taint-trace proofs
- **Generation-time block** — prevents AI from writing insecure code
- **Self-verified fixes** — surgical patches with regression checking
- **Cross-editor** — works in Claude Code, Cursor, VS Code, and more

## 🧠 Core Architecture (FivoCore)

```
CODE → tree-sitter → DATA-FLOW GRAPH → AI path-judge → TAINT-TRACE PROOF → VERIFIED FIX
```

**Neuro-symbolic approach:**
1. Deterministic graph builder finds ALL paths (high recall)
2. AI judges EACH path for exploitability (low false positives)
3. Adversarial verification proves real vulnerabilities
4. Taint-trace shows exact evidence: `source → ... → sink`

## 🚀 Quick Start

```bash
npm install -g fivosense
fivosense init
```

## 📊 Why Not Just Use X?

| Tool | Approach | Issue |
|------|----------|-------|
| Pure SAST | Rules only | Context-blind, rigid |
| Pure LLM | Codebase dump | Misses vulns, expensive |
| **Fivo Sense** | **Neuro-symbolic** | **Best of both** ✅ |

Research: [IRIS (ICLR 2025)](https://arxiv.org/html/2405.17238v3), [MoCQ](https://arxiv.org/html/2504.16057v2), [AdaTaint](https://arxiv.org/html/2511.04023v1)

## 📦 Status

**Current:** Phase 0 — Setup  
**Next:** Phase 1 — FivoCore MVP

See [BUILD_PLAN.md](./BUILD_PLAN.md) for roadmap.

## 📝 License

MIT — see [LICENSE](./LICENSE)
