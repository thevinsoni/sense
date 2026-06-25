/**
 * Roast Mode - Generates viral, shareable roasts for insecure code
 */

import { AuditResult } from '../index.js';

export interface Roast {
  title: string;
  message: string;
  severity: 'mild' | 'spicy' | 'brutal';
  emoji: string;
}

/**
 * Generate roast based on audit results
 */
export function generateRoast(result: AuditResult): Roast {
  const { summary } = result;
  const total = summary.total;
  const critical = summary.critical;
  const high = summary.high;
  
  if (total === 0) {
    return {
      title: 'Clean Code Champion',
      message: '🎉 No vulnerabilities found! Your code is cleaner than your browser history.',
      severity: 'mild',
      emoji: '✨',
    };
  }
  
  if (critical >= 3) {
    return {
      title: 'Security Nightmare',
      message: `💀 ${critical} critical vulnerabilities? Even script kiddies are embarrassed for you. This code is more open than a 24/7 convenience store.`,
      severity: 'brutal',
      emoji: '💀',
    };
  }
  
  if (critical >= 1) {
    return {
      title: 'Living Dangerously',
      message: `🔥 ${critical} critical issue(s) detected. Your code has more holes than Swiss cheese. SQL injection goes brrr.`,
      severity: 'spicy',
      emoji: '🔥',
    };
  }
  
  if (high >= 3) {
    return {
      title: 'Almost There',
      message: `⚠️ ${high} high-severity issues. You're one XSS away from trending on HackerNews for the wrong reasons.`,
      severity: 'spicy',
      emoji: '⚠️',
    };
  }
  
  return {
    title: 'Needs Improvement',
    message: `📝 ${total} security issue(s) found. Not terrible, but your future self will judge you.`,
    severity: 'mild',
    emoji: '📝',
  };
}

/**
 * Format roast for display
 */
export function formatRoast(roast: Roast): string {
  return `
${roast.emoji} ${roast.title} ${roast.emoji}

${roast.message}
`;
}

/**
 * Generate shareable roast badge
 */
export function generateRoastBadge(result: AuditResult): string {
  const roast = generateRoast(result);
  const grade = getSecurityGrade(result);
  
  return `
## 🛡️ FivoSense Security Roast

**Grade:** ${grade}  
**Verdict:** ${roast.title}

${roast.message}

---
Roasted by [FivoSense](https://github.com/fivosense) — Neuro-symbolic security scanner
`;
}

/**
 * Get security grade (A-F)
 */
function getSecurityGrade(result: AuditResult): string {
  const { summary } = result;
  
  if (summary.total === 0) return 'A+';
  if (summary.critical === 0 && summary.high === 0) return 'A';
  if (summary.critical === 0 && summary.high <= 2) return 'B';
  if (summary.critical === 0) return 'C';
  if (summary.critical <= 1) return 'D';
  return 'F';
}
