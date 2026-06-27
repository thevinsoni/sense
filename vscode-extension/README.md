# FivoSense for VS Code

### Security vulnerabilities? You'll see them as you type.

Red squiggly lines. Right in your editor. Before you even save.

---

## What It Does

| Feature | What Happens |
|---------|-------------|
| **Real-time scanning** | Vulnerabilities appear as you type |
| **Scan on save** | Every save = automatic security check |
| **Scan workspace** | One click = scan every JS/TS file |
| **Roast mode** | Get roasted for your security mistakes |
| **Badge mode** | See your security grade (A+ to F) |

---

## How It Looks

You write this:
```javascript
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.execute(query);
```

FivoSense shows this:
```
[SQL Injection] Untrusted input reaches database query
Taint path: req.query.id → userId → query → db.execute
CWE-89
```

**Right in your editor. As you type.**

---

## What Gets Detected

| Category | Severity |
|----------|----------|
| SQL Injection | Critical |
| Command Injection | Critical |
| XSS | High |
| Hardcoded Secrets | High |
| Path Traversal | High |
| SSRF | High |
| + 20 more categories | ... |

**433 patterns. 20 categories. 55+ secret types.**

---

## Install

```bash
code --install-extension fivosense-vscode-0.1.1.vsix
```

Or install from the VS Code Marketplace (coming soon).

---

## Commands

| Command | Shortcut |
|---------|----------|
| Scan Current File | `Ctrl+Shift+P` → FivoSense: Scan |
| Scan Workspace | `Ctrl+Shift+P` → FivoSense: Scan Workspace |
| Roast Mode | `Ctrl+Shift+P` → FivoSense: Roast |
| Badge Mode | `Ctrl+Shift+P` → FivoSense: Badge |

---

## Settings

| Setting | Default | What It Does |
|---------|---------|-------------|
| `fivosense.enableRealTime` | `true` | Scan as you type |
| `fivosense.scanOnSave` | `true` | Scan on every save |
| `fivosense.severity` | `"all"` | Minimum severity to show |

---

## Requirements

- VS Code 1.80.0+
- JavaScript or TypeScript project

---

## Links

- **npm:** https://www.npmjs.com/package/fivosense
- **GitHub:** https://github.com/thevinsoni/sense

---

MIT License — Copyright © 2026 thevinsoni
