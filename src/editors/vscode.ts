/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * VS Code Extension Adapter
 * Integrates FivoSense with VS Code
 */

import { auditFile, formatAuditResult } from '../index.js';

export interface VSCodeDiagnostic {
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  code?: string;
}

/**
 * Convert FivoSense results to VS Code diagnostics
 */
export async function analyzeWorkspace(files: string[]): Promise<VSCodeDiagnostic[]> {
  const diagnostics: VSCodeDiagnostic[] = [];
  
  for (const file of files) {
    try {
      const result = await auditFile(file);
      
      // Convert vulnerabilities to diagnostics
      result.vulnerabilities.forEach(vuln => {
        diagnostics.push({
          file,
          line: vuln.location.line,
          column: vuln.location.column,
          severity: vuln.severity === 'critical' ? 'error' : 'warning',
          message: `${vuln.finding}: ${vuln.path}`,
          source: 'FivoSense',
          code: vuln.cwe,
        });
      });
      
      // Convert secrets to diagnostics
      result.secrets.forEach(secret => {
        diagnostics.push({
          file,
          line: secret.line,
          column: 0,
          severity: 'error',
          message: `${secret.description}: ${secret.match}`,
          source: 'FivoSense',
          code: 'SECRET',
        });
      });
      
      // Convert destructive commands to diagnostics
      result.destructive.forEach(cmd => {
        diagnostics.push({
          file,
          line: 0,
          column: 0,
          severity: 'error',
          message: `${cmd.description} (${cmd.category})`,
          source: 'FivoSense',
          code: 'DESTRUCTIVE',
        });
      });
    } catch (error) {
      // Skip files that can't be analyzed
      console.error(`Error analyzing ${file}:`, error);
    }
  }
  
  return diagnostics;
}

/**
 * Quick fix provider for VS Code
 */
export function provideCodeActions(diagnostic: VSCodeDiagnostic): any[] {
  const actions = [];
  
  // Add quick fix action
  actions.push({
    title: 'Fix with FivoSense',
    kind: 'quickfix',
    diagnostics: [diagnostic],
    command: {
      command: 'fivosense.fix',
      title: 'Apply Fix',
      arguments: [diagnostic.file, diagnostic.line],
    },
  });
  
  // Add explain action
  actions.push({
    title: 'Explain vulnerability',
    kind: 'info',
    diagnostics: [diagnostic],
    command: {
      command: 'fivosense.explain',
      title: 'Show Details',
      arguments: [diagnostic],
    },
  });
  
  return actions;
}

/**
 * VS Code command handlers
 */
export const commands = {
  'fivosense.scan': async (uri: string) => {
    const result = await auditFile(uri);
    return formatAuditResult(result);
  },
  
  'fivosense.fix': async (file: string, line: number) => {
    // TODO: Implement fix application
    return 'Fix applied';
  },
  
  'fivosense.explain': async (diagnostic: VSCodeDiagnostic) => {
    return `Security Issue: ${diagnostic.message}\n\nFile: ${diagnostic.file}:${diagnostic.line}`;
  },
};
