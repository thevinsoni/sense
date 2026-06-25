/**
 * Agent PreToolUse Hook - Blocks dangerous AI actions in real-time
 */

import { detectDestructive } from '../rules/destructive.js';
import { detectSecrets } from '../rules/secrets.js';

export interface BlockResult {
  blocked: boolean;
  reason: string;
  severity: 'critical' | 'high' | 'medium';
  suggestion?: string;
}

/**
 * Check if proposed action should be blocked
 */
export function checkAction(action: string, code?: string): BlockResult {
  // Check for destructive commands
  const destructive = detectDestructive(action);
  if (destructive.length > 0) {
    return {
      blocked: true,
      reason: `Destructive command detected: ${destructive[0].description}`,
      severity: destructive[0].severity,
      suggestion: 'Review the command carefully before executing',
    };
  }
  
  // Check for hardcoded secrets in code
  if (code) {
    const secrets = detectSecrets(code);
    if (secrets.length > 0) {
      return {
        blocked: true,
        reason: `Hardcoded secret detected: ${secrets[0].description}`,
        severity: 'high',
        suggestion: 'Use environment variables instead',
      };
    }
  }
  
  return {
    blocked: false,
    reason: '',
    severity: 'medium',
  };
}

/**
 * PreToolUse hook for AI agents
 * Returns exit code 2 if action should be blocked
 */
export function preToolUseHook(toolName: string, args: any): number {
  // Check file write operations
  if (toolName === 'write_file' || toolName === 'edit_file') {
    const content = args.content || args.new_content || '';
    const result = checkAction('', content);
    
    if (result.blocked) {
      console.error(`\n❌ BLOCKED: ${result.reason}`);
      if (result.suggestion) {
        console.error(`💡 Suggestion: ${result.suggestion}`);
      }
      return 2; // Exit code 2 signals block
    }
  }
  
  // Check shell commands
  if (toolName === 'bash' || toolName === 'execute') {
    const command = args.command || args.cmd || '';
    const result = checkAction(command);
    
    if (result.blocked) {
      console.error(`\n❌ BLOCKED: ${result.reason}`);
      if (result.suggestion) {
        console.error(`💡 Suggestion: ${result.suggestion}`);
      }
      return 2;
    }
  }
  
  return 0; // Allow
}
