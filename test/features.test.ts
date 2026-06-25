/**
 * Features Tests - Roast, Badge, Fix, Verify
 */

import { describe, it, expect } from 'vitest';
import { generateRoast } from '../src/features/roast.js';
import { generateBadge } from '../src/features/badge.js';
import { generateFix } from '../src/features/fix.js';
import { verifyFix } from '../src/engine/verify.js';
import { auditCode } from '../src/index.js';

describe('Features', () => {
  describe('Roast Mode', () => {
    it('should generate roast for clean code', async () => {
      const result = await auditCode('const x = 1;');
      const roast = generateRoast(result);
      
      expect(roast.title).toBe('Clean Code Champion');
      expect(roast.severity).toBe('mild');
    });
    
    it('should generate spicy/brutal roast for multiple critical issues', async () => {
      const code = `
        const id = req.query.id;
        db.execute(\`DELETE FROM users WHERE id = \${id}\`);
        exec('rm -rf ' + req.body.path);
        res.send('<h1>' + req.query.name + '</h1>');
      `;
      
      const result = await auditCode(code);
      const roast = generateRoast(result);
      
      expect(['spicy', 'brutal']).toContain(roast.severity);
    });
  });
  
  describe('Security Badge', () => {
    it('should generate A+ grade for clean code', async () => {
      const result = await auditCode('const x = 1;');
      const badge = generateBadge(result);
      
      expect(badge.grade).toBe('A+');
      expect(badge.score).toBe(100);
      expect(badge.color).toBe('brightgreen');
    });
    
    it('should generate low grade for critical issues', async () => {
      const code = `
        const id = req.query.id;
        db.execute(\`DELETE FROM users WHERE id = \${id}\`);
        exec('rm -rf ' + req.body.path);
      `;
      
      const result = await auditCode(code);
      const badge = generateBadge(result);
      
      expect(['D', 'F']).toContain(badge.grade);
      expect(badge.score).toBeLessThan(100);
    });
  });
  
  describe('Fix Generation', () => {
    it('should generate SQL injection fix', async () => {
      const code = `
        const userId = req.query.id;
        const query = \`SELECT * FROM users WHERE id = \${userId}\`;
        db.execute(query);
      `;
      
      const result = await auditCode(code);
      const vuln = result.vulnerabilities[0];
      const fix = generateFix(vuln, code);
      
      expect(fix).not.toBeNull();
      expect(fix?.type).toBe('parameterize');
      expect(fix?.confidence).toBeGreaterThan(0.5);
    });
    
    it('should generate XSS fix', async () => {
      const code = `
        const name = req.query.name;
        res.send('<h1>Hello ' + name + '</h1>');
      `;
      
      const result = await auditCode(code);
      const vuln = result.vulnerabilities[0];
      const fix = generateFix(vuln, code);
      
      expect(fix).not.toBeNull();
      expect(fix?.type).toBe('encode');
    });
  });
  
  describe('Fix Verification', () => {
    it('should verify successful fix', () => {
      const original = `
        const userId = req.query.id;
        db.execute(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;
      
      const fixed = `
        const userId = parseInt(req.query.id);
        db.execute(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;
      
      const verification = verifyFix(original, fixed, 3);
      
      expect(verification.success).toBe(true);
      expect(verification.regression).toBe(false);
    });
    
    it('should detect regressions', () => {
      const original = `
        const userId = req.query.id;
        db.execute(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;
      
      const fixed = `
        const userId = req.query.id;
        const name = req.query.name;
        db.execute(\`SELECT * FROM users WHERE id = \${userId}\`);
        eval(name);
      `;
      
      const verification = verifyFix(original, fixed, 3);
      
      expect(verification.regression).toBe(true);
      expect(verification.newIssues).toBeGreaterThan(0);
    });
  });
});
