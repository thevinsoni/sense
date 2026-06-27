/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Catalog of untrusted input sources (taint origins)
 * These represent user-controlled data that could be malicious
 */

export interface SourcePattern {
  pattern: string;
  category: 'http' | 'file' | 'env' | 'cli' | 'external';
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

/**
 * HTTP/API sources - user input from web requests
 */
export const HTTP_SOURCES: SourcePattern[] = [
  { pattern: 'req.query', category: 'http', description: 'URL query parameters', severity: 'critical' },
  { pattern: 'req.params', category: 'http', description: 'Route parameters', severity: 'critical' },
  { pattern: 'req.body', category: 'http', description: 'Request body', severity: 'critical' },
  { pattern: 'req.headers', category: 'http', description: 'HTTP headers', severity: 'high' },
  { pattern: 'req.cookies', category: 'http', description: 'Cookies', severity: 'high' },
  { pattern: 'request.query', category: 'http', description: 'Query string', severity: 'critical' },
  { pattern: 'request.body', category: 'http', description: 'Request body', severity: 'critical' },
  { pattern: 'ctx.request.body', category: 'http', description: 'Koa/context body', severity: 'critical' },
  { pattern: 'ctx.query', category: 'http', description: 'Koa query', severity: 'critical' },
];

/**
 * File system sources - external file content
 */
export const FILE_SOURCES: SourcePattern[] = [
  { pattern: 'fs.readFileSync', category: 'file', description: 'File content', severity: 'high' },
  { pattern: 'fs.readFile', category: 'file', description: 'File content async', severity: 'high' },
  { pattern: 'readFileSync', category: 'file', description: 'File read', severity: 'high' },
];

/**
 * Environment/config sources - potentially untrusted config
 */
export const ENV_SOURCES: SourcePattern[] = [
  { pattern: 'process.env', category: 'env', description: 'Environment variables', severity: 'medium' },
  { pattern: 'process.argv', category: 'cli', description: 'Command-line arguments', severity: 'high' },
];

/**
 * All sources combined
 */
export const ALL_SOURCES = [
  ...HTTP_SOURCES,
  ...FILE_SOURCES,
  ...ENV_SOURCES,
];

/**
 * Check if a code string matches any source pattern
 */
export function isSource(code: string): SourcePattern | null {
  for (const source of ALL_SOURCES) {
    if (code.includes(source.pattern)) {
      return source;
    }
  }
  return null;
}

/**
 * Get all sources matching a category
 */
export function getSourcesByCategory(category: SourcePattern['category']): SourcePattern[] {
  return ALL_SOURCES.filter(s => s.category === category);
}
