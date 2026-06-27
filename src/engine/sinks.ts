/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Catalog of dangerous sinks (vulnerability endpoints)
 * 150+ patterns across 14 categories
 */

export interface SinkPattern {
  pattern: string;
  category: 'sql' | 'nosql' | 'command' | 'code' | 'xss' | 'path' | 'xxe' | 'ssrf' | 'deserialization' | 'ldap' | 'ssti' | 'header_injection' | 'open_redirect' | 'auth_bypass' | 'jwt' | 'graphql' | 'prototype_pollution' | 'regex_dos' | 'crypto' | 'upload';
  description: string;
  severity: 'critical' | 'high' | 'medium';
  cwe?: string;
}

// ============================================================
// SQL Injection — CWE-89
// ============================================================
export const SQL_SINKS: SinkPattern[] = [
  { pattern: 'db.execute', category: 'sql', description: 'SQL execution', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.query', category: 'sql', description: 'SQL query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'connection.query', category: 'sql', description: 'MySQL query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'connection.execute', category: 'sql', description: 'MySQL prepared exec', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'pool.query', category: 'sql', description: 'Connection pool query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'pool.execute', category: 'sql', description: 'Pool prepared exec', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'client.query', category: 'sql', description: 'PostgreSQL client query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'executeQuery', category: 'sql', description: 'Generic SQL exec', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'knex.raw', category: 'sql', description: 'Knex raw SQL', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'knex.select().whereRaw', category: 'sql', description: 'Knex raw WHERE', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'sequelize.query', category: 'sql', description: 'Sequelize raw query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'TypeORM.query', category: 'sql', description: 'TypeORM raw query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'prisma.$queryRaw', category: 'sql', description: 'Prisma raw query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'prisma.$executeRaw', category: 'sql', description: 'Prisma raw execute', severity: 'critical', cwe: 'CWE-89' },
  { pattern: '$queryRaw', category: 'sql', description: 'Prisma raw query shorthand', severity: 'critical', cwe: 'CWE-89' },
  { pattern: '$executeRaw', category: 'sql', description: 'Prisma raw execute shorthand', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'orm.query', category: 'sql', description: 'ORM raw query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.all', category: 'sql', description: 'SQLite all rows', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.get', category: 'sql', description: 'SQLite single row', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.run', category: 'sql', description: 'SQLite run statement', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.each', category: 'sql', description: 'SQLite iterate', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'db.prepare', category: 'sql', description: 'SQLite prepared statement', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'mssql.query', category: 'sql', description: 'MSSQL query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'oracledb.execute', category: 'sql', description: 'Oracle DB execute', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'pg.query', category: 'sql', description: 'pg (node-postgres) query', severity: 'critical', cwe: 'CWE-89' },
  { pattern: 'mysql.query', category: 'sql', description: 'mysql module query', severity: 'critical', cwe: 'CWE-89' },
];

// ============================================================
// NoSQL Injection — CWE-943
// ============================================================
export const NOSQL_SINKS: SinkPattern[] = [
  { pattern: 'find', category: 'nosql', description: 'MongoDB find', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'findOne', category: 'nosql', description: 'MongoDB findOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'findOneAndUpdate', category: 'nosql', description: 'MongoDB findOneAndUpdate', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'findOneAndDelete', category: 'nosql', description: 'MongoDB findOneAndDelete', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'findOneAndReplace', category: 'nosql', description: 'MongoDB findOneAndReplace', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'updateOne', category: 'nosql', description: 'MongoDB updateOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'updateMany', category: 'nosql', description: 'MongoDB updateMany', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'deleteOne', category: 'nosql', description: 'MongoDB deleteOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'deleteMany', category: 'nosql', description: 'MongoDB deleteMany', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'aggregate', category: 'nosql', description: 'MongoDB aggregate', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'insertOne', category: 'nosql', description: 'MongoDB insertOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'insertMany', category: 'nosql', description: 'MongoDB insertMany', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'replaceOne', category: 'nosql', description: 'MongoDB replaceOne', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'bulkWrite', category: 'nosql', description: 'MongoDB bulkWrite', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'redis.set', category: 'nosql', description: 'Redis SET', severity: 'medium', cwe: 'CWE-943' },
  { pattern: 'redis.get', category: 'nosql', description: 'Redis GET', severity: 'medium', cwe: 'CWE-943' },
  { pattern: 'redis.eval', category: 'nosql', description: 'Redis Lua eval', severity: 'high', cwe: 'CWE-943' },
  { pattern: 'redis.hset', category: 'nosql', description: 'Redis hash set', severity: 'medium', cwe: 'CWE-943' },
];

// ============================================================
// Command Injection — CWE-78
// ============================================================
export const COMMAND_SINKS: SinkPattern[] = [
  { pattern: 'exec', category: 'command', description: 'Shell command execution', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execSync', category: 'command', description: 'Sync shell command', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'spawn', category: 'command', description: 'Process spawn', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'spawnSync', category: 'command', description: 'Sync process spawn', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execFile', category: 'command', description: 'File execution', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execFileSync', category: 'command', description: 'Sync file execution', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'fork', category: 'command', description: 'Child process fork', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'execa', category: 'command', description: 'Execa process execution', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'shelljs.exec', category: 'command', description: 'ShellJS exec', severity: 'critical', cwe: 'CWE-78' },
  { pattern: 'child_process', category: 'command', description: 'Child process module', severity: 'high', cwe: 'CWE-78' },
  { pattern: 'open(', category: 'command', description: 'Open URL/file handler', severity: 'high', cwe: 'CWE-78' },
];

// ============================================================
// Code Injection — CWE-94
// ============================================================
export const CODE_SINKS: SinkPattern[] = [
  { pattern: 'eval', category: 'code', description: 'JavaScript eval()', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'Function', category: 'code', description: 'Dynamic function creation', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'setTimeout', category: 'code', description: 'setTimeout with string', severity: 'high', cwe: 'CWE-94' },
  { pattern: 'setInterval', category: 'code', description: 'setInterval with string', severity: 'high', cwe: 'CWE-94' },
  { pattern: 'setImmediate', category: 'code', description: 'setImmediate with string', severity: 'high', cwe: 'CWE-94' },
  { pattern: 'new Function', category: 'code', description: 'Function constructor', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'vm.runInContext', category: 'code', description: 'VM context execution', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'vm.runInNewContext', category: 'code', description: 'VM new context execution', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'vm.compileFunction', category: 'code', description: 'VM compile function', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'vm.Script', category: 'code', description: 'VM script creation', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'vm.runInThisContext', category: 'code', description: 'VM run in this context', severity: 'critical', cwe: 'CWE-94' },
  { pattern: 'import(', category: 'code', description: 'Dynamic import', severity: 'high', cwe: 'CWE-94' },
];

// ============================================================
// XSS — CWE-79
// ============================================================
export const XSS_SINKS: SinkPattern[] = [
  { pattern: 'res.send', category: 'xss', description: 'HTTP response send', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'res.write', category: 'xss', description: 'HTTP response write', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'res.json', category: 'xss', description: 'HTTP JSON response', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'res.render', category: 'xss', description: 'Template render', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'res.redirect', category: 'xss', description: 'HTTP redirect', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'response.write', category: 'xss', description: 'Raw response write', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'response.end', category: 'xss', description: 'Response end with body', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'innerHTML', category: 'xss', description: 'DOM innerHTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'outerHTML', category: 'xss', description: 'DOM outerHTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'document.write', category: 'xss', description: 'Document write', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'document.writeln', category: 'xss', description: 'Document writeln', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'insertAdjacentHTML', category: 'xss', description: 'Insert adjacent HTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'dangerouslySetInnerHTML', category: 'xss', description: 'React dangerouslySetInnerHTML', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'v-html', category: 'xss', description: 'Vue.js v-html directive', severity: 'critical', cwe: 'CWE-79' },
  { pattern: '[innerHTML]', category: 'xss', description: 'Angular innerHTML binding', severity: 'critical', cwe: 'CWE-79' },
  { pattern: 'jQuery.html', category: 'xss', description: 'jQuery .html()', severity: 'critical', cwe: 'CWE-79' },
  { pattern: '.html(', category: 'xss', description: 'jQuery/html setter', severity: 'critical', cwe: 'CWE-79' },
  { pattern: '.append(', category: 'xss', description: 'DOM append with HTML', severity: 'high', cwe: 'CWE-79' },
  { pattern: '.prepend(', category: 'xss', description: 'DOM prepend with HTML', severity: 'high', cwe: 'CWE-79' },
  { pattern: '.after(', category: 'xss', description: 'DOM after with HTML', severity: 'high', cwe: 'CWE-79' },
  { pattern: '.before(', category: 'xss', description: 'DOM before with HTML', severity: 'high', cwe: 'CWE-79' },
  { pattern: 'replace(', category: 'xss', description: 'String replace (potential XSS)', severity: 'medium', cwe: 'CWE-79' },
  { pattern: 'srcdoc', category: 'xss', description: 'Iframe srcdoc attribute', severity: 'high', cwe: 'CWE-79' },
];

// ============================================================
// Path Traversal — CWE-22
// ============================================================
export const PATH_SINKS: SinkPattern[] = [
  { pattern: 'fs.readFile', category: 'path', description: 'Async file read', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.readFileSync', category: 'path', description: 'Sync file read', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.writeFile', category: 'path', description: 'Async file write', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.writeFileSync', category: 'path', description: 'Sync file write', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.unlink', category: 'path', description: 'File delete', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.unlinkSync', category: 'path', description: 'Sync file delete', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.appendFile', category: 'path', description: 'Append to file', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.mkdir', category: 'path', description: 'Create directory', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.readdir', category: 'path', description: 'Read directory', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.stat', category: 'path', description: 'File stat', severity: 'medium', cwe: 'CWE-22' },
  { pattern: 'fs.access', category: 'path', description: 'File access check', severity: 'medium', cwe: 'CWE-22' },
  { pattern: 'fs.chmod', category: 'path', description: 'Change permissions', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.chown', category: 'path', description: 'Change ownership', severity: 'critical', cwe: 'CWE-22' },
  { pattern: 'fs.rename', category: 'path', description: 'Rename file', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.copyFile', category: 'path', description: 'Copy file', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'fs.symlink', category: 'path', description: 'Create symlink', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'path.join', category: 'path', description: 'Path join (potential traversal)', severity: 'medium', cwe: 'CWE-22' },
  { pattern: 'path.resolve', category: 'path', description: 'Path resolve (potential traversal)', severity: 'medium', cwe: 'CWE-22' },
  { pattern: 'express.static', category: 'path', description: 'Static file serving', severity: 'medium', cwe: 'CWE-22' },
  { pattern: 'sendFile', category: 'path', description: 'Express sendFile', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'createReadStream', category: 'path', description: 'Create read stream', severity: 'high', cwe: 'CWE-22' },
  { pattern: 'createWriteStream', category: 'path', description: 'Create write stream', severity: 'high', cwe: 'CWE-22' },
];

// ============================================================
// XXE — CWE-611
// ============================================================
export const XXE_SINKS: SinkPattern[] = [
  { pattern: 'libxmljs.parseXml', category: 'xxe', description: 'libxmljs XML parse', severity: 'critical', cwe: 'CWE-611' },
  { pattern: 'xml2js.parseString', category: 'xxe', description: 'xml2js parse', severity: 'high', cwe: 'CWE-611' },
  { pattern: 'xml2js.parseStringPromise', category: 'xxe', description: 'xml2js async parse', severity: 'high', cwe: 'CWE-611' },
  { pattern: 'DOMParser', category: 'xxe', description: 'DOM XML parser', severity: 'high', cwe: 'CWE-611' },
  { pattern: 'SAXParser', category: 'xxe', description: 'SAX XML parser', severity: 'high', cwe: 'CWE-611' },
  { pattern: 'XMLHttpRequest', category: 'xxe', description: 'XHR (potential XXE)', severity: 'medium', cwe: 'CWE-611' },
  { pattern: 'parseXml', category: 'xxe', description: 'Generic XML parse', severity: 'high', cwe: 'CWE-611' },
  { pattern: 'loadXml', category: 'xxe', description: 'Load XML document', severity: 'high', cwe: 'CWE-611' },
];

// ============================================================
// SSRF — CWE-918
// ============================================================
export const SSRF_SINKS: SinkPattern[] = [
  { pattern: 'axios.get', category: 'ssrf', description: 'Axios HTTP GET', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'axios.post', category: 'ssrf', description: 'Axios HTTP POST', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'axios.put', category: 'ssrf', description: 'Axios HTTP PUT', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'axios.delete', category: 'ssrf', description: 'Axios HTTP DELETE', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'axios.patch', category: 'ssrf', description: 'Axios HTTP PATCH', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'axios.request', category: 'ssrf', description: 'Axios generic request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'fetch(', category: 'ssrf', description: 'Fetch API', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'http.get', category: 'ssrf', description: 'Node HTTP GET', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'http.request', category: 'ssrf', description: 'Node HTTP request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'https.get', category: 'ssrf', description: 'Node HTTPS GET', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'https.request', category: 'ssrf', description: 'Node HTTPS request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'request(', category: 'ssrf', description: 'Request module', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'got(', category: 'ssrf', description: 'Got HTTP client', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'got.get', category: 'ssrf', description: 'Got GET request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'got.post', category: 'ssrf', description: 'Got POST request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'superagent.get', category: 'ssrf', description: 'SuperAgent GET', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'superagent.post', category: 'ssrf', description: 'SuperAgent POST', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'node-fetch', category: 'ssrf', description: 'node-fetch module', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'urllib.request', category: 'ssrf', description: 'urllib request', severity: 'high', cwe: 'CWE-918' },
  { pattern: 'new URL', category: 'ssrf', description: 'URL constructor (potential SSRF)', severity: 'medium', cwe: 'CWE-918' },
  { pattern: 'new Request', category: 'ssrf', description: 'Request constructor', severity: 'high', cwe: 'CWE-918' },
];

// ============================================================
// Insecure Deserialization — CWE-502
// ============================================================
export const DESERIALIZATION_SINKS: SinkPattern[] = [
  { pattern: 'JSON.parse', category: 'deserialization', description: 'JSON.parse (potential prototype pollution)', severity: 'medium', cwe: 'CWE-502' },
  { pattern: 'deserialize', category: 'deserialization', description: 'Generic deserialize', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'serialize.unserialize', category: 'deserialization', description: 'PHP-style unserialize', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'node-serialize.unserialize', category: 'deserialization', description: 'node-serialize unserialize', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'js-yaml.load', category: 'deserialization', description: 'YAML load (unsafe)', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'yaml.load', category: 'deserialization', description: 'YAML load', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'pickle.loads', category: 'deserialization', description: 'Python pickle load', severity: 'critical', cwe: 'CWE-502' },
  { pattern: 'msgpack.decode', category: 'deserialization', description: 'MessagePack decode', severity: 'high', cwe: 'CWE-502' },
  { pattern: 'bson.deserialize', category: 'deserialization', description: 'BSON deserialize', severity: 'high', cwe: 'CWE-502' },
  { pattern: 'Buffer.from', category: 'deserialization', description: 'Buffer creation from data', severity: 'medium', cwe: 'CWE-502' },
];

// ============================================================
// LDAP Injection — CWE-90
// ============================================================
export const LDAP_SINKS: SinkPattern[] = [
  { pattern: 'ldapClient.bind', category: 'ldap', description: 'LDAP bind', severity: 'critical', cwe: 'CWE-90' },
  { pattern: 'ldapClient.search', category: 'ldap', description: 'LDAP search', severity: 'critical', cwe: 'CWE-90' },
  { pattern: 'ldapClient.modify', category: 'ldap', description: 'LDAP modify', severity: 'critical', cwe: 'CWE-90' },
  { pattern: 'ldapClient.add', category: 'ldap', description: 'LDAP add entry', severity: 'critical', cwe: 'CWE-90' },
  { pattern: 'ldapClient.del', category: 'ldap', description: 'LDAP delete entry', severity: 'critical', cwe: 'CWE-90' },
  { pattern: 'ldapClient.compare', category: 'ldap', description: 'LDAP compare', severity: 'high', cwe: 'CWE-90' },
  { pattern: 'ldapjs', category: 'ldap', description: 'ldapjs module', severity: 'high', cwe: 'CWE-90' },
];

// ============================================================
// Server-Side Template Injection (SSTI) — CWE-1336
// ============================================================
export const SSTI_SINKS: SinkPattern[] = [
  { pattern: 'ejs.render', category: 'ssti', description: 'EJS template render', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'ejs.renderFile', category: 'ssti', description: 'EJS render file', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'pug.render', category: 'ssti', description: 'Pug template render', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'pug.renderFile', category: 'ssti', description: 'Pug render file', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'handlebars.compile', category: 'ssti', description: 'Handlebars compile', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'nunjucks.render', category: 'ssti', description: 'Nunjucks render', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'nunjucks.renderString', category: 'ssti', description: 'Nunjucks render string', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'mustache.render', category: 'ssti', description: 'Mustache render', severity: 'high', cwe: 'CWE-1336' },
  { pattern: 'dot.template', category: 'ssti', description: 'doT.js template', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'swig.render', category: 'ssti', description: 'Swig template render', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'liquid.parseAndRender', category: 'ssti', description: 'LiquidJS render', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'Twig.twig', category: 'ssti', description: 'Twig template', severity: 'critical', cwe: 'CWE-1336' },
  { pattern: 'marko.render', category: 'ssti', description: 'Marko template render', severity: 'high', cwe: 'CWE-1336' },
  { pattern: 'nunjucks.configure', category: 'ssti', description: 'Nunjucks configure', severity: 'high', cwe: 'CWE-1336' },
];

// ============================================================
// Header Injection — CWE-113
// ============================================================
export const HEADER_INJECTION_SINKS: SinkPattern[] = [
  { pattern: 'res.setHeader', category: 'header_injection', description: 'Set HTTP header', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'res.writeHead', category: 'header_injection', description: 'Write response head', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'response.setHeader', category: 'header_injection', description: 'Set response header', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'response.writeHead', category: 'header_injection', description: 'Write response head', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'set-cookie', category: 'header_injection', description: 'Set-Cookie header', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'res.cookie', category: 'header_injection', description: 'Express cookie set', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'Location:', category: 'header_injection', description: 'Location header', severity: 'high', cwe: 'CWE-113' },
  { pattern: 'res.location', category: 'header_injection', description: 'Express location header', severity: 'high', cwe: 'CWE-113' },
];

// ============================================================
// Open Redirect — CWE-601
// ============================================================
export const OPEN_REDIRECT_SINKS: SinkPattern[] = [
  { pattern: 'res.redirect', category: 'open_redirect', description: 'HTTP redirect', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'response.redirect', category: 'open_redirect', description: 'Response redirect', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'window.location', category: 'open_redirect', description: 'Browser redirect', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'window.location.href', category: 'open_redirect', description: 'Browser location change', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'window.location.replace', category: 'open_redirect', description: 'Browser location replace', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'window.location.assign', category: 'open_redirect', description: 'Browser location assign', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'document.location', category: 'open_redirect', description: 'Document location change', severity: 'high', cwe: 'CWE-601' },
  { pattern: 'history.pushState', category: 'open_redirect', description: 'History pushState', severity: 'medium', cwe: 'CWE-601' },
  { pattern: 'history.replaceState', category: 'open_redirect', description: 'History replaceState', severity: 'medium', cwe: 'CWE-601' },
];

// ============================================================
// Auth Bypass — CWE-287
// ============================================================
export const AUTH_BYPASS_SINKS: SinkPattern[] = [
  { pattern: 'passport.authenticate', category: 'auth_bypass', description: 'Passport auth (potential bypass)', severity: 'high', cwe: 'CWE-287' },
  { pattern: 'jwt.verify', category: 'auth_bypass', description: 'JWT verify (potential bypass)', severity: 'critical', cwe: 'CWE-287' },
  { pattern: 'jwt.decode', category: 'auth_bypass', description: 'JWT decode without verify', severity: 'critical', cwe: 'CWE-287' },
  { pattern: 'bcrypt.compare', category: 'auth_bypass', description: 'Password comparison', severity: 'high', cwe: 'CWE-287' },
  { pattern: 'crypto.timingSafeEqual', category: 'auth_bypass', description: 'Timing-safe comparison', severity: 'medium', cwe: 'CWE-287' },
  { pattern: 'session.destroy', category: 'auth_bypass', description: 'Session destroy', severity: 'medium', cwe: 'CWE-287' },
  { pattern: 'req.session', category: 'auth_bypass', description: 'Session access', severity: 'medium', cwe: 'CWE-287' },
  { pattern: 'acl', category: 'auth_bypass', description: 'Access control list', severity: 'high', cwe: 'CWE-287' },
];

// ============================================================
// JWT Vulnerabilities — CWE-345
// ============================================================
export const JWT_SINKS: SinkPattern[] = [
  { pattern: 'jwt.sign', category: 'jwt', description: 'JWT token creation', severity: 'high', cwe: 'CWE-345' },
  { pattern: 'jwt.verify', category: 'jwt', description: 'JWT token verification', severity: 'critical', cwe: 'CWE-345' },
  { pattern: 'jwt.decode', category: 'jwt', description: 'JWT decode (no verification)', severity: 'critical', cwe: 'CWE-345' },
  { pattern: 'jsonwebtoken.sign', category: 'jwt', description: 'jsonwebtoken sign', severity: 'high', cwe: 'CWE-345' },
  { pattern: 'jsonwebtoken.verify', category: 'jwt', description: 'jsonwebtoken verify', severity: 'critical', cwe: 'CWE-345' },
  { pattern: 'jsonwebtoken.decode', category: 'jwt', description: 'jsonwebtoken decode', severity: 'critical', cwe: 'CWE-345' },
  { pattern: 'jose.jwtVerify', category: 'jwt', description: 'jose JWT verify', severity: 'high', cwe: 'CWE-345' },
  { pattern: 'jose.jwtSign', category: 'jwt', description: 'jose JWT sign', severity: 'high', cwe: 'CWE-345' },
  { pattern: 'algorithm: none', category: 'jwt', description: 'JWT none algorithm', severity: 'critical', cwe: 'CWE-345' },
  { pattern: 'algorithms: [', category: 'jwt', description: 'JWT algorithm config', severity: 'medium', cwe: 'CWE-345' },
];

// ============================================================
// GraphQL — CWE-89
// ============================================================
export const GRAPHQL_SINKS: SinkPattern[] = [
  { pattern: 'graphql.execute', category: 'graphql', description: 'GraphQL execute', severity: 'high', cwe: 'CWE-89' },
  { pattern: 'graphql.validate', category: 'graphql', description: 'GraphQL validate', severity: 'medium', cwe: 'CWE-89' },
  { pattern: 'graphql.graphql', category: 'graphql', description: 'GraphQL query execution', severity: 'high', cwe: 'CWE-89' },
  { pattern: 'buildSchema', category: 'graphql', description: 'GraphQL schema build', severity: 'medium', cwe: 'CWE-89' },
  { pattern: 'makeExecutableSchema', category: 'graphql', description: 'Apollo executable schema', severity: 'medium', cwe: 'CWE-89' },
  { pattern: 'ApolloServer', category: 'graphql', description: 'Apollo Server instance', severity: 'medium', cwe: 'CWE-89' },
];

// ============================================================
// Prototype Pollution — CWE-1321
// ============================================================
export const PROTOTYPE_POLLUTION_SINKS: SinkPattern[] = [
  { pattern: '__proto__', category: 'prototype_pollution', description: 'Prototype access', severity: 'critical', cwe: 'CWE-1321' },
  { pattern: 'constructor.prototype', category: 'prototype_pollution', description: 'Constructor prototype access', severity: 'critical', cwe: 'CWE-1321' },
  { pattern: 'Object.assign', category: 'prototype_pollution', description: 'Object.assign (potential pollution)', severity: 'medium', cwe: 'CWE-1321' },
  { pattern: 'Object.merge', category: 'prototype_pollution', description: 'Object merge (potential pollution)', severity: 'high', cwe: 'CWE-1321' },
  { pattern: '_.merge', category: 'prototype_pollution', description: 'Lodash merge (potential pollution)', severity: 'high', cwe: 'CWE-1321' },
  { pattern: '_.defaultsDeep', category: 'prototype_pollution', description: 'Lodash defaultsDeep', severity: 'high', cwe: 'CWE-1321' },
  { pattern: 'deepMerge', category: 'prototype_pollution', description: 'Deep merge utility', severity: 'high', cwe: 'CWE-1321' },
  { pattern: 'extend(true', category: 'prototype_pollution', description: 'jQuery deep extend', severity: 'high', cwe: 'CWE-1321' },
];

// ============================================================
// ReDoS — CWE-1333
// ============================================================
export const REGEX_DOS_SINKS: SinkPattern[] = [
  { pattern: 'new RegExp', category: 'regex_dos', description: 'Dynamic RegExp creation', severity: 'high', cwe: 'CWE-1333' },
  { pattern: 'RegExp(', category: 'regex_dos', description: 'RegExp constructor', severity: 'high', cwe: 'CWE-1333' },
  { pattern: '.match(', category: 'regex_dos', description: 'String match with regex', severity: 'medium', cwe: 'CWE-1333' },
  { pattern: '.replace(', category: 'regex_dos', description: 'String replace with regex', severity: 'medium', cwe: 'CWE-1333' },
  { pattern: '.search(', category: 'regex_dos', description: 'String search with regex', severity: 'medium', cwe: 'CWE-1333' },
  { pattern: '.split(', category: 'regex_dos', description: 'String split with regex', severity: 'medium', cwe: 'CWE-1333' },
  { pattern: '.test(', category: 'regex_dos', description: 'Regex test', severity: 'medium', cwe: 'CWE-1333' },
];

// ============================================================
// Weak Crypto — CWE-327/328
// ============================================================
export const CRYPTO_SINKS: SinkPattern[] = [
  { pattern: 'createHash("md5")', category: 'crypto', description: 'MD5 hash (weak)', severity: 'high', cwe: 'CWE-328' },
  { pattern: "createHash('md5')", category: 'crypto', description: 'MD5 hash (weak)', severity: 'high', cwe: 'CWE-328' },
  { pattern: 'createHash("sha1")', category: 'crypto', description: 'SHA1 hash (weak)', severity: 'high', cwe: 'CWE-328' },
  { pattern: "createHash('sha1')", category: 'crypto', description: 'SHA1 hash (weak)', severity: 'high', cwe: 'CWE-328' },
  { pattern: 'Math.random', category: 'crypto', description: 'Math.random (not cryptographically secure)', severity: 'high', cwe: 'CWE-338' },
  { pattern: 'crypto.createCipher', category: 'crypto', description: 'createCipher (deprecated, no IV)', severity: 'critical', cwe: 'CWE-327' },
  { pattern: 'crypto.createDecipher', category: 'crypto', description: 'createDecipher (deprecated)', severity: 'critical', cwe: 'CWE-327' },
  { pattern: 'DES', category: 'crypto', description: 'DES encryption (weak)', severity: 'high', cwe: 'CWE-327' },
  { pattern: 'RC4', category: 'crypto', description: 'RC4 encryption (weak)', severity: 'high', cwe: 'CWE-327' },
  { pattern: 'ECB', category: 'crypto', description: 'ECB mode (weak)', severity: 'high', cwe: 'CWE-327' },
];

// ============================================================
// File Upload — CWE-434
// ============================================================
export const UPLOAD_SINKS: SinkPattern[] = [
  { pattern: 'multer', category: 'upload', description: 'Multer file upload', severity: 'high', cwe: 'CWE-434' },
  { pattern: 'formidable', category: 'upload', description: 'Formidable file upload', severity: 'high', cwe: 'CWE-434' },
  { pattern: 'busboy', category: 'upload', description: 'Busboy file upload', severity: 'high', cwe: 'CWE-434' },
  { pattern: 'express-fileupload', category: 'upload', description: 'Express file upload', severity: 'high', cwe: 'CWE-434' },
  { pattern: 'mv(', category: 'upload', description: 'Move uploaded file', severity: 'high', cwe: 'CWE-434' },
  { pattern: 'file.mv', category: 'upload', description: 'File move (upload)', severity: 'high', cwe: 'CWE-434' },
];

// ============================================================
// All sinks combined
// ============================================================
export const ALL_SINKS: SinkPattern[] = [
  ...SQL_SINKS,
  ...NOSQL_SINKS,
  ...COMMAND_SINKS,
  ...CODE_SINKS,
  ...XSS_SINKS,
  ...PATH_SINKS,
  ...XXE_SINKS,
  ...SSRF_SINKS,
  ...DESERIALIZATION_SINKS,
  ...LDAP_SINKS,
  ...SSTI_SINKS,
  ...HEADER_INJECTION_SINKS,
  ...OPEN_REDIRECT_SINKS,
  ...AUTH_BYPASS_SINKS,
  ...JWT_SINKS,
  ...GRAPHQL_SINKS,
  ...PROTOTYPE_POLLUTION_SINKS,
  ...REGEX_DOS_SINKS,
  ...CRYPTO_SINKS,
  ...UPLOAD_SINKS,
];

export function isSink(code: string): SinkPattern | null {
  for (const sink of ALL_SINKS) {
    if (code.includes(sink.pattern)) {
      return sink;
    }
  }
  return null;
}

export function getSinksByCategory(category: SinkPattern['category']): SinkPattern[] {
  return ALL_SINKS.filter(s => s.category === category);
}

export function getSinksBySeverity(severity: SinkPattern['severity']): SinkPattern[] {
  return ALL_SINKS.filter(s => s.severity === severity);
}
