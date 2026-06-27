/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Security Badge Generator - Creates shareable security report cards
 */

import { AuditResult } from '../index.js';

export interface SecurityBadge {
  grade: string;
  score: number;
  color: string;
  markdown: string;
  shield: string;
}

/**
 * Generate security badge
 */
export function generateBadge(result: AuditResult): SecurityBadge {
  const grade = calculateGrade(result);
  const score = calculateScore(result);
  const color = getGradeColor(grade);
  
  const shield = `https://img.shields.io/badge/security-${grade}-${color}`;
  
  const markdown = `## 🛡️ Security Report Card

![Security Grade](${shield})

**Grade:** ${grade}  
**Score:** ${score}/100

### Summary
- Total Issues: ${result.summary.total}
- Critical: ${result.summary.critical}
- High: ${result.summary.high}
- Medium: ${result.summary.medium}

---
Scanned by [FivoSense](https://github.com/fivosense) — Neuro-symbolic AI security scanner
`;
  
  return {
    grade,
    score,
    color,
    markdown,
    shield,
  };
}

/**
 * Calculate security grade (A+ to F)
 */
function calculateGrade(result: AuditResult): string {
  const { summary } = result;
  
  if (summary.total === 0) return 'A+';
  if (summary.critical === 0 && summary.high === 0) return 'A';
  if (summary.critical === 0 && summary.high <= 2) return 'B';
  if (summary.critical === 0 && summary.high <= 5) return 'C';
  if (summary.critical <= 1) return 'D';
  return 'F';
}

/**
 * Calculate numeric security score (0-100)
 */
function calculateScore(result: AuditResult): number {
  const { summary } = result;
  
  // Start at 100, deduct for issues
  let score = 100;
  score -= summary.critical * 20;  // -20 per critical
  score -= summary.high * 10;      // -10 per high
  score -= summary.medium * 5;     // -5 per medium
  
  return Math.max(0, score);
}

/**
 * Get color for grade
 */
function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    'A+': 'brightgreen',
    'A': 'green',
    'B': 'yellowgreen',
    'C': 'yellow',
    'D': 'orange',
    'F': 'red',
  };
  
  return colors[grade] || 'lightgrey';
}

/**
 * Generate badge markdown for README
 */
export function generateBadgeMarkdown(result: AuditResult): string {
  const badge = generateBadge(result);
  return badge.markdown;
}
