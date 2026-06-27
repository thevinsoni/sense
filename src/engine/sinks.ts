/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Catalog of dangerous sinks (vulnerability endpoints)
 * These are operations that can cause security issues if fed untrusted data
 */

export interface SinkPattern {
  pattern: string;
  category: 'sql' | 'nosql' | 'command' | 'code' | 'xss' | 'path' | 'xxe';
  description: string;
  severity: 'critical' | 'high' | 'medium';
  cwe?: string;
}

/**
 * SQL injection sinks
 */
export const SQL_SINKS: SinkPattern[] = [
  { pattern: 'db.execute', category: 'sql', description: 'SQL execution', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.query', category: 'sql', description: 'SQL query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'connection.query', category: 'sql', description: 'MySQL query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'pool.query', category: 'sql', description: 'Connection pool query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'executeQuery', category: 'sql', description: 'Generic SQL exec', severity: 'critical', cwe: 'CWE-89' },
];

/**
 * NoSQL injection sinks
 */
export const NOSQL_SINKS: SinkPattern[] = [
  { pattern: 'find', category: 'nosql', description: 'MongoDB find', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'findOne', category: 'nosql', description: 'MongoDB findOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'updateOne', category: 'nosql', description: 'MongoDB update', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'deleteOne', category: 'nosql', description: 'MongoDB delete', severity: 'high', cwe: 'CWE-943' },
];

/**
 * Command injection sinks
 */
export const COMMAND_SINKS: SinkPattern[] = [
  { pattern: 'exec', category: 'command', description: 'Command execution', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execSync', category: 'command', description: 'Sync command exec', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'spawn', category: 'command', description: 'Process spawn', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'spawnSync', category: 'command', description: 'Sync process spawn', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execFile', category: 'command', description: 'File execution', severity: 'critical', cwe: 'CWE-78' },
];

/**
 * Code injection sinks
 */
export const CODE_SINKS: SinkPattern[] = [
  { pattern: 'eval', category: 'code', description: 'Code evaluation', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'Function', category: 'code', description: 'Dynamic function creation', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'setTimeout', category: 'code', description: 'Delayed code exec', severity: 'high', cwe: 'CWE-94' },
  { pattern: 'setInterval', category: 'code', description: 'Repeated code exec', severity: 'high', cwe: 'CWE-94' },
];

/**
 * XSS sinks
 */
export const XSS_SINKS: SinkPattern[] = [
  { pattern: 'res.send', category: 'xss', description: 'HTTP response', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'res.write', category: 'xss', description: 'HTTP write', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'innerHTML', category: 'xss', description: 'DOM innerHTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'outerHTML', category: 'xss', description: 'DOM outerHTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'document.write', category: 'xss', description: 'Document write', severity: 'critical', cwe: 'CWE-79' },
];

/**
 * Path traversal sinks
 */
export const PATH_SINKS: SinkPattern[] = [
  { pattern: 'fs.readFile', category: 'path', description: 'File read', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.writeFile', category: 'path', description: 'File write', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.unlink', category: 'path', description: 'File delete', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.readFileSync', category: 'path', description: 'Sync file read', severity: 'high', cwe: 'CWE-22' },
];

/**
 * All sinks combined
 */
export const ALL_SINKS = [
  ...SQL_SINKS,
  ...NOSQL_SINKS,
  ...COMMAND_SINKS,
  ...CODE_SINKS,
  ...XSS_SINKS,
  ...PATH_SINKS,
];

/**
 * Check if a code string matches any sink pattern
 */
export function isSink(code: string): SinkPattern | null {
  for (const sink of ALL_SINKS) {
    if (code.includes(sink.pattern)) {
      return sink;
    }
  }
  return null;
}

/**
 * Get all sinks matching a category
 */
export function getSinksByCategory(category: SinkPattern['category']): SinkPattern[] {
  return ALL_SINKS.filter(s => s.category === category);
}

/**
 * Get sinks by severity
 */
export function getSinksBySeverity(severity: SinkPattern['severity']): SinkPattern[] {
  return ALL_SINKS.filter(s => s.severity === severity);
}
