/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Scope Management - Track and filter relevant code changes
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CodeScope {
  files: string[];
  lines: Map<string, Set<number>>;
  changedFunctions: Map<string, string[]>;
}

/**
 * Get diff scope for current changes
 */
export async function getDiffScope(base: string = 'main'): Promise<CodeScope> {
  const scope: CodeScope = {
    files: [],
    lines: new Map(),
    changedFunctions: new Map(),
  };

  try {
    // Get changed files
    const { stdout: filesOutput } = await execAsync(`git diff --name-only ${base}...HEAD`);
    const files = filesOutput
      .split('\n')
      .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx'))
      .filter(f => f.trim().length > 0);

    scope.files = files;

    // Get changed lines for each file
    for (const file of files) {
      try {
        const { stdout: diffOutput } = await execAsync(`git diff ${base}...HEAD -- ${file}`);
        const changedLines = parseDiffLines(diffOutput);
        scope.lines.set(file, changedLines);
      } catch (error) {
        console.warn(`Failed to get diff for ${file}:`, error);
      }
    }

    return scope;
  } catch (error) {
    console.warn('Failed to get diff scope:', error);
    return scope;
  }
}

/**
 * Parse diff output to extract changed line numbers
 */
function parseDiffLines(diff: string): Set<number> {
  const lines = new Set<number>();
  const diffLines = diff.split('\n');
  
  let currentLine = 0;
  
  for (const line of diffLines) {
    // Parse hunk header: @@ -1,5 +1,7 @@
    const hunkMatch = line.match(/^@@\s+-\d+,?\d*\s+\+(\d+),?(\d*)\s+@@/);
    if (hunkMatch) {
      currentLine = parseInt(hunkMatch[1], 10);
      continue;
    }
    
    // Track added/modified lines
    if (line.startsWith('+') && !line.startsWith('+++')) {
      lines.add(currentLine);
      currentLine++;
    } else if (!line.startsWith('-')) {
      currentLine++;
    }
  }
  
  return lines;
}

/**
 * Filter findings to only those in changed scope
 */
export function filterFindingsByScope<T extends { location?: { line: number } }>(
  findings: T[],
  file: string,
  scope: CodeScope
): T[] {
  const changedLines = scope.lines.get(file);
  
  if (!changedLines || changedLines.size === 0) {
    // No scope info, include all findings
    return findings;
  }
  
  return findings.filter(finding => {
    const line = finding.location?.line;
    if (!line) return false;
    
    // Include if exact line changed
    if (changedLines.has(line)) return true;
    
    // Include if within 5 lines of a change (context)
    for (const changedLine of changedLines) {
      if (Math.abs(line - changedLine) <= 5) return true;
    }
    
    return false;
  });
}

/**
 * Get scope for staged changes
 */
export async function getStagedScope(): Promise<CodeScope> {
  const scope: CodeScope = {
    files: [],
    lines: new Map(),
    changedFunctions: new Map(),
  };

  try {
    // Get staged files
    const { stdout: filesOutput } = await execAsync('git diff --cached --name-only --diff-filter=ACM');
    const files = filesOutput
      .split('\n')
      .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx'))
      .filter(f => f.trim().length > 0);

    scope.files = files;

    // Get changed lines for each file
    for (const file of files) {
      try {
        const { stdout: diffOutput } = await execAsync(`git diff --cached -- ${file}`);
        const changedLines = parseDiffLines(diffOutput);
        scope.lines.set(file, changedLines);
      } catch (error) {
        console.warn(`Failed to get staged diff for ${file}:`, error);
      }
    }

    return scope;
  } catch (error) {
    console.warn('Failed to get staged scope:', error);
    return scope;
  }
}

/**
 * Check if a line is in scope
 */
export function isLineInScope(file: string, line: number, scope: CodeScope): boolean {
  const changedLines = scope.lines.get(file);
  if (!changedLines) return false;
  
  // Exact match
  if (changedLines.has(line)) return true;
  
  // Context match (within 5 lines)
  for (const changedLine of changedLines) {
    if (Math.abs(line - changedLine) <= 5) return true;
  }
  
  return false;
}
