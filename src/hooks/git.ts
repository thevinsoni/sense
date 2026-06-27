/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Git Hooks - Pre-push security audit
 */

import { auditFile } from '../index.js';
import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitHookResult {
  allowed: boolean;
  findings: number;
  critical: number;
  high: number;
  message: string;
}

/**
 * Get list of staged files
 */
export async function getStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('git diff --cached --name-only --diff-filter=ACM');
    return stdout
      .split('\n')
      .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx'))
      .filter(f => f.trim().length > 0);
  } catch (error) {
    console.warn('Failed to get staged files:', error);
    return [];
  }
}

/**
 * Get list of files changed in current branch vs main
 */
export async function getBranchChangedFiles(base: string = 'main'): Promise<string[]> {
  try {
    const { stdout } = await execAsync(`git diff --name-only ${base}...HEAD`);
    return stdout
      .split('\n')
      .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx'))
      .filter(f => f.trim().length > 0);
  } catch (error) {
    console.warn('Failed to get branch changed files:', error);
    return [];
  }
}

/**
 * Run pre-push hook audit
 */
export async function runPrePushHook(options: {
  blockOnCritical?: boolean;
  blockOnHigh?: boolean;
  verbose?: boolean;
} = {}): Promise<GitHookResult> {
  const {
    blockOnCritical = true,
    blockOnHigh = false,
    verbose = true,
  } = options;

  try {
    // Get files to audit
    const files = await getBranchChangedFiles();
    
    if (files.length === 0) {
      return {
        allowed: true,
        findings: 0,
        critical: 0,
        high: 0,
        message: '✅ No JavaScript/TypeScript files changed',
      };
    }

    if (verbose) {
      console.log(`\n🔍 FivoSense Pre-Push Audit`);
      console.log(`📁 Scanning ${files.length} file(s)...\n`);
    }

    let totalFindings = 0;
    let totalCritical = 0;
    let totalHigh = 0;
    const issues: string[] = [];

    // Audit each file
    for (const file of files) {
      try {
        const result = await auditFile(file);
        
        if (result.summary.total > 0) {
          totalFindings += result.summary.total;
          totalCritical += result.summary.critical;
          totalHigh += result.summary.high;
          
          if (verbose && (result.summary.critical > 0 || result.summary.high > 0)) {
            console.log(`❌ ${file}:`);
            console.log(`   Critical: ${result.summary.critical}, High: ${result.summary.high}, Medium: ${result.summary.medium}`);
            issues.push(`${file}: ${result.summary.critical}C/${result.summary.high}H/${result.summary.medium}M`);
          }
        }
      } catch (error) {
        if (verbose) {
          console.warn(`⚠️  Failed to audit ${file}:`, error);
        }
      }
    }

    // Determine if push should be blocked
    const shouldBlock = (blockOnCritical && totalCritical > 0) || (blockOnHigh && totalHigh > 0);

    if (verbose) {
      console.log(`\n📊 Summary:`);
      console.log(`   Total findings: ${totalFindings}`);
      console.log(`   Critical: ${totalCritical}`);
      console.log(`   High: ${totalHigh}\n`);
    }

    if (shouldBlock) {
      return {
        allowed: false,
        findings: totalFindings,
        critical: totalCritical,
        high: totalHigh,
        message: `❌ Push blocked: ${totalCritical} critical and ${totalHigh} high severity issues found\n\n${issues.join('\n')}\n\nFix these issues or use --no-verify to bypass.`,
      };
    }

    if (totalFindings > 0) {
      return {
        allowed: true,
        findings: totalFindings,
        critical: totalCritical,
        high: totalHigh,
        message: `⚠️  Push allowed with warnings: ${totalFindings} issue(s) found (${totalCritical}C/${totalHigh}H)`,
      };
    }

    return {
      allowed: true,
      findings: 0,
      critical: 0,
      high: 0,
      message: '✅ All files passed security audit',
    };
  } catch (error) {
    return {
      allowed: true,
      findings: 0,
      critical: 0,
      high: 0,
      message: `⚠️  Pre-push hook failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Install git pre-push hook
 */
export async function installPrePushHook(repoPath: string = '.'): Promise<boolean> {
  try {
    const hookPath = `${repoPath}/.git/hooks/pre-push`;
    const hookScript = `#!/bin/sh
# FivoSense pre-push hook
npx fivosense --pre-push
exit $?
`;

    await writeFile(hookPath, hookScript);
    await execAsync(`chmod +x ${hookPath}`);
    
    console.log('✅ Pre-push hook installed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to install pre-push hook:', error);
    return false;
  }
}

async function writeFile(path: string, content: string): Promise<void> {
  const { writeFile } = await import('fs/promises');
  await writeFile(path, content);
}
