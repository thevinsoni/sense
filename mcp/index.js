#!/usr/bin/env node
/**
 * FivoSense MCP Server
 * 
 * Model Context Protocol server that exposes FivoSense security scanning
 * capabilities to AI agents like Claude, GPT, etc.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { auditFile } from 'fivosense';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * Create MCP server instance
 */
const server = new Server(
  {
    name: 'fivosense-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool definitions for AI agents
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'scan_file',
        description: 'Scan a JavaScript/TypeScript file for security vulnerabilities including SQL injection, XSS, command injection, secrets, and destructive commands. Returns detailed findings with taint-trace proofs.',
        inputSchema: {
          type: 'object',
          properties: {
            filepath: {
              type: 'string',
              description: 'Path to the file to scan (relative or absolute)',
            },
          },
          required: ['filepath'],
        },
      },
      {
        name: 'scan_code',
        description: 'Scan code snippet for security vulnerabilities without requiring a file. Useful for analyzing code before writing it.',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'JavaScript/TypeScript code to analyze',
            },
            filename: {
              type: 'string',
              description: 'Virtual filename for context (e.g., "test.js")',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'check_pattern',
        description: 'Check if code contains specific vulnerability patterns (SQL injection, XSS, command injection, secrets, destructive commands)',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to check',
            },
            patterns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Patterns to check: ["sql", "xss", "command", "secrets", "destructive"]',
            },
          },
          required: ['code', 'patterns'],
        },
      },
    ],
  };
});

/**
 * Tool execution handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'scan_file': {
        const { filepath } = args;
        const resolvedPath = resolve(filepath);
        
        // Run FivoSense audit
        const result = await auditFile(resolvedPath);
        
        // Format results
        const summary = {
          file: filepath,
          totalFindings: result.summary.total,
          critical: result.summary.critical,
          high: result.summary.high,
          medium: result.summary.medium,
          low: result.summary.low,
        };

        // Combine vulnerabilities and secrets
        const allFindings = [
          ...result.vulnerabilities.map(v => ({
            type: v.category,
            severity: v.severity,
            message: `${v.finding} vulnerability detected`,
            source: v.path[0] || 'unknown',
            sink: v.path[v.path.length - 1] || 'unknown',
            cwe: v.cwe,
            line: v.location.line,
            evidence: v.evidence.filter(e => e.line).map(e => `${e.type} at line ${e.line}`).join(', ') || 'No evidence',
            fix: 'Use proper sanitization (parameterized queries, input validation, etc.)',
          })),
          ...result.secrets.map(s => ({
            type: 'secret',
            severity: 'high',
            message: `${s.type} detected`,
            source: 'hardcoded',
            sink: 'code',
            cwe: 'CWE-798',
            line: s.line,
            evidence: s.match,
            fix: 'Use environment variables',
          }))
        ];
        
        const findings = allFindings;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ summary, findings }, null, 2),
            },
          ],
        };
      }

      case 'scan_code': {
        const { code, filename = 'temp.js' } = args;
        
        // Write code to temp file and scan
        const { writeFile, unlink } = await import('fs/promises');
        const { tmpdir } = await import('os');
        const { join } = await import('path');
        
        const tempPath = join(tmpdir(), filename);
        await writeFile(tempPath, code);
        
        try {
          const result = await auditFile(tempPath);
          
          const summary = {
            totalFindings: result.summary.total,
            critical: result.summary.critical,
            high: result.summary.high,
            medium: result.summary.medium,
          };

          // Combine vulnerabilities and secrets
          const allFindings = [
            ...result.vulnerabilities.map(v => ({
              type: v.category,
              severity: v.severity,
              message: `${v.finding} vulnerability detected`,
              line: v.location.line,
              evidence: v.evidence.filter(e => e.line).map(e => `${e.type} at line ${e.line}`).join(', ') || 'No evidence',
              fix: 'Use proper sanitization (parameterized queries, input validation, etc.)',
            })),
            ...result.secrets.map(s => ({
              type: 'secret',
              severity: 'high',
              message: `${s.type} detected`,
              line: s.line,
              evidence: s.match,
              fix: 'Use environment variables',
            }))
          ];
          
          const findings = allFindings;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ summary, findings }, null, 2),
              },
            ],
          };
        } finally {
          await unlink(tempPath).catch(() => {});
        }
      }

      case 'check_pattern': {
        const { code, patterns } = args;
        
        // Quick pattern check without full analysis
        const results = {};
        
        for (const pattern of patterns) {
          switch (pattern.toLowerCase()) {
            case 'sql':
              results.sql = /(\bdb\.(query|execute|run)\b|\bSQL\b)/i.test(code) &&
                           /(SELECT|INSERT|UPDATE|DELETE)/i.test(code);
              break;
            case 'xss':
              results.xss = /(innerHTML|outerHTML|document\.write)/i.test(code);
              break;
            case 'command':
              results.command = /(exec|spawn|execFile|execSync)/i.test(code);
              break;
            case 'secrets':
              results.secrets = /(sk-|ghp_|gho_|AKIA|AIza|ya29\.)/i.test(code) ||
                               /(password|api[_-]?key|secret|token)\s*[:=]/i.test(code);
              break;
            case 'destructive':
              results.destructive = /(rm\s+-rf|DROP\s+TABLE|DELETE\s+FROM|TRUNCATE)/i.test(code);
              break;
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('FivoSense MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
