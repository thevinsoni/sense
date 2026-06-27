# FivoSense VS Code Extension

Real-time security vulnerability detection for JavaScript and TypeScript with AI-powered taint analysis.

## Features

- **Real-time Security Scanning**: Detects vulnerabilities as you type
- **54+ Detection Patterns**: SQL injection, XSS, command injection, secrets, destructive commands
- **Taint-Trace Proofs**: Shows exact data flow from input to vulnerability
- **Auto-Fix Suggestions**: Quick fixes for common vulnerabilities
- **Roast Mode**: Fun security feedback 🔥
- **Security Badge**: Get your code's security grade

## Installation

### From .vsix
```bash
code --install-extension fivosense-vscode-0.1.1.vsix
```

### From Source
```bash
git clone https://github.com/thevinsoni/sense.git
cd sense/vscode-extension
npm install
npm run package
code --install-extension fivosense-vscode-0.1.1.vsix
```

## Usage

### Commands

- **FivoSense: Scan Current File** - Scan the active file
- **FivoSense: Scan Workspace** - Scan all JS/TS files in workspace
- **FivoSense: Roast Mode 🔥** - Get roasted for your security issues
- **FivoSense: Get Security Badge** - See your code's security grade

### Settings

- `fivosense.enableRealTime` - Enable real-time scanning (default: true)
- `fivosense.scanOnSave` - Scan files on save (default: true)
- `fivosense.severity` - Minimum severity to report (default: "all")

## Detection Capabilities

### SQL Injection
```javascript
// ❌ Detected
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.execute(query);

// ✅ Safe
db.execute('SELECT * FROM users WHERE id = ?', [userId]);
```

### XSS
```javascript
// ❌ Detected
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;
```

### Command Injection
```javascript
// ❌ Detected
exec(`git clone ${repo}`);

// ✅ Safe
execFile('git', ['clone', repo]);
```

### Secrets
```javascript
// ❌ Detected
const apiKey = "sk-proj-abcd1234";

// ✅ Safe
const apiKey = process.env.OPENAI_API_KEY;
```

## How It Works

FivoSense uses **AST-based taint analysis**:

1. **Graph Builder**: Parses code into data-flow graph using Babel parser
2. **Taint Tracker**: Traces untrusted input from source to dangerous sink
3. **Sanitization Check**: Detects if input is already sanitized (parseInt, execFile, etc.)
4. **AI Judge**: Verifies exploitability using OpenAI/Claude/Ollama (optional)
5. **Proof Generator**: Creates exact evidence with line numbers and CWE references

## Requirements

- VS Code 1.80.0 or higher
- Node.js 20+ (for local development)

## Extension Settings

Configure in VS Code settings (File > Preferences > Settings):

```json
{
  "fivosense.enableRealTime": true,
  "fivosense.scanOnSave": true,
  "fivosense.severity": "all"
}
```

## Release Notes

### 0.1.1
- Fixed vulnerability reporting structure
- Improved secret detection
- Added proper taint-trace proofs
- Updated to fivosense v0.1.6

### 0.1.0
- Initial release
- Real-time scanning for JS/TS
- 54 detection patterns
- Taint-trace proofs
- Roast mode & security badges

## Contributing

See [CONTRIBUTING.md](https://github.com/thevinsoni/sense/blob/main/CONTRIBUTING.md)

## License

MIT License - Copyright © 2026 thevinsoni

See [LICENSE](https://github.com/thevinsoni/sense/blob/main/LICENSE)

## Support

- Issues: https://github.com/thevinsoni/sense/issues
- Discussions: https://github.com/thevinsoni/sense/discussions

---

**Secure your code with FivoSense!** 🛡️
