/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Reachability Analysis - Filters code to only entry-point reachable paths
 * This reduces analysis surface by ~97% (OpenAnt research)
 */

import { parse } from '@babel/parser';
import * as traverseModule from '@babel/traverse';
import * as t from '@babel/types';

// @ts-ignore
const traverse = traverseModule.default ?? traverseModule;

export interface ReachabilityResult {
  reachableFunctions: Set<string>;
  reachableLines: Set<number>;
  entryPoints: string[];
  totalFunctions: number;
  reachableFunctionCount: number;
  reductionPercent: number;
}

/**
 * Common entry points in web applications
 */
const ENTRY_POINT_PATTERNS = [
  /^app\.(get|post|put|delete|patch)/,
  /^router\.(get|post|put|delete|patch)/,
  /^exports\./,
  /^module\.exports/,
  /^export /,
  /addEventListener/,
  /^on[A-Z]/,
];

/**
 * Analyze reachability from entry points
 */
export function analyzeReachability(code: string): ReachabilityResult {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
    errorRecovery: true,
  });

  const entryPoints: string[] = [];
  const allFunctions = new Set<string>();
  const reachableFunctions = new Set<string>();
  const reachableLines = new Set<number>();
  const functionCalls = new Map<string, Set<string>>();

  (traverse as any)(ast, {
    FunctionDeclaration(path: any) {
      const name = path.node.id?.name;
      if (name) {
        allFunctions.add(name);
      }
    },
    
    CallExpression(path: any) {
      const callee = getCalleeName(path.node.callee);
      
      if (isEntryPoint(callee)) {
        entryPoints.push(callee);
        
        const callback = path.node.arguments[1] || path.node.arguments[0];
        if (t.isFunctionExpression(callback) || t.isArrowFunctionExpression(callback)) {
          markReachable(callback, reachableFunctions, reachableLines);
        }
      }
    },
  });

  const visited = new Set<string>();
  const queue = [...entryPoints];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    reachableFunctions.add(current);
    
    const callees = functionCalls.get(current) || new Set();
    for (const callee of callees) {
      if (!visited.has(callee)) {
        queue.push(callee);
      }
    }
  }

  const totalFuncs = allFunctions.size || 1;
  const reachableFuncs = reachableFunctions.size;
  const reduction = ((totalFuncs - reachableFuncs) / totalFuncs) * 100;

  return {
    reachableFunctions,
    reachableLines,
    entryPoints,
    totalFunctions: totalFuncs,
    reachableFunctionCount: reachableFuncs,
    reductionPercent: reduction,
  };
}

function isEntryPoint(callee: string): boolean {
  return ENTRY_POINT_PATTERNS.some(pattern => pattern.test(callee));
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

function markReachable(
  node: t.Node,
  reachableFunctions: Set<string>,
  reachableLines: Set<number>
): void {
  if (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) {
    if (node.loc) {
      for (let i = node.loc.start.line; i <= node.loc.end.line; i++) {
        reachableLines.add(i);
      }
    }
  }
}

export function filterReachablePaths<T extends { location: { line: number } }>(
  paths: T[],
  reachability: ReachabilityResult
): T[] {
  return paths.filter(path => 
    reachability.reachableLines.size === 0 ||
    reachability.reachableLines.has(path.location.line)
  );
}
