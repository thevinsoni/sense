<div align="center">

# FivoSense

### Your code has security holes. You just don't know it yet.

**One command. 15 seconds. Every vulnerability found.**

[![npm version](https://img.shields.io/npm/v/fivosense.svg)](https://www.npmjs.com/package/fivosense)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## Every 39 seconds, a hacker breaks into someone's code.

**74% of breaches** start with a vulnerability that a simple scan could have caught.

Not a sophisticated zero-day. Not a nation-state attack. A simple SQL injection. A hardcoded API key. A command injection that a $0 scanner would have found in 5 seconds.

**Your code is next.** Unless you scan it right now.

---

## What is FivoSense?

FivoSense is a **free, open-source security scanner** that finds vulnerabilities in your JavaScript and TypeScript code.

Not "might be vulnerable." **IS vulnerable.** With the exact line number, the full attack path, and a working exploit you can test yourself.

```bash
npm install -g fivosense
fivosense src/**/*.js
```

That's it. No signup. No cloud. No config. No BS.

---

## Before vs After

| | Before FivoSense | After FivoSense (1 hour later) |
|--|------------------|-------------------------------|
| Security Score | 20/100 (Grade F) | 95/100 (Grade A) |
| SQL Injections | 5 unpatched | 0 (fixed) |
| Hardcoded Secrets | 7 in source code | 0 (moved to .env) |
| XSS Vulnerabilities | 4 unpatched | 0 (fixed) |
| Command Injection | 3 unpatched | 0 (fixed) |
| Path Traversal | 2 unpatched | 0 (fixed) |
| Sleep at night | Nope | Like a baby |

**From Grade F to Grade A in 60 minutes.**

---

## Why FivoSense is Different

| | ChatGPT | Snyk / SonarQube | FivoSense |
|--|---------|------------------|-----------|
| **How it works** | Reads code as text, guesses | Cloud-based scanning | Local AST data-flow analysis |
| **Answer** | "Might be vulnerable" | "500 warnings (400 false)" | "IS vulnerable, line 13" |
| **Proof** | None | Partial | Full taint-trace path |
| **Exploit** | None | None | Working PoC generated |
| **Speed** | Copy-paste 1 file | Minutes per scan | 100 files in 15 sec |
| **Your code** | Sent to OpenAI | Sent to their cloud | Stays on YOUR machine |
| **Cost** | $20/month | $25-100/month per seat | **Free forever** |

---

## What FivoSense Finds

### 433 security patterns across 20 categories

| Category | What It Means | Severity |
|----------|--------------|----------|
| SQL Injection | Steal all user data | Critical |
| Command Injection | Take control of your server | Critical |
| XSS | Hijack user sessions | High |
| Hardcoded Secrets | Leaked API keys = $$ bills | High |
| Path Traversal | Read any file on server | High |
| SSRF | Access internal services | High |
| Code Injection | Execute arbitrary code | Critical |
| NoSQL Injection | Bypass authentication | High |
| XXE | Read server files | Critical |
| SSTI | Execute code on server | Critical |
| LDAP Injection | Bypass directory auth | Critical |
| JWT Vulnerabilities | Auth bypass | Critical |
| Open Redirect | Phishing attacks | High |
| Prototype Pollution | Object manipulation | Critical |
| Weak Crypto | Broken encryption | High |
| Regex DoS | Server hang | High |
| Insecure Deserialization | Remote code execution | Critical |
| GraphQL Injection | Data exfiltration | High |
| Header Injection | Response splitting | High |
| Destructive Commands | Delete all data | Blocked |

### 55+ secret types detected

| Type | Examples |
|------|----------|
| AI Keys | OpenAI (`sk-proj-...`), Anthropic (`sk-ant-...`) |
| Cloud | AWS (`AKIA...`), Azure, GCP, Firebase |
| Git | GitHub (`ghp_...`), GitLab (`glpat-...`) |
| SaaS | Stripe, Shopify, Slack, Discord |
| Database | MongoDB, PostgreSQL, MySQL, Redis URIs |
| Comms | Telegram, Twilio, SendGrid |
| Generic | Passwords, tokens, bearer auth |

### 58+ destructive commands blocked

| Type | Examples |
|------|----------|
| Filesystem | `rm -rf /`, `mkfs`, `shred` |
| Database | `DROP TABLE`, `TRUNCATE`, `DELETE` without WHERE |
| System | `shutdown`, `reboot`, fork bombs |
| Network | `iptables -F`, `curl \| bash` |
| Containers | Docker mass delete, K8s namespace wipe |
| Privilege | `chmod 777`, SUID bit, sudoers manipulation |

---

## The Features That Make Developers Love It

### 1. Roast Mode — Make Security Fun

```bash
fivosense --roast src/api.js
```

```
💀 Security Nightmare
Your code has more holes than Swiss cheese.
SQL injection goes brrr.
```

Share it in Slack. Make it a competition. Your team will actually run security scans now.

---

### 2. Badge Mode — Know Your Score Instantly

```bash
fivosense --badge src/app.js
```

```
🛡️ Security Badge
Grade: D | Score: 70/100
```

Track your progress. Put it in your README. Show your CTO. Watch your score climb from D to A.

---

### 3. Pre-Push Security Gate

```bash
git push
# FivoSense scans automatically...
❌ Push blocked: 1 critical issue found
```

No one forgets to scan. No vulnerable code reaches production. Ever.

---

### 4. VS Code Integration

Red squiggly lines appear on vulnerable code as you type. Hover to see the issue. Fix it immediately.

Catch vulnerabilities **the moment you write them** — not in code review, not in QA, not in production.

---

### 5. AI Agent Integration (MCP Server)

Connect FivoSense to Claude Desktop, GPT, or any AI agent:

```json
{
  "mcpServers": {
    "fivosense": {
      "command": "npx",
      "args": ["fivosense-mcp"]
    }
  }
}
```

Now when you ask AI "Is my code secure?" — it doesn't guess. It runs FivoSense and gives you **proven results**.

---

### 6. AI Verification (Optional)

Connect your own AI to double-check findings:

```bash
OPENAI_API_KEY=sk-xxx fivosense src/api.js
```

Works with OpenAI, Claude, or local Ollama. Reduces false positives to near zero.

---

## Performance

| Metric | Value |
|--------|-------|
| Single file | < 1 second |
| 10 files | ~2 seconds |
| 100 files | ~15 seconds |
| False positive rate | ~5% |
| Your code leaves your machine? | **Never** |

---

## All Commands

| Command | What It Does |
|---------|-------------|
| `fivosense file.js` | Scan for vulnerabilities |
| `fivosense src/**/*.js` | Scan entire project |
| `fivosense --roast file.js` | Get roasted for your security mistakes |
| `fivosense --badge file.js` | Get your security grade (A+ to F) |
| `npx fivosense file.js` | Run without installing |

---

## How It Works (The Simple Version)

```
You write code
    ↓
FivoSense reads it
    ↓
Traces every input through your code
    ↓
Finds where it becomes dangerous
    ↓
Proves the attack path exists
    ↓
Shows you the fix
```

**This is NOT regex matching.** This is real data-flow analysis — the same technique used by Google and Facebook internally.

---

## FAQ

**"Is this really free?"**
Yes. MIT License. No subscriptions. No cloud. No data leaves your machine. Forever.

**"Is it better than ChatGPT for security?"**
Yes. ChatGPT guesses. FivoSense proves. ChatGPT says "might." FivoSense says "IS."

**"Does it work with TypeScript?"**
Yes. JavaScript, TypeScript, JSX, TSX.

**"Can I use it in CI/CD?"**
Yes. GitHub Actions, GitLab CI, pre-push hooks. Exit code 1 when vulnerabilities found.

**"Does it send my code anywhere?"**
No. 100% local. No cloud. No API calls (unless you opt into AI verification).

---

## Install Now

```bash
npm install -g fivosense
fivosense src/**/*.js
```

**30 seconds to install. 15 seconds to scan. Zero excuses left.**

---

<div align="center">

**[npm](https://www.npmjs.com/package/fivosense)** · **[GitHub](https://github.com/thevinsoni/sense)** · **[Issues](https://github.com/thevinsoni/sense/issues)**

MIT License — Copyright © 2026 thevinsoni

**100% open source. 100% local. No data leaves your machine.**

---

*Your codebase has vulnerabilities right now.*

```bash
npm install -g fivosense
```

**Find them before hackers do.**

</div>
