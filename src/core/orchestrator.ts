/**
 * Orchestrator - Coordinates analysis pipeline and flow control
 */

import { buildDataFlowGraph } from '../engine/graph.js';
import { generateTaintTraces, type TaintTrace } from '../engine/taint.js';
import { detectSecrets } from '../rules/secrets.js';
import { detectDestructive } from '../rules/destructive.js';
import { judgePathWithAI } from '../ai/judge.js';
import { verifyWithAdversary } from '../engine/adversary.js';
import { generatePoC } from '../engine/poc.js';
import { getDiffScope, filterFindingsByScope, type CodeScope } from './scope.js';
import type { AuditResult } from '../index.js';
import type { AIProvider } from '../ai/client.js';

export interface OrchestratorOptions {
  enableAI?: boolean;
  enableAdversarial?: boolean;
  enablePoC?: boolean;
  scopeToDiff?: boolean;
  diffBase?: string;
  aiProvider?: AIProvider;
  verbose?: boolean;
}

/**
 * Main orchestration pipeline
 */
export async function orchestrateAudit(
  code: string,
  filepath: string,
  options: OrchestratorOptions = {}
): Promise<AuditResult> {
  const {
    enableAI = false,
    enableAdversarial = false,
    enablePoC = false,
    scopeToDiff = false,
    diffBase = 'main',
    aiProvider,
    verbose = false,
  } = options;

  if (verbose) {
    console.log(`🔍 Starting audit: ${filepath}`);
    console.log(`   AI Judge: ${enableAI ? '✅' : '❌'}`);
    console.log(`   Adversarial: ${enableAdversarial ? '✅' : '❌'}`);
    console.log(`   PoC Generation: ${enablePoC ? '✅' : '❌'}`);
    console.log(`   Scope to diff: ${scopeToDiff ? '✅' : '❌'}`);
  }

  // Step 1: Get scope if needed
  let scope: CodeScope | undefined;
  if (scopeToDiff) {
    if (verbose) console.log(`📋 Getting diff scope (base: ${diffBase})...`);
    scope = await getDiffScope(diffBase);
    if (verbose) console.log(`   ${scope.files.length} files in scope`);
  }

  // Step 2: Build data-flow graph
  if (verbose) console.log(`🔨 Building data-flow graph...`);
  const graph = buildDataFlowGraph(code, filepath);

  // Step 3: Taint analysis
  if (verbose) console.log(`🔍 Running taint analysis...`);
  const traces = generateTaintTraces(graph, filepath);
  
  // Convert traces to vulnerabilities format
  const allVulnerabilities = traces.map(trace => ({
    finding: trace.finding,
    severity: trace.severity,
    category: trace.category,
    cwe: trace.cwe,
    path: trace.path.split(' → '),
    evidence: trace.evidence,
    location: trace.location,
    sanitized: trace.sanitized,
    confidence: 0.8,
  }));

  // Step 4: Filter by scope if enabled
  let vulnerabilities = allVulnerabilities;
  if (scope && scopeToDiff) {
    if (verbose) console.log(`🎯 Filtering by scope...`);
    vulnerabilities = filterFindingsByScope(vulnerabilities, filepath, scope);
    if (verbose) console.log(`   ${vulnerabilities.length} vulnerabilities in scope`);
  }

  // Step 5: AI judgment (if enabled)
  if (enableAI && vulnerabilities.length > 0) {
    if (verbose) console.log(`🤖 Running AI judgment...`);
    
    for (let i = 0; i < vulnerabilities.length; i++) {
      const vuln = vulnerabilities[i];
      
      try {
        const judgment = await judgePathWithAI({
          source: vuln.path[0] || 'unknown',
          sourceType: 'user input',
          sourceLoc: `line ${vuln.location.line}`,
          sink: vuln.path[vuln.path.length - 1] || 'unknown',
          sinkType: vuln.category,
          category: vuln.category,
          cwe: vuln.cwe,
          dataFlow: vuln.path.join(' → '),
          codeSnippet: code.split('\n').slice(
            Math.max(0, vuln.location.line - 3),
            vuln.location.line + 2
          ).join('\n'),
          language: filepath.endsWith('.ts') || filepath.endsWith('.tsx') ? 'typescript' : 'javascript',
        }, aiProvider);

        // Update vulnerability with AI judgment
        vuln.confidence = judgment.confidence;
        
        if (verbose) {
          console.log(`   [${i + 1}/${vulnerabilities.length}] ${vuln.finding}: ${judgment.exploitable ? '❌ Exploitable' : '✅ Safe'} (confidence: ${judgment.confidence})`);
        }
      } catch (error) {
        if (verbose) {
          console.warn(`   [${i + 1}/${vulnerabilities.length}] AI judgment failed:`, error);
        }
      }
    }
  }

  // Step 6: Adversarial verification (if enabled)
  if (enableAdversarial && vulnerabilities.length > 0) {
    if (verbose) console.log(`⚔️  Running adversarial verification...`);
    
    for (let i = 0; i < vulnerabilities.length; i++) {
      const vuln = vulnerabilities[i];
      
      try {
        const trace = traces.find((t: TaintTrace) => 
          t.category === vuln.category && t.location.line === vuln.location.line
        );
        
        if (trace) {
          const adversary = await verifyWithAdversary(trace, code, aiProvider);
          
          // Update confidence based on adversarial result
          vuln.confidence = Math.min(vuln.confidence, adversary.confidence);
          
          if (verbose) {
            console.log(`   [${i + 1}/${vulnerabilities.length}] ${adversary.exploitable ? '⚔️  Exploit found' : '🛡️  Defense holds'}`);
          }
        }
      } catch (error) {
        if (verbose) {
          console.warn(`   [${i + 1}/${vulnerabilities.length}] Adversarial verification failed:`, error);
        }
      }
    }
  }

  // Step 7: PoC generation (if enabled)
  if (enablePoC && vulnerabilities.length > 0) {
    if (verbose) console.log(`💣 Generating PoCs...`);
    
    for (const vuln of vulnerabilities) {
      try {
        const trace = traces.find((t: TaintTrace) => 
          t.category === vuln.category && t.location.line === vuln.location.line
        );
        
        if (trace) {
          const poc = generatePoC(trace);
          // Attach PoC to vulnerability (could extend Vulnerability type)
          (vuln as any).poc = poc;
        }
      } catch (error) {
        if (verbose) {
          console.warn(`   Failed to generate PoC:`, error);
        }
      }
    }
  }

  // Step 8: Secret detection
  if (verbose) console.log(`🔑 Detecting secrets...`);
  const secrets = detectSecrets(code);

  // Step 9: Destructive command detection
  if (verbose) console.log(`💥 Detecting destructive commands...`);
  const destructive = detectDestructive(code);

  // Step 10: Build summary
  const summary = {
    total: vulnerabilities.length + secrets.length + destructive.length,
    critical: vulnerabilities.filter((v: any) => v.severity === 'critical').length,
    high: vulnerabilities.filter((v: any) => v.severity === 'high').length + secrets.length,
    medium: vulnerabilities.filter((v: any) => v.severity === 'medium').length + destructive.length,
  };

  if (verbose) {
    console.log(`\n📊 Audit complete:`);
    console.log(`   Total: ${summary.total}`);
    console.log(`   Critical: ${summary.critical}`);
    console.log(`   High: ${summary.high}`);
    console.log(`   Medium: ${summary.medium}\n`);
  }

  return {
    vulnerabilities,
    secrets,
    destructive,
    summary,
  };
}

/**
 * Quick audit (no AI, no scope)
 */
export async function quickAudit(code: string, filepath: string): Promise<AuditResult> {
  return orchestrateAudit(code, filepath, {
    enableAI: false,
    enableAdversarial: false,
    enablePoC: false,
    scopeToDiff: false,
    verbose: false,
  });
}

/**
 * Full audit (with AI and adversarial)
 */
export async function fullAudit(
  code: string,
  filepath: string,
  aiProvider?: AIProvider
): Promise<AuditResult> {
  return orchestrateAudit(code, filepath, {
    enableAI: true,
    enableAdversarial: true,
    enablePoC: true,
    scopeToDiff: false,
    aiProvider,
    verbose: true,
  });
}

/**
 * Diff-scoped audit (only changed code)
 */
export async function diffAudit(
  code: string,
  filepath: string,
  diffBase: string = 'main'
): Promise<AuditResult> {
  return orchestrateAudit(code, filepath, {
    enableAI: false,
    enableAdversarial: false,
    enablePoC: false,
    scopeToDiff: true,
    diffBase,
    verbose: true,
  });
}
