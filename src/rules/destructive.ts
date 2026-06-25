/**
 * Destructive command detection
 * Blocks dangerous operations: rm -rf, DROP TABLE, mass deletes, etc.
 */

export interface DestructivePattern {
  pattern: RegExp;
  description: string;
  severity: 'critical' | 'high';
  category: 'filesystem' | 'database' | 'system';
}

/**
 * Filesystem destructive patterns
 */
export const FS_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /rm\s+-rf\s+[\/~]/,
    description: 'Recursive force delete from root',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /rm\s+-rf\s+\*/,
    description: 'Recursive force delete with wildcard',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /unlink\s*\(\s*['"]\/['"]\s*\)/,
    description: 'Unlink root directory',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /fs\.rmdir\s*\(\s*['"]\/['"]/,
    description: 'Remove root directory',
    severity: 'critical',
    category: 'filesystem',
  },
];

/**
 * Database destructive patterns
 */
export const DB_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /DROP\s+TABLE/i,
    description: 'SQL DROP TABLE',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /DROP\s+DATABASE/i,
    description: 'SQL DROP DATABASE',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /TRUNCATE\s+TABLE/i,
    description: 'SQL TRUNCATE TABLE',
    severity: 'high',
    category: 'database',
  },
  {
    pattern: /DELETE\s+FROM\s+\w+\s*;/i,
    description: 'SQL DELETE without WHERE clause',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /db\.collection\(\w+\)\.drop\(\)/,
    description: 'MongoDB collection drop',
    severity: 'high',
    category: 'database',
  },
];

/**
 * System destructive patterns
 */
export const SYSTEM_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /shutdown|reboot|halt/i,
    description: 'System shutdown command',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /kill\s+-9\s+1/,
    description: 'Kill init process',
    severity: 'critical',
    category: 'system',
  },
];

/**
 * All destructive patterns
 */
export const ALL_DESTRUCTIVE = [
  ...FS_DESTRUCTIVE,
  ...DB_DESTRUCTIVE,
  ...SYSTEM_DESTRUCTIVE,
];

/**
 * Check if code contains destructive patterns
 */
export function detectDestructive(code: string): DestructivePattern[] {
  const matches: DestructivePattern[] = [];
  
  for (const pattern of ALL_DESTRUCTIVE) {
    if (pattern.pattern.test(code)) {
      matches.push(pattern);
    }
  }
  
  return matches;
}

/**
 * Check if specific line contains destructive command
 */
export function isDestructiveLine(line: string): DestructivePattern | null {
  for (const pattern of ALL_DESTRUCTIVE) {
    if (pattern.pattern.test(line)) {
      return pattern;
    }
  }
  return null;
}
