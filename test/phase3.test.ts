/**
 * Phase 3 Tests - Reachability, Adversary, Agent Hooks
 */

import { describe, it, expect } from 'vitest';
import { analyzeReachability, filterReachablePaths } from '../src/engine/reach.js';
import { buildAdversarialPrompt, parseAdversarialResult } from '../src/engine/adversary.js';
import { checkAction, preToolUseHook } from '../src/hooks/agent.js';

describe('Phase 3 Features', () => {
  describe('Reachability Analysis', () => {
    it('should identify entry points', () => {
      const code = `
        app.get('/users', (req, res) => {
          const id = req.query.id;
          getUser(id);
        });
        
        function getUser(id) {
          return db.query('SELECT * FROM users WHERE id = ' + id);
        }
      `;
      
      const result = analyzeReachability(code);
      
      expect(result.entryPoints.length).toBeGreaterThan(0);
      expect(result.entryPoints[0]).toContain('app.get');
    });
    
    it('should filter reachable paths', () => {
      const paths = [
        { location: { line: 5 } },
        { location: { line: 10 } },
        { location: { line: 15 } },
      ];
      
      const reachability = {
        reachableFunctions: new Set(),
        reachableLines: new Set([5, 10]),
        entryPoints: [],
        totalFunctions: 0,
        reachableFunctions: 0,
        reductionPercent: 0,
      };
      
      const filtered = filterReachablePaths(paths, reachability);
      
      expect(filtered.length).toBe(2);
    });
  });
  
  describe('Adversarial Verification', () => {
    it('should build adversarial prompt', () => {
      const trace = {
        finding: 'SQL Injection',
        category: 'sql',
        cwe: 'CWE-89',
        path: 'req.query.id → db.execute',
        evidence: [],
        location: { file: 'test.js', line: 5, column: 0 },
        sanitized: false,
        confidence: 0.9,
        severity: 'critical' as const,
      };
      
      const prompt = buildAdversarialPrompt(trace, 'const id = req.query.id;');
      
      expect(prompt).toContain('security researcher');
      expect(prompt).toContain('SQL Injection');
      expect(prompt).toContain('exploit');
    });
    
    it('should parse adversarial result', () => {
      const response = `
      Here's my analysis:
      \`\`\`json
      {
        "exploitable": true,
        "confidence": 0.95,
        "attackVector": "SQL injection via query parameter",
        "payload": "' OR '1'='1",
        "reasoning": "No sanitization present"
      }
      \`\`\`
      `;
      
      const result = parseAdversarialResult(response);
      
      expect(result).not.toBeNull();
      expect(result?.exploitable).toBe(true);
      expect(result?.confidence).toBe(0.95);
    });
  });
  
  describe('Agent Hooks', () => {
    it('should block destructive commands', () => {
      const result = checkAction('rm -rf /');
      
      expect(result.blocked).toBe(true);
      expect(result.severity).toBe('critical');
    });
    
    it('should block hardcoded secrets', () => {
      const code = 'const apiKey = "sk-1234567890123456789012345678901234567890123456";';
      const result = checkAction('', code);
      
      expect(result.blocked).toBe(true);
      expect(result.severity).toBe('high');
    });
    
    it('should allow safe actions', () => {
      const result = checkAction('ls -la');
      
      expect(result.blocked).toBe(false);
    });
    
    it('should return exit code 2 for blocked actions', () => {
      const exitCode = preToolUseHook('bash', { command: 'rm -rf /' });
      
      expect(exitCode).toBe(2);
    });
    
    it('should return exit code 0 for allowed actions', () => {
      const exitCode = preToolUseHook('bash', { command: 'echo hello' });
      
      expect(exitCode).toBe(0);
    });
  });
});
