/**
 * FivoCore Graph Builder
 */

import { parse } from '@babel/parser';
import * as traverseModule from '@babel/traverse';
import * as t from '@babel/types';
import { isSource, SourcePattern } from './sources.js';
import { isSink, SinkPattern } from './sinks.js';

// @ts-ignore - Handle CJS/ESM interop
const traverse = traverseModule.default ?? traverseModule;

export interface DataFlowNode {
  id: string;
  type: 'source' | 'sink' | 'variable' | 'function';
  name: string;
  value?: string;
  loc?: t.SourceLocation | null;
  sourcePattern?: SourcePattern;
  sinkPattern?: SinkPattern;
}

export interface DataFlowEdge {
  from: string;
  to: string;
  type: 'assignment' | 'call' | 'return' | 'parameter';
  loc?: t.SourceLocation | null;
}

export interface TaintPath {
  source: DataFlowNode;
  sink: DataFlowNode;
  path: DataFlowNode[];
  sanitized: boolean;
  confidence: number;
}

export interface DataFlowGraph {
  nodes: Map<string, DataFlowNode>;
  edges: DataFlowEdge[];
  taintPaths: TaintPath[];
}

const SANITIZERS = new Set([
  'parseInt', 'parseFloat', 'Number', 'escape', 'escapeHtml', 'sanitize',
  'validator.escape', 'validator.trim', 'encodeURIComponent', 'encodeURI',
]);

export function buildDataFlowGraph(code: string, filename = 'input.js'): DataFlowGraph {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
    errorRecovery: true,
  });

  const graph: DataFlowGraph = { nodes: new Map(), edges: [], taintPaths: [] };
  const taintedVars = new Map<string, { source: SourcePattern; sanitized: boolean; node: DataFlowNode }>();
  let nodeIdCounter = 0;
  const getNodeId = () => `node_${nodeIdCounter++}`;

  function addNode(node: DataFlowNode): DataFlowNode {
    graph.nodes.set(node.id, node);
    return node;
  }

  function nodeToString(node: t.Node): string {
    if (t.isMemberExpression(node)) {
      const obj = nodeToString(node.object);
      const prop = t.isIdentifier(node.property) ? node.property.name : '';
      return `${obj}.${prop}`;
    }
    return t.isIdentifier(node) ? node.name : t.isStringLiteral(node) ? node.value : '';
  }

  function getCalleeName(node: t.Node): string {
    if (t.isIdentifier(node)) return node.name;
    if (t.isMemberExpression(node)) {
      const obj = t.isIdentifier(node.object) ? node.object.name : '';
      const prop = t.isIdentifier(node.property) ? node.property.name : '';
      return `${obj}.${prop}`;
    }
    return '';
  }

  function findTaintedVars(node: t.Node): Array<{ varName: string; taint: any }> {
    const results: Array<{ varName: string; taint: any }> = [];
    if (t.isIdentifier(node)) {
      const taint = taintedVars.get(node.name);
      if (taint) results.push({ varName: node.name, taint });
    } else if (t.isTemplateLiteral(node)) {
      node.expressions.forEach(expr => results.push(...findTaintedVars(expr)));
    } else if (t.isBinaryExpression(node)) {
      results.push(...findTaintedVars(node.left), ...findTaintedVars(node.right));
    } else if (t.isCallExpression(node)) {
      node.arguments.forEach(arg => !t.isSpreadElement(arg) && results.push(...findTaintedVars(arg)));
    }
    return results;
  }

  (traverse as any)(ast, {
    VariableDeclarator(path: any) {
      const { id, init } = path.node;
      if (t.isIdentifier(id) && init) {
        const varName = id.name;
        const sourcePattern = isSource(nodeToString(init));
        if (sourcePattern) {
          const node = addNode({
            id: getNodeId(), type: 'source', name: varName, value: nodeToString(init),
            loc: path.node.loc, sourcePattern,
          });
          taintedVars.set(varName, { source: sourcePattern, sanitized: false, node });
        } else {
          const taintedSources = findTaintedVars(init);
          if (taintedSources.length > 0) {
            const firstTaint = taintedSources[0].taint;
            taintedVars.set(varName, { source: firstTaint.source, sanitized: firstTaint.sanitized, node: firstTaint.node });
          }
        }
      }
    },
    CallExpression(path: any) {
      const { callee, arguments: args } = path.node;
      if (SANITIZERS.has(getCalleeName(callee))) {
        args.forEach((arg: any) => {
          if (t.isIdentifier(arg)) {
            const taint = taintedVars.get(arg.name);
            if (taint) taint.sanitized = true;
          }
        });
        return;
      }
      const sinkPattern = isSink(nodeToString(callee));
      if (sinkPattern) {
        const sinkNode = addNode({
          id: getNodeId(), type: 'sink', name: getCalleeName(callee),
          loc: path.node.loc, sinkPattern,
        });
        args.forEach((arg: any) => {
          if (t.isSpreadElement(arg)) return;
          findTaintedVars(arg).forEach(({ taint }) => {
            graph.taintPaths.push({
              source: taint.node, sink: sinkNode, path: [taint.node, sinkNode],
              sanitized: taint.sanitized, confidence: taint.sanitized ? 0.3 : 0.9,
            });
          });
        });
      }
    },
  });

  return graph;
}

export function getVulnerablePaths(graph: DataFlowGraph): TaintPath[] {
  return graph.taintPaths.filter(p => !p.sanitized);
}

export function getPathsBySeverity(graph: DataFlowGraph, severity: 'critical' | 'high' | 'medium'): TaintPath[] {
  return graph.taintPaths.filter(p => p.sink.sinkPattern?.severity === severity);
}

export function formatTaintPath(path: TaintPath): string {
  const sourceStr = `${path.source.value} (${path.source.sourcePattern?.description})`;
  const sinkStr = `${path.sink.name} (${path.sink.sinkPattern?.description})`;
  return `${sourceStr} → ${sinkStr}`;
}
