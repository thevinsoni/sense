#!/usr/bin/env node
/**
 * FivoSense CLI
 */

import { auditFile, formatAuditResult } from '../index.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🛡️  FivoSense - Neuro-symbolic AI Security Scanner

Usage:
  npx fivosense <file>
  npx fivosense audit <file>

Example:
  npx fivosense src/server.js
  `);
  process.exit(0);
}

const command = args[0];
const filepath = args[1] || args[0];

async function main() {
  try {
    console.log(`\n🔍 Auditing ${filepath}...\n`);
    
    const result = await auditFile(filepath);
    const output = formatAuditResult(result);
    
    console.log(output);
    
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
