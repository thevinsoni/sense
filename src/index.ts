/**
 * FivoSense - Neuro-symbolic AI security plugin
 * Entry point for the engine
 */

import { readFileSync, statSync } from 'fs';
import { buildDataFlowGraph, getVulnerablePaths } from './engine/graph.js';
import { generateTaintTraces, getVulnerableTraces, formatTrace } from './engine/taint.js';
import { detectSecrets } from './rules/secrets.js';
import { detectDestructive } from './rules/destructive.js';

export interface AuditResult {
  vulnerabilities: any[];
  secrets: any[];
  destructive: any[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
  };
}

// Security: Max file size to prevent memory exhaustion
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Audit a file for security issues
 */
export async function auditFile(filepath: string): Promise<AuditResult> {
  // Security check: File size limit
  const stats = statSync(filepath);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }
  
  const code = readFileSync(filepath, 'utf-8');
  return auditCode(code, filepath);
}

/**
 * Audit code string for security issues
 */
export async function auditCode(code: string, filename = 'input.js'): Promise<AuditResult> {
  // Security check: Code length
  if (code.length > MAX_FILE_SIZE) {
    throw new Error(`Code too large: ${(code.length / 1024 / 1024).toFixed(2)}MB (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }
  
  // Build data-flow graph
  const graph = buildDataFlowGraph(code, filename);
  
  // Generate taint traces
  const allTraces = generateTaintTraces(graph, filename);
  const vulnerabilities = getVulnerableTraces(allTraces);
  
  // Detect secrets
  const secrets = detectSecrets(code);
  
  // Detect destructive commands
  const destructive = detectDestructive(code);
  
  // Calculate summary
  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length + 
                        destructive.filter(d => d.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length + 
                    secrets.length + 
                    destructive.filter(d => d.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
  
  return {
    vulnerabilities,
    secrets,
    destructive,
    summary: {
      total: vulnerabilities.length + secrets.length + destructive.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
    },
  };
}

/**
 * Format audit result for display
 */
export function formatAuditResult(result: AuditResult): string {
  const lines: string[] = [];
  
  lines.push('🛡️  FivoSense Security Audit\n');
  lines.push('═'.repeat(50));
  lines.push('');
  
  // Summary
  lines.push('📊 Summary:');
  lines.push(`   Total findings: ${result.summary.total}`);
  lines.push(`   Critical: ${result.summary.critical}`);
  lines.push(`   High: ${result.summary.high}`);
  lines.push(`   Medium: ${result.summary.medium}`);
  lines.push('');
  
  // Vulnerabilities
  if (result.vulnerabilities.length > 0) {
    lines.push('❌ Vulnerabilities:');
    lines.push('');
    result.vulnerabilities.forEach((vuln, i) => {
      lines.push(`${i + 1}. ${formatTrace(vuln)}`);
      lines.push('');
    });
  }
  
  // Secrets
  if (result.secrets.length > 0) {
    lines.push('🔑 Hardcoded Secrets:');
    lines.push('');
    result.secrets.forEach((secret, i) => {
      lines.push(`${i + 1}. [${secret.severity.toUpperCase()}] ${secret.description}`);
      lines.push(`   Line ${secret.line}: ${secret.match}`);
      lines.push('');
    });
  }
  
  // Destructive commands
  if (result.destructive.length > 0) {
    lines.push('💥 Destructive Commands:');
    lines.push('');
    result.destructive.forEach((cmd, i) => {
      lines.push(`${i + 1}. [${cmd.severity.toUpperCase()}] ${cmd.description}`);
      lines.push(`   Category: ${cmd.category}`);
      lines.push('');
    });
  }
  
  if (result.summary.total === 0) {
    lines.push('✅ No security issues found!');
  }
  
  return lines.join('\n');
}

// Export main functions
export * from './engine/graph.js';
export * from './engine/taint.js';
export * from './engine/sources.js';
export * from './engine/sinks.js';
export * from './rules/secrets.js';
export * from './rules/destructive.js';
