/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Taint Analysis - tracks data flow from sources to sinks
 * Generates taint-trace proofs for each vulnerability
 */

import { DataFlowGraph, TaintPath, formatTaintPath } from './graph.js';

export interface TaintTrace {
  finding: string;
  severity: 'critical' | 'high' | 'medium';
  category: string;
  cwe?: string;
  path: string;
  evidence: string[];
  location: {
    file: string;
    line: number;
    column: number;
  };
  sanitized: boolean;
  confidence: number;
}

/**
 * Generate taint traces from data-flow graph
 */
export function generateTaintTraces(graph: DataFlowGraph, filename: string): TaintTrace[] {
  const traces: TaintTrace[] = [];

  for (const taintPath of graph.taintPaths) {
    const trace = buildTaintTrace(taintPath, filename);
    traces.push(trace);
  }

  return traces;
}

/**
 * Build a single taint trace from a taint path
 */
function buildTaintTrace(path: TaintPath, filename: string): TaintTrace {
  const source = path.source;
  const sink = path.sink;
  
  const evidence: string[] = [];
  
  // Build evidence chain
  evidence.push(`Source: ${source.value} at line ${source.loc?.start.line || '?'}`);
  evidence.push(`  Type: ${source.sourcePattern?.description || 'untrusted input'}`);
  
  if (path.sanitized) {
    evidence.push('  ✅ Sanitized');
  } else {
    evidence.push('  ❌ NOT sanitized');
  }
  
  evidence.push(`Sink: ${sink.name} at line ${sink.loc?.start.line || '?'}`);
  evidence.push(`  Type: ${sink.sinkPattern?.description || 'dangerous operation'}`);
  
  const finding = path.sanitized
    ? `Sanitized ${sink.sinkPattern?.category || 'data flow'}`
    : `Potential ${sink.sinkPattern?.category || 'vulnerability'}`;

  return {
    finding,
    severity: sink.sinkPattern?.severity || 'medium',
    category: sink.sinkPattern?.category || 'unknown',
    cwe: sink.sinkPattern?.cwe,
    path: formatTaintPath(path),
    evidence,
    location: {
      file: filename,
      line: sink.loc?.start.line || 0,
      column: sink.loc?.start.column || 0,
    },
    sanitized: path.sanitized,
    confidence: path.confidence,
  };
}

/**
 * Filter traces by severity
 */
export function filterBySeverity(
  traces: TaintTrace[],
  severity: 'critical' | 'high' | 'medium'
): TaintTrace[] {
  return traces.filter(t => t.severity === severity);
}

/**
 * Get only vulnerable (unsanitized) traces
 */
export function getVulnerableTraces(traces: TaintTrace[]): TaintTrace[] {
  return traces.filter(t => !t.sanitized);
}

/**
 * Format trace for display
 */
export function formatTrace(trace: TaintTrace): string {
  const icon = trace.sanitized ? '✅' : '❌';
  const lines = [
    `${icon} [${trace.severity.toUpperCase()}] ${trace.finding}`,
    `   ${trace.location.file}:${trace.location.line}:${trace.location.column}`,
    `   ${trace.path}`,
  ];
  
  if (trace.cwe) {
    lines.push(`   CWE: ${trace.cwe}`);
  }
  
  lines.push('   Evidence:');
  trace.evidence.forEach(e => lines.push(`     ${e}`));
  
  return lines.join('\n');
}
