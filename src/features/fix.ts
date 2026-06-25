/**
 * Auto-fix Generator - Suggests and applies security fixes
 */

import { TaintTrace } from '../engine/taint.js';

export interface SecurityFix {
  original: string;
  fixed: string;
  explanation: string;
  confidence: number;
  type: 'sanitize' | 'parameterize' | 'encode' | 'validate';
}

/**
 * Generate fix for a vulnerability
 */
export function generateFix(trace: TaintTrace, code: string): SecurityFix | null {
  const { category, location } = trace;
  
  switch (category) {
    case 'sql':
      return generateSQLFix(trace, code);
    case 'xss':
      return generateXSSFix(trace, code);
    case 'command':
      return generateCommandFix(trace, code);
    default:
      return null;
  }
}

/**
 * Generate SQL injection fix
 */
function generateSQLFix(trace: TaintTrace, code: string): SecurityFix {
  // Extract the vulnerable line
  const lines = code.split('\n');
  const line = lines[trace.location.line - 1] || '';
  
  // Detect query pattern
  if (line.includes('db.execute') || line.includes('db.query')) {
    return {
      original: line.trim(),
      fixed: line.replace(/`([^`]+)`/, (match, query) => {
        // Convert template literal to parameterized query
        const parameterized = query.replace(/\$\{([^}]+)\}/g, '?');
        return `'${parameterized}', [${query.match(/\$\{([^}]+)\}/g)?.map((m: string) => m.slice(2, -1)).join(', ') || ''}]`;
      }),
      explanation: 'Use parameterized queries to prevent SQL injection',
      confidence: 0.9,
      type: 'parameterize',
    };
  }
  
  return {
    original: line.trim(),
    fixed: line.trim(),
    explanation: 'Manual review required - complex SQL pattern',
    confidence: 0.5,
    type: 'validate',
  };
}

/**
 * Generate XSS fix
 */
function generateXSSFix(trace: TaintTrace, code: string): SecurityFix {
  const lines = code.split('\n');
  const line = lines[trace.location.line - 1] || '';
  
  if (line.includes('res.send')) {
    return {
      original: line.trim(),
      fixed: line.replace(/res\.send\(([^)]+)\)/, 'res.send(escapeHtml($1))'),
      explanation: 'Escape HTML to prevent XSS',
      confidence: 0.85,
      type: 'encode',
    };
  }
  
  if (line.includes('innerHTML')) {
    return {
      original: line.trim(),
      fixed: line.replace(/\.innerHTML\s*=/, '.textContent ='),
      explanation: 'Use textContent instead of innerHTML to prevent XSS',
      confidence: 0.9,
      type: 'encode',
    };
  }
  
  return {
    original: line.trim(),
    fixed: line.trim(),
    explanation: 'Manual review required - XSS context unclear',
    confidence: 0.5,
    type: 'encode',
  };
}

/**
 * Generate command injection fix
 */
function generateCommandFix(trace: TaintTrace, code: string): SecurityFix {
  const lines = code.split('\n');
  const line = lines[trace.location.line - 1] || '';
  
  if (line.includes('exec(')) {
    return {
      original: line.trim(),
      fixed: line.replace(/exec\(([^)]+)\)/, 'execFile(command, args)'),
      explanation: 'Use execFile with array arguments to prevent command injection',
      confidence: 0.8,
      type: 'validate',
    };
  }
  
  return {
    original: line.trim(),
    fixed: line.trim(),
    explanation: 'Validate and sanitize all command arguments',
    confidence: 0.6,
    type: 'validate',
  };
}

/**
 * Apply fix to code
 */
export function applyFix(code: string, fix: SecurityFix, lineNumber: number): string {
  const lines = code.split('\n');
  if (lineNumber < 1 || lineNumber > lines.length) {
    return code;
  }
  
  lines[lineNumber - 1] = fix.fixed;
  return lines.join('\n');
}
