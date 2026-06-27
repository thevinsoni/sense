/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Fix Verification - Re-analyze code after fix to check for regressions
 */

import { buildDataFlowGraph, getVulnerablePaths } from './graph.js';
import { generateTaintTraces } from './taint.js';

export interface VerificationResult {
  success: boolean;
  originalIssues: number;
  remainingIssues: number;
  newIssues: number;
  regression: boolean;
  message: string;
}

/**
 * Verify that a fix actually resolved the vulnerability
 */
export function verifyFix(
  originalCode: string,
  fixedCode: string,
  targetLine: number
): VerificationResult {
  // Analyze original code
  const originalGraph = buildDataFlowGraph(originalCode);
  const originalTraces = generateTaintTraces(originalGraph, 'original.js');
  const originalVulns = originalTraces.filter(t => !t.sanitized);
  
  // Analyze fixed code
  const fixedGraph = buildDataFlowGraph(fixedCode);
  const fixedTraces = generateTaintTraces(fixedGraph, 'fixed.js');
  const fixedVulns = fixedTraces.filter(t => !t.sanitized);
  
  // Check for target vulnerability
  const targetVuln = originalVulns.find(v => v.location.line === targetLine);
  const targetFixed = !fixedVulns.find(v => v.location.line === targetLine);
  
  // Check for regressions (new vulnerabilities introduced)
  const newIssues = fixedVulns.filter(fv => 
    !originalVulns.some(ov => 
      ov.location.line === fv.location.line && 
      ov.category === fv.category
    )
  ).length;
  
  const regression = newIssues > 0;
  
  let message = '';
  if (targetFixed && !regression) {
    message = '✅ Fix verified: vulnerability resolved, no regressions';
  } else if (targetFixed && regression) {
    message = `⚠️ Fix applied but introduced ${newIssues} new issue(s)`;
  } else if (!targetFixed) {
    message = '❌ Fix failed: vulnerability still present';
  }
  
  return {
    success: targetFixed && !regression,
    originalIssues: originalVulns.length,
    remainingIssues: fixedVulns.length,
    newIssues,
    regression,
    message,
  };
}

/**
 * Verify multiple fixes
 */
export function verifyMultipleFixes(
  originalCode: string,
  fixedCode: string
): VerificationResult {
  const originalGraph = buildDataFlowGraph(originalCode);
  const originalTraces = generateTaintTraces(originalGraph, 'original.js');
  const originalVulns = originalTraces.filter(t => !t.sanitized);
  
  const fixedGraph = buildDataFlowGraph(fixedCode);
  const fixedTraces = generateTaintTraces(fixedGraph, 'fixed.js');
  const fixedVulns = fixedTraces.filter(t => !t.sanitized);
  
  const resolved = originalVulns.length - fixedVulns.length;
  const newIssues = Math.max(0, fixedVulns.length - originalVulns.length);
  
  return {
    success: fixedVulns.length < originalVulns.length && newIssues === 0,
    originalIssues: originalVulns.length,
    remainingIssues: fixedVulns.length,
    newIssues,
    regression: newIssues > 0,
    message: `Resolved ${resolved} issue(s), ${newIssues} new issue(s) introduced`,
  };
}
