/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Secret detection - finds hardcoded API keys, tokens, passwords
 */

export interface SecretPattern {
  pattern: RegExp;
  type: string;
  description: string;
  severity: 'high' | 'medium';
}

/**
 * Common secret patterns
 */
export const SECRET_PATTERNS: SecretPattern[] = [
  {
    pattern: /['"][A-Za-z0-9_]{32,}['"]/,
    type: 'generic_token',
    description: 'Generic API token (32+ chars)',
    severity: 'high',
  },
  {
    pattern: /['"]sk-[A-Za-z0-9]{48}['"]/,
    type: 'openai_key',
    description: 'OpenAI API key',
    severity: 'high',
  },
  {
    pattern: /['"]AIza[A-Za-z0-9_-]{35}['"]/,
    type: 'google_api_key',
    description: 'Google API key',
    severity: 'high',
  },
  {
    pattern: /['"]AKIA[A-Z0-9]{16}['"]/,
    type: 'aws_access_key',
    description: 'AWS Access Key ID',
    severity: 'high',
  },
  {
    pattern: /['"]ghp_[A-Za-z0-9]{36}['"]/,
    type: 'github_token',
    description: 'GitHub Personal Access Token',
    severity: 'high',
  },
  {
    pattern: /['"]xox[baprs]-[A-Za-z0-9-]{10,}['"]/,
    type: 'slack_token',
    description: 'Slack Token',
    severity: 'high',
  },
  {
    pattern: /password\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'password',
    description: 'Hardcoded password',
    severity: 'high',
  },
  {
    pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'api_key',
    description: 'Hardcoded API key',
    severity: 'high',
  },
  {
    pattern: /secret\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'secret',
    description: 'Hardcoded secret',
    severity: 'high',
  },
];

export interface SecretMatch {
  type: string;
  description: string;
  severity: 'high' | 'medium';
  line: number;
  match: string;
}

/**
 * Detect secrets in code
 */
export function detectSecrets(code: string): SecretMatch[] {
  const lines = code.split('\n');
  const matches: SecretMatch[] = [];

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return;
    }

    for (const pattern of SECRET_PATTERNS) {
      const match = line.match(pattern.pattern);
      if (match) {
        matches.push({
          type: pattern.type,
          description: pattern.description,
          severity: pattern.severity,
          line: index + 1,
          match: match[0].substring(0, 20) + '...',
        });
      }
    }
  });

  return matches;
}

/**
 * Check if specific line contains a secret
 */
export function isSecretLine(line: string): SecretPattern | null {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.pattern.test(line)) {
      return pattern;
    }
  }
  return null;
}
