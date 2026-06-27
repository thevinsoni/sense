/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Catalog of untrusted input sources (taint origins)
 * These represent user-controlled data that could be malicious
 * 75+ patterns across 8 categories
 */

export interface SourcePattern {
  pattern: string;
  category: 'http' | 'file' | 'env' | 'cli' | 'external' | 'browser' | 'websocket' | 'process';
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

// ============================================================
// HTTP/API sources — user input from web requests
// ============================================================
export const HTTP_SOURCES: SourcePattern[] = [
  { pattern: 'req.query', category: 'http', description: 'URL query parameters', severity: 'critical' },
  { pattern: 'req.params', category: 'http', description: 'Route parameters', severity: 'critical' },
  { pattern: 'req.body', category: 'http', description: 'Request body', severity: 'critical' },
  { pattern: 'req.headers', category: 'http', description: 'HTTP headers', severity: 'high' },
  { pattern: 'req.cookies', category: 'http', description: 'Cookies', severity: 'high' },
  { pattern: 'req.files', category: 'http', description: 'Uploaded files', severity: 'critical' },
  { pattern: 'req.file', category: 'http', description: 'Single uploaded file', severity: 'critical' },
  { pattern: 'req.ip', category: 'http', description: 'Client IP address', severity: 'medium' },
  { pattern: 'req.hostname', category: 'http', description: 'Request hostname', severity: 'medium' },
  { pattern: 'req.path', category: 'http', description: 'Request path', severity: 'high' },
  { pattern: 'req.url', category: 'http', description: 'Full request URL', severity: 'high' },
  { pattern: 'req.originalUrl', category: 'http', description: 'Original request URL', severity: 'high' },
  { pattern: 'req.get(', category: 'http', description: 'Get specific header', severity: 'high' },
  { pattern: 'req.header(', category: 'http', description: 'Get header value', severity: 'high' },
  { pattern: 'request.query', category: 'http', description: 'Query string', severity: 'critical' },
  { pattern: 'request.body', category: 'http', description: 'Request body', severity: 'critical' },
  { pattern: 'request.headers', category: 'http', description: 'Request headers', severity: 'high' },
  { pattern: 'request.params', category: 'http', description: 'Request params', severity: 'critical' },
  { pattern: 'ctx.request.body', category: 'http', description: 'Koa context body', severity: 'critical' },
  { pattern: 'ctx.query', category: 'http', description: 'Koa query', severity: 'critical' },
  { pattern: 'ctx.params', category: 'http', description: 'Koa params', severity: 'critical' },
  { pattern: 'ctx.headers', category: 'http', description: 'Koa headers', severity: 'high' },
  { pattern: 'event.body', category: 'http', description: 'Lambda event body', severity: 'critical' },
  { pattern: 'event.queryStringParameters', category: 'http', description: 'Lambda query params', severity: 'critical' },
  { pattern: 'event.pathParameters', category: 'http', description: 'Lambda path params', severity: 'critical' },
  { pattern: 'event.headers', category: 'http', description: 'Lambda headers', severity: 'high' },
];

// ============================================================
// File system sources — external file content
// ============================================================
export const FILE_SOURCES: SourcePattern[] = [
  { pattern: 'fs.readFileSync', category: 'file', description: 'Sync file read', severity: 'high' },
  { pattern: 'fs.readFile', category: 'file', description: 'Async file read', severity: 'high' },
  { pattern: 'readFileSync', category: 'file', description: 'Read file sync', severity: 'high' },
  { pattern: 'fs.createReadStream', category: 'file', description: 'Create read stream', severity: 'high' },
  { pattern: 'fs.promises.readFile', category: 'file', description: 'Promise file read', severity: 'high' },
  { pattern: 'fs.watch', category: 'file', description: 'File watch events', severity: 'medium' },
  { pattern: 'fs.watchFile', category: 'file', description: 'File watch', severity: 'medium' },
];

// ============================================================
// Environment/config sources
// ============================================================
export const ENV_SOURCES: SourcePattern[] = [
  { pattern: 'process.env', category: 'env', description: 'Environment variables', severity: 'medium' },
  { pattern: 'process.argv', category: 'cli', description: 'Command-line arguments', severity: 'high' },
  { pattern: 'process.stdin', category: 'process', description: 'Standard input', severity: 'high' },
  { pattern: 'process.cwd', category: 'process', description: 'Current working directory', severity: 'medium' },
  { pattern: 'process.platform', category: 'process', description: 'OS platform', severity: 'medium' },
  { pattern: 'process.arch', category: 'process', description: 'CPU architecture', severity: 'medium' },
  { pattern: 'process.env.PATH', category: 'env', description: 'PATH environment variable', severity: 'high' },
  { pattern: 'process.env.HOME', category: 'env', description: 'Home directory', severity: 'medium' },
  { pattern: 'process.env.USER', category: 'env', description: 'Current user', severity: 'medium' },
];

// ============================================================
// Browser sources — client-side user input
// ============================================================
export const BROWSER_SOURCES: SourcePattern[] = [
  { pattern: 'document.location', category: 'browser', description: 'Document location', severity: 'high' },
  { pattern: 'window.location', category: 'browser', description: 'Window location', severity: 'high' },
  { pattern: 'location.hash', category: 'browser', description: 'URL hash fragment', severity: 'high' },
  { pattern: 'location.search', category: 'browser', description: 'URL query string', severity: 'high' },
  { pattern: 'location.href', category: 'browser', description: 'Full URL', severity: 'high' },
  { pattern: 'document.referrer', category: 'browser', description: 'Referrer URL', severity: 'high' },
  { pattern: 'document.cookie', category: 'browser', description: 'Browser cookies', severity: 'high' },
  { pattern: 'document.URL', category: 'browser', description: 'Document URL', severity: 'high' },
  { pattern: 'localStorage.getItem', category: 'browser', description: 'LocalStorage data', severity: 'medium' },
  { pattern: 'sessionStorage.getItem', category: 'browser', description: 'SessionStorage data', severity: 'medium' },
  { pattern: 'window.name', category: 'browser', description: 'Window name', severity: 'medium' },
  { pattern: 'postMessage', category: 'browser', description: 'Cross-origin message', severity: 'high' },
  { pattern: 'addEventListener("message"', category: 'browser', description: 'Message event listener', severity: 'high' },
  { pattern: "addEventListener('message'", category: 'browser', description: 'Message event listener', severity: 'high' },
  { pattern: 'event.data', category: 'browser', description: 'Event data', severity: 'high' },
  { pattern: 'e.data', category: 'browser', description: 'Event data shorthand', severity: 'high' },
  { pattern: 'this.value', category: 'browser', description: 'Input element value', severity: 'high' },
  { pattern: 'target.value', category: 'browser', description: 'Event target value', severity: 'high' },
  { pattern: 'input.value', category: 'browser', description: 'Input field value', severity: 'high' },
  { pattern: 'textarea.value', category: 'browser', description: 'Textarea value', severity: 'high' },
];

// ============================================================
// WebSocket sources
// ============================================================
export const WEBSOCKET_SOURCES: SourcePattern[] = [
  { pattern: 'ws.on("message"', category: 'websocket', description: 'WebSocket message', severity: 'critical' },
  { pattern: "ws.on('message'", category: 'websocket', description: 'WebSocket message', severity: 'critical' },
  { pattern: 'socket.on("data"', category: 'websocket', description: 'Socket data', severity: 'critical' },
  { pattern: "socket.on('data'", category: 'websocket', description: 'Socket data', severity: 'critical' },
  { pattern: 'socket.on("message"', category: 'websocket', description: 'Socket message', severity: 'critical' },
  { pattern: "socket.on('message'", category: 'websocket', description: 'Socket message', severity: 'critical' },
  { pattern: 'wss.on("connection"', category: 'websocket', description: 'WebSocket connection', severity: 'high' },
];

// ============================================================
// External data sources
// ============================================================
export const EXTERNAL_SOURCES: SourcePattern[] = [
  { pattern: 'JSON.parse', category: 'external', description: 'JSON parse (external data)', severity: 'medium' },
  { pattern: 'URLSearchParams', category: 'external', description: 'URL search params', severity: 'high' },
  { pattern: 'FormData', category: 'external', description: 'Form data', severity: 'high' },
  { pattern: 'XMLHttpRequest', category: 'external', description: 'XHR response', severity: 'high' },
  { pattern: 'response.json()', category: 'external', description: 'Fetch JSON response', severity: 'high' },
  { pattern: 'response.text()', category: 'external', description: 'Fetch text response', severity: 'high' },
  { pattern: 'axios.interceptors', category: 'external', description: 'Axios interceptors', severity: 'medium' },
];

// ============================================================
// All sources combined
// ============================================================
export const ALL_SOURCES: SourcePattern[] = [
  ...HTTP_SOURCES,
  ...FILE_SOURCES,
  ...ENV_SOURCES,
  ...BROWSER_SOURCES,
  ...WEBSOCKET_SOURCES,
  ...EXTERNAL_SOURCES,
];

export function isSource(code: string): SourcePattern | null {
  for (const source of ALL_SOURCES) {
    if (code.includes(source.pattern)) {
      return source;
    }
  }
  return null;
}

export function getSourcesByCategory(category: SourcePattern['category']): SourcePattern[] {
  return ALL_SOURCES.filter(s => s.category === category);
}
