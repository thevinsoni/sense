/**
 * FivoCore Engine Tests
 */

import { describe, it, expect } from 'vitest';
import { buildDataFlowGraph, getVulnerablePaths } from '../src/engine/graph.js';
import { generateTaintTraces, getVulnerableTraces } from '../src/engine/taint.js';
import { detectSecrets } from '../src/rules/secrets.js';
import { detectDestructive } from '../src/rules/destructive.js';

describe('FivoCore Engine', () => {
  describe('Taint Analysis', () => {
    it('should detect SQL injection', () => {
      const code = `
        const userId = req.query.id;
        const query = \`SELECT * FROM users WHERE id = \${userId}\`;
        db.execute(query);
      `;
      
      const graph = buildDataFlowGraph(code);
      const vulnPaths = getVulnerablePaths(graph);
      
      expect(vulnPaths.length).toBeGreaterThan(0);
      expect(vulnPaths[0].sink.sinkPattern?.category).toBe('sql');
    });
    
    it('should detect XSS', () => {
      const code = `
        const name = req.query.name;
        res.send('<h1>Hello ' + name + '</h1>');
      `;
      
      const graph = buildDataFlowGraph(code);
      const vulnPaths = getVulnerablePaths(graph);
      
      expect(vulnPaths.length).toBeGreaterThan(0);
      expect(vulnPaths[0].sink.sinkPattern?.category).toBe('xss');
    });
    
    it('should detect command injection', () => {
      const code = `
        const file = req.body.filename;
        exec('tar -czf backup.tar.gz ' + file);
      `;
      
      const graph = buildDataFlowGraph(code);
      const vulnPaths = getVulnerablePaths(graph);
      
      expect(vulnPaths.length).toBeGreaterThan(0);
      expect(vulnPaths[0].sink.sinkPattern?.category).toBe('command');
    });
    
    it('should track taint through variables', () => {
      const code = `
        const userInput = req.query.name;
        const greeting = 'Hello ' + userInput;
        res.send(greeting);
      `;
      
      const graph = buildDataFlowGraph(code);
      const vulnPaths = getVulnerablePaths(graph);
      
      expect(vulnPaths.length).toBeGreaterThan(0);
    });
  });
  
  describe('Secret Detection', () => {
    it('should detect hardcoded API keys', () => {
      const code = `
        const apiKey = "sk-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890123456";
        const client = new OpenAI({ apiKey });
      `;
      
      const secrets = detectSecrets(code);
      expect(secrets.length).toBeGreaterThan(0);
      // Match either openai_key or api_key (both valid)
      expect(['openai_key', 'api_key']).toContain(secrets[0].type);
    });
    
    it('should detect hardcoded passwords', () => {
      const code = `
        const config = {
          password: "SuperSecret123"
        };
      `;
      
      const secrets = detectSecrets(code);
      expect(secrets.length).toBeGreaterThan(0);
      expect(secrets[0].type).toBe('password');
    });
  });
  
  describe('Destructive Command Detection', () => {
    it('should detect rm -rf', () => {
      const code = `exec('rm -rf /')`;
      const destructive = detectDestructive(code);
      
      expect(destructive.length).toBeGreaterThan(0);
      expect(destructive[0].severity).toBe('critical');
    });
    
    it('should detect DROP TABLE', () => {
      const code = `db.execute('DROP TABLE users')`;
      const destructive = detectDestructive(code);
      
      expect(destructive.length).toBeGreaterThan(0);
      expect(destructive[0].category).toBe('database');
    });
  });
});
