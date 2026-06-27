/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Destructive command detection — blocks dangerous operations
 * 35+ patterns covering filesystem, database, system, network, and privilege escalation
 */

export interface DestructivePattern {
  pattern: RegExp;
  description: string;
  severity: 'critical' | 'high';
  category: 'filesystem' | 'database' | 'system' | 'network' | 'container' | 'privilege';
}

// === Filesystem Destructive ===
export const FS_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /rm\s+-rf\s+[\/~]/,
    description: 'Recursive force delete from root',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /rm\s+-rf\s+\*/,
    description: 'Recursive force delete with wildcard',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /rm\s+-rf\s+["']?\//,
    description: 'Recursive force delete from absolute path',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /unlink\s*\(\s*['"]\/['"]\s*\)/,
    description: 'Unlink root directory',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /fs\.rmdir\s*\(\s*['"]\/['"]/,
    description: 'Remove root directory',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /shred\s+/,
    description: 'Secure file deletion (shred)',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /mkfs\./,
    description: 'Format filesystem',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /dd\s+if=.*of=\/dev\//,
    description: 'dd write to device',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: />\s*\/dev\/sd[a-z]/,
    description: 'Write directly to disk device',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /wipefs\s+/,
    description: 'Wipe filesystem signatures',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /truncate\s+-s\s+0/,
    description: 'Truncate file to zero bytes',
    severity: 'high',
    category: 'filesystem',
  },
  {
    pattern: /del\s+\/[sfq]/i,
    description: 'Windows force delete',
    severity: 'critical',
    category: 'filesystem',
  },
  {
    pattern: /rmdir\s+\/s\s+\/q/i,
    description: 'Windows recursive directory delete',
    severity: 'critical',
    category: 'filesystem',
  },
];

// === Database Destructive ===
export const DB_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /DROP\s+TABLE/i,
    description: 'SQL DROP TABLE',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /DROP\s+DATABASE/i,
    description: 'SQL DROP DATABASE',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /DROP\s+SCHEMA/i,
    description: 'SQL DROP SCHEMA',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /TRUNCATE\s+TABLE/i,
    description: 'SQL TRUNCATE TABLE',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /DELETE\s+FROM\s+\w+\s*;/i,
    description: 'SQL DELETE without WHERE clause',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /UPDATE\s+\w+\s+SET.*WHERE\s+1\s*=\s*1/i,
    description: 'SQL UPDATE all rows',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /db\.dropDatabase/,
    description: 'MongoDB drop database',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /db\.collection\(\w+\)\.drop\(\)/,
    description: 'MongoDB collection drop',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /FLUSH\s+(PRIVILEGES|TABLES|LOGS)/i,
    description: 'MySQL FLUSH command',
    severity: 'high',
    category: 'database',
  },
  {
    pattern: /ALTER\s+TABLE.*DROP\s+COLUMN/i,
    description: 'SQL DROP COLUMN',
    severity: 'high',
    category: 'database',
  },
  {
    pattern: /db\.users\.remove/,
    description: 'MongoDB mass remove',
    severity: 'critical',
    category: 'database',
  },
  {
    pattern: /\.remove\(\{\}\)/,
    description: 'MongoDB remove all documents',
    severity: 'critical',
    category: 'database',
  },
];

// === System Destructive ===
export const SYSTEM_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /shutdown\s+(-[hprs])?\s*(now|\+[0-9])/i,
    description: 'System shutdown command',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /reboot\s*(-[f])?/i,
    description: 'System reboot',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /halt\s*(-[f])?/i,
    description: 'System halt',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /poweroff/i,
    description: 'System power off',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /kill\s+-9\s+1\b/,
    description: 'Kill init process (PID 1)',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /killall\s+-9/,
    description: 'Force kill all processes',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /:(){ :\|:& };:/,
    description: 'Fork bomb',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /init\s+0/,
    description: 'Init shutdown',
    severity: 'critical',
    category: 'system',
  },
  {
    pattern: /systemctl\s+(stop|disable)\s+/,
    description: 'Stop/disable systemd service',
    severity: 'high',
    category: 'system',
  },
  {
    pattern: /service\s+\w+\s+stop/,
    description: 'Stop system service',
    severity: 'high',
    category: 'system',
  },
];

// === Network Destructive ===
export const NETWORK_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /iptables\s+-F/,
    description: 'Flush all firewall rules',
    severity: 'critical',
    category: 'network',
  },
  {
    pattern: /iptables\s+--flush/,
    description: 'Flush firewall rules',
    severity: 'critical',
    category: 'network',
  },
  {
    pattern: /ufw\s+disable/,
    description: 'Disable UFW firewall',
    severity: 'critical',
    category: 'network',
  },
  {
    pattern: /netsh\s+firewall\s+set\s+opmode\s+disable/i,
    description: 'Windows disable firewall',
    severity: 'critical',
    category: 'network',
  },
  {
    pattern: /ip\s+link\s+set\s+\w+\s+down/,
    description: 'Disable network interface',
    severity: 'high',
    category: 'network',
  },
  {
    pattern: /ifconfig\s+\w+\s+down/,
    description: 'Disable network interface (ifconfig)',
    severity: 'high',
    category: 'network',
  },
  {
    pattern: /route\s+(del|flush)/,
    description: 'Delete/flush routing table',
    severity: 'high',
    category: 'network',
  },
  {
    pattern: /curl\s+.*\|\s*(bash|sh)/,
    description: 'Remote code execution via curl pipe',
    severity: 'critical',
    category: 'network',
  },
  {
    pattern: /wget\s+.*\|\s*(bash|sh)/,
    description: 'Remote code execution via wget pipe',
    severity: 'critical',
    category: 'network',
  },
];

// === Container / Cloud Destructive ===
export const CONTAINER_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /docker\s+rm\s+-f\s+\$\(docker\s+ps/,
    description: 'Force remove all Docker containers',
    severity: 'critical',
    category: 'container',
  },
  {
    pattern: /docker\s+rmi\s+-f\s+\$\(docker\s+images/,
    description: 'Force remove all Docker images',
    severity: 'critical',
    category: 'container',
  },
  {
    pattern: /docker\s+system\s+prune\s+-a/,
    description: 'Prune all Docker data',
    severity: 'high',
    category: 'container',
  },
  {
    pattern: /kubectl\s+delete\s+(pods|deployment|namespace)\s+--all/,
    description: 'Delete all Kubernetes resources',
    severity: 'critical',
    category: 'container',
  },
  {
    pattern: /kubectl\s+delete\s+namespace/,
    description: 'Delete Kubernetes namespace',
    severity: 'critical',
    category: 'container',
  },
];

// === Privilege Escalation ===
export const PRIVILEGE_DESTRUCTIVE: DestructivePattern[] = [
  {
    pattern: /chmod\s+777\s+[\/~]/,
    description: 'Set full permissions (chmod 777)',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /chmod\s+-R\s+777/,
    description: 'Recursive full permissions',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /chown\s+-R\s+root/,
    description: 'Recursive ownership to root',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /chmod\s+\+s/,
    description: 'Set SUID/SGID bit',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /chmod\s+u\+s/,
    description: 'Set SUID bit',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /visudo/,
    description: 'Edit sudoers file',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /echo\s+.*>>\s*\/etc\/sudoers/,
    description: 'Append to sudoers file',
    severity: 'critical',
    category: 'privilege',
  },
  {
    pattern: /usermod\s+-aG\s+sudo/,
    description: 'Add user to sudo group',
    severity: 'high',
    category: 'privilege',
  },
  {
    pattern: /passwd\s+(root|-e)/,
    description: 'Change root password or expire',
    severity: 'critical',
    category: 'privilege',
  },
];

// === All destructive patterns combined ===
export const ALL_DESTRUCTIVE: DestructivePattern[] = [
  ...FS_DESTRUCTIVE,
  ...DB_DESTRUCTIVE,
  ...SYSTEM_DESTRUCTIVE,
  ...NETWORK_DESTRUCTIVE,
  ...CONTAINER_DESTRUCTIVE,
  ...PRIVILEGE_DESTRUCTIVE,
];

export function detectDestructive(code: string): DestructivePattern[] {
  const matches: DestructivePattern[] = [];
  
  for (const pattern of ALL_DESTRUCTIVE) {
    if (pattern.pattern.test(code)) {
      matches.push(pattern);
    }
  }
  
  return matches;
}

export function isDestructiveLine(line: string): DestructivePattern | null {
  for (const pattern of ALL_DESTRUCTIVE) {
    if (pattern.pattern.test(line)) {
      return pattern;
    }
  }
  return null;
}
