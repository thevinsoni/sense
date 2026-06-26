# FivoSense MCP Server

Model Context Protocol server for FivoSense security scanner. Enables AI agents (Claude, GPT, etc.) to use FivoSense for real-time security scanning.

## Installation

```bash
cd mcp
npm install
```

## Usage

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "fivosense": {
      "command": "node",
      "args": ["/path/to/fivosense/mcp/index.js"]
    }
  }
}
```

### With Kilo

Add to your Kilo config (`~/.config/kilo/kilo.json`):

```json
{
  "mcpServers": {
    "fivosense": {
      "command": "node",
      "args": ["/path/to/fivosense/mcp/index.js"]
    }
  }
}
```

### Standalone

```bash
node index.js
```

## Available Tools

### 1. `scan_file`
Scan a file for security vulnerabilities.

**Input:**
- `filepath` (string): Path to file to scan

**Output:**
```json
{
  "summary": {
    "file": "src/api.js",
    "totalFindings": 3,
    "critical": 2,
    "high": 1,
    "medium": 0,
    "low": 0
  },
  "findings": [
    {
      "type": "SQL Injection",
      "severity": "critical",
      "message": "Untrusted input flows to SQL query",
      "source": "req.query.id",
      "sink": "db.execute",
      "cwe": "CWE-89",
      "line": 15,
      "evidence": "req.query.id → query → db.execute()",
      "fix": "Use parameterized queries"
    }
  ]
}
```

### 2. `scan_code`
Scan code snippet without requiring a file.

**Input:**
- `code` (string): Code to analyze
- `filename` (string, optional): Virtual filename

**Output:** Same as `scan_file`

### 3. `check_pattern`
Quick check for specific vulnerability patterns.

**Input:**
- `code` (string): Code to check
- `patterns` (array): Patterns to check - `["sql", "xss", "command", "secrets", "destructive"]`

**Output:**
```json
{
  "sql": true,
  "xss": false,
  "secrets": true,
  "command": false,
  "destructive": false
}
```

## Example Agent Usage

### Claude/GPT with MCP

```
User: "Create a user search API endpoint"

Agent: Let me create the endpoint and scan it for security issues.

*Creates file src/api/search.js*

*Calls scan_file tool with filepath="src/api/search.js"*

Tool Response:
{
  "summary": { "critical": 1, ... },
  "findings": [{
    "type": "SQL Injection",
    "severity": "critical",
    "fix": "Use parameterized queries"
  }]
}

Agent: I found a critical SQL injection vulnerability. Let me fix it with parameterized queries.

*Updates file with fix*
*Re-scans to verify*

Tool Response:
{
  "summary": { "totalFindings": 0 }
}

Agent: ✅ Security scan passed. The endpoint is now secure.
```

## Features

- **Real-time scanning**: Scan code as it's generated
- **Taint-trace proofs**: Exact evidence of vulnerability paths
- **Auto-fix suggestions**: Specific remediation guidance
- **54 detection patterns**: SQL, XSS, command injection, secrets, destructive commands
- **Zero dependencies**: Uses FivoSense npm package

## License

MIT
