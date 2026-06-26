#!/usr/bin/env node
/**
 * FivoSense CLI
 */

import { auditFile, formatAuditResult } from '../index.js';
import { generateRoast, formatRoast, generateBadge } from '../features/index.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🛡️  FivoSense - Neuro-symbolic AI Security Scanner

Usage:
  fivosense <file>              Scan a file for vulnerabilities
  fivosense --roast <file>      Get roasted for security issues 🔥
  fivosense --badge <file>      Get your security grade badge

Example:
  fivosense src/server.js
  fivosense --roast src/api.js
  fivosense --badge src/app.js
  `);
  process.exit(0);
}

// Parse command and file
let mode = 'scan';
let filepath = args[0];

if (args[0] === '--roast' || args[0] === '-r') {
  mode = 'roast';
  filepath = args[1];
} else if (args[0] === '--badge' || args[0] === '-b') {
  mode = 'badge';
  filepath = args[1];
} else if (args[0] === 'audit') {
  filepath = args[1];
}

if (!filepath) {
  console.error('\n❌ Error: Please provide a file to scan\n');
  process.exit(1);
}

async function main() {
  try {
    console.log(`\n🔍 Auditing ${filepath}...\n`);
    
    const result = await auditFile(filepath);
    
    if (mode === 'roast') {
      // Roast mode
      const roast = generateRoast(result);
      const roastText = formatRoast(roast);
      console.log('\n' + roastText + '\n');
    } else if (mode === 'badge') {
      // Badge mode
      const badge = generateBadge(result);
      console.log('\n🛡️ Security Badge\n');
      console.log(`Grade: ${badge.grade}`);
      console.log(`Score: ${badge.score}/100`);
      console.log(`\nFindings:`);
      console.log(`  Critical: ${result.summary.critical}`);
      console.log(`  High: ${result.summary.high}`);
      console.log(`  Medium: ${result.summary.medium}`);
      console.log();
    } else {
      // Normal scan mode
      const output = formatAuditResult(result);
      console.log(output);
    }
    
    // Exit with error code if critical/high findings
    if (result.summary.critical > 0 || result.summary.high > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
