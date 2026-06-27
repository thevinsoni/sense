# FivoSense - Complete Deployment Guide

## 🎉 All Components Ready!

### ✅ What's Been Built:

1. **Core Engine (npm)** - Published ✅
2. **Kilo Skill** - AI Agent Integration ✅
3. **MCP Server** - Model Context Protocol ✅
4. **VS Code Extension** - Editor Plugin ✅

---

## 1. Core Engine (npm package)

### Published: `fivosense@0.1.3`

**Install:**
```bash
npm install -g fivosense
```

**Usage:**
```bash
fivosense src/server.js
fivosense --roast src/api.js
fivosense --badge src/app.js
```

**Package URL:** https://www.npmjs.com/package/fivosense

---

## 2. Kilo Skill (AI Agent Integration)

### Location: `.kilo/skill/fivosense/`

**Files:**
- `skill.md` - Main skill instructions
- `skill.json` - Metadata (optional)

**How to Use:**

#### Option A: Copy to Kilo Config
```bash
# Copy skill to Kilo's global config
cp -r fivosense/.kilo/skill/fivosense ~/.config/kilo/skill/

# Or to project-specific config
cp -r fivosense/.kilo/skill/fivosense .kilo/skill/
```

#### Option B: Use from npm
Just install fivosense globally and the AI agent can call it:
```bash
npx fivosense <file>
```

**What It Does:**
- Instructs AI agents to scan code before writing
- Blocks destructive commands
- Provides auto-fix suggestions
- Integrates with Kilo/Claude Code/Cursor

**Activation:**
The skill activates when:
- AI generates JS/TS code
- AI runs shell commands
- User asks for security checks

---

## 3. MCP Server (Model Context Protocol)

### Location: `mcp/`

**Setup:**
```bash
cd fivosense/mcp
npm install
```

**Configure with Claude Desktop:**

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "fivosense": {
      "command": "node",
      "args": ["/absolute/path/to/fivosense/mcp/index.js"]
    }
  }
}
```

**Configure with Kilo:**

Edit `~/.config/kilo/kilo.json`:
```json
{
  "mcpServers": {
    "fivosense": {
      "command": "node",
      "args": ["/absolute/path/to/fivosense/mcp/index.js"]
    }
  }
}
```

**Available Tools:**
1. `scan_file` - Scan a file for vulnerabilities
2. `scan_code` - Scan code snippet
3. `check_pattern` - Quick pattern check

**Test MCP Server:**
```bash
cd mcp
node index.js
```

---

## 4. VS Code Extension

### Location: `vscode-extension/fivosense-vscode-0.1.0.vsix`

**Install:**

#### Option A: From .vsix file
```bash
code --install-extension fivosense/vscode-extension/fivosense-vscode-0.1.0.vsix
```

#### Option B: From VS Code UI
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Click "..." menu → "Install from VSIX"
4. Select `fivosense-vscode-0.1.0.vsix`

**Features:**
- Real-time security scanning
- Red squiggly lines for vulnerabilities
- Scan on save
- Workspace scanning
- Roast mode 🔥
- Security badge

**Commands:**
- `Ctrl+Shift+P` → "FivoSense: Scan Current File"
- `Ctrl+Shift+P` → "FivoSense: Scan Workspace"
- `Ctrl+Shift+P` → "FivoSense: Roast Mode"
- `Ctrl+Shift+P` → "FivoSense: Get Security Badge"

**Settings:**
```json
{
  "fivosense.enableRealTime": true,
  "fivosense.scanOnSave": true,
  "fivosense.severity": "all"
}
```

**Publish to Marketplace (Future):**
```bash
cd vscode-extension
npx vsce publish
```

---

## Usage Examples

### 1. CLI Usage
```bash
# Scan a file
fivosense src/api.js

# Get roasted
fivosense --roast src/vulnerable.js

# Get security badge
fivosense --badge src/app.js
```

### 2. AI Agent Usage (Kilo/Claude)

**User:** "Create a user search API"

**AI Agent:**
- Generates code
- Runs `npx fivosense src/api.js`
- Detects SQL injection
- Applies fix
- Re-scans to verify
- ✅ Clean code

### 3. VS Code Usage

1. Open a JS/TS file
2. Extension auto-scans
3. See red lines for vulnerabilities
4. Hover for details
5. Apply suggested fixes

### 4. MCP Usage (Claude Desktop)

**User:** "Check this code for security issues"

**Claude with MCP:**
- Calls `scan_code` tool
- Returns findings with taint-trace proofs
- Suggests fixes
- Verifies after fix

---

## Installation Summary

### Quick Start (All Components):

```bash
# 1. Install npm package globally
npm install -g fivosense

# 2. Copy Kilo skill (if using Kilo)
cp -r fivosense/.kilo/skill/fivosense ~/.config/kilo/skill/

# 3. Setup MCP server (if using Claude/AI agents)
cd fivosense/mcp
npm install
# Add to Claude config (see above)

# 4. Install VS Code extension
code --install-extension fivosense/vscode-extension/fivosense-vscode-0.1.0.vsix
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           User Interfaces                    │
├─────────────────────────────────────────────┤
│ CLI       │ VS Code    │ Kilo      │ Claude │
│ Terminal  │ Extension  │ Skill     │ MCP    │
└────┬──────┴────┬───────┴────┬──────┴───┬────┘
     │           │            │          │
     └───────────┴────────────┴──────────┘
                      ↓
     ┌────────────────────────────────────────┐
     │      FivoSense Core Engine (npm)       │
     │  - Babel AST Parser                    │
     │  - Taint-trace analysis                │
     │  - 54 detection patterns               │
     │  - Auto-fix suggestions                │
     └────────────────────────────────────────┘
```

---

## Detection Capabilities

### 54 Patterns Across 6 Categories:

1. **SQL Injection** (5 patterns)
2. **NoSQL Injection** (4 patterns)
3. **XSS** (5 patterns)
4. **Command Injection** (5 patterns)
5. **Code Injection** (4 patterns)
6. **Path Traversal** (4 patterns)
7. **Secrets** (9 patterns)
8. **Destructive Commands** (11 patterns)

---

## Next Steps

### Immediate:
- ✅ npm package published
- ✅ Kilo skill created
- ✅ MCP server built
- ✅ VS Code extension packaged

### Optional (Phase 4):
- [ ] Publish VS Code extension to Marketplace
- [ ] Create demo video
- [ ] Product Hunt launch
- [ ] Documentation site

---

## Support

- **npm Package:** https://www.npmjs.com/package/fivosense
- **GitHub:** https://github.com/thevinsoni/sense
- **Issues:** https://github.com/thevinsoni/sense/issues

---

**Status:** 🚀 ALL COMPONENTS READY FOR USE!

**Integration Points:**
- ✅ CLI (Terminal)
- ✅ VS Code (Editor)
- ✅ Kilo (AI Agent)
- ✅ Claude/AI Agents (MCP)
- ✅ CI/CD (npm package)

Har jagah lag jayega! 🎉
