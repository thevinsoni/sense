/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * Secret detection — finds hardcoded API keys, tokens, passwords
 * 55+ patterns covering AI, cloud, SaaS, payments, databases, and dev tools
 */

export interface SecretPattern {
  pattern: RegExp;
  type: string;
  description: string;
  severity: 'high' | 'medium';
}

export const SECRET_PATTERNS: SecretPattern[] = [
  // === AI / ML ===
  {
    pattern: /['"]sk-proj-[A-Za-z0-9_-]{20,}['"]/,
    type: 'openai_project_key',
    description: 'OpenAI Project API key',
    severity: 'high',
  },
  {
    pattern: /['"]sk-[A-Za-z0-9]{20,}['"]/,
    type: 'openai_key',
    description: 'OpenAI API key',
    severity: 'high',
  },
  {
    pattern: /['"]sk-ant-[A-Za-z0-9_-]{20,}['"]/,
    type: 'anthropic_key',
    description: 'Anthropic Claude API key',
    severity: 'high',
  },
  {
    pattern: /['"]AIza[A-Za-z0-9_-]{35}['"]/,
    type: 'google_api_key',
    description: 'Google API key',
    severity: 'high',
  },
  {
    pattern: /['"]ya29\.[A-Za-z0-9_-]+['"]/,
    type: 'google_oauth_token',
    description: 'Google OAuth access token',
    severity: 'high',
  },
  {
    pattern: /['"][0-9]+-[A-Za-z0-9_]{32}\.apps\.googleusercontent\.com['"]/,
    type: 'google_oauth_client_id',
    description: 'Google OAuth client ID',
    severity: 'high',
  },

  // === Cloud Providers ===
  {
    pattern: /['"]AKIA[A-Z0-9]{16}['"]/,
    type: 'aws_access_key',
    description: 'AWS Access Key ID',
    severity: 'high',
  },
  {
    pattern: /['"]ASIA[A-Z0-9]{16}['"]/,
    type: 'aws_temp_key',
    description: 'AWS Temporary Access Key',
    severity: 'high',
  },
  {
    pattern: /aws[_-]?secret[_-]?access[_-]?key\s*[:=]\s*['"][A-Za-z0-9/+=]{40}['"]/i,
    type: 'aws_secret_key',
    description: 'AWS Secret Access Key',
    severity: 'high',
  },
  {
    pattern: /['"]arn:aws:[a-z0-9-]+:[a-z0-9-]*:[0-9]+:/,
    type: 'aws_arn',
    description: 'AWS ARN (resource identifier)',
    severity: 'medium',
  },
  {
    pattern: /AccountKey\s*=\s*[A-Za-z0-9+/=]{80,}/i,
    type: 'azure_storage_key',
    description: 'Azure Storage Account Key',
    severity: 'high',
  },
  {
    pattern: /['"][a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}['"]/,
    type: 'azure_tenant_or_client',
    description: 'Azure Tenant/Client UUID',
    severity: 'medium',
  },
  {
    pattern: /['"](?:AAAA)[A-Za-z0-9+/=]{40,}['"]/,
    type: 'firebase_token',
    description: 'Firebase authentication token',
    severity: 'high',
  },
  {
    pattern: /['"]SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}['"]/,
    type: 'sendgrid_key',
    description: 'SendGrid API key',
    severity: 'high',
  },
  {
    pattern: /['"]service_account['"]\s*[:=]/i,
    type: 'gcp_service_account',
    description: 'GCP service account',
    severity: 'high',
  },
  {
    pattern: /['"]type['"]\s*[:=]\s*['"]service_account['"]/i,
    type: 'gcp_sa_json',
    description: 'GCP service account JSON',
    severity: 'high',
  },

  // === GitHub / Git ===
  {
    pattern: /['"]ghp_[A-Za-z0-9]{36}['"]/,
    type: 'github_pat',
    description: 'GitHub Personal Access Token (classic)',
    severity: 'high',
  },
  {
    pattern: /['"]github_pat_[A-Za-z0-9_]{22,}['"]/,
    type: 'github_fine_grained_pat',
    description: 'GitHub Fine-Grained PAT',
    severity: 'high',
  },
  {
    pattern: /['"]gho_[A-Za-z0-9]{36}['"]/,
    type: 'github_oauth',
    description: 'GitHub OAuth token',
    severity: 'high',
  },
  {
    pattern: /['"]ghs_[A-Za-z0-9]{36}['"]/,
    type: 'github_app_token',
    description: 'GitHub App installation token',
    severity: 'high',
  },
  {
    pattern: /['"]ghr_[A-Za-z0-9]{36}['"]/,
    type: 'github_refresh',
    description: 'GitHub refresh token',
    severity: 'high',
  },
  {
    pattern: /['"]glpat-[A-Za-z0-9_-]{20,}['"]/,
    type: 'gitlab_pat',
    description: 'GitLab Personal Access Token',
    severity: 'high',
  },

  // === Communication ===
  {
    pattern: /['"]xox[baprs]-[A-Za-z0-9-]{10,}['"]/,
    type: 'slack_token',
    description: 'Slack Token',
    severity: 'high',
  },
  {
    pattern: /['"]https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+['"]/,
    type: 'slack_webhook',
    description: 'Slack Webhook URL',
    severity: 'high',
  },
  {
    pattern: /['"][0-9]+:AA[A-Za-z0-9_-]{30,}['"]/,
    type: 'telegram_bot_token',
    description: 'Telegram Bot Token',
    severity: 'high',
  },
  {
    pattern: /['"]discord(app)?\.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+['"]/,
    type: 'discord_webhook',
    description: 'Discord Webhook URL',
    severity: 'high',
  },

  // === Payment ===
  {
    pattern: /['"]sk_live_[A-Za-z0-9]{20,}['"]/,
    type: 'stripe_secret_live',
    description: 'Stripe Secret Key (LIVE)',
    severity: 'high',
  },
  {
    pattern: /['"]sk_test_[A-Za-z0-9]{20,}['"]/,
    type: 'stripe_secret_test',
    description: 'Stripe Secret Key (test)',
    severity: 'high',
  },
  {
    pattern: /['"]rk_live_[A-Za-z0-9]{20,}['"]/,
    type: 'stripe_restricted_live',
    description: 'Stripe Restricted Key (LIVE)',
    severity: 'high',
  },
  {
    pattern: /['"]rk_test_[A-Za-z0-9]{20,}['"]/,
    type: 'stripe_restricted_test',
    description: 'Stripe Restricted Key (test)',
    severity: 'high',
  },
  {
    pattern: /['"]sq0csp-[A-Za-z0-9_-]{22,}['"]/,
    type: 'square_key',
    description: 'Square OAuth secret',
    severity: 'high',
  },

  // === SaaS / Dev Tools ===
  {
    pattern: /['"]npm_[A-Za-z0-9]{36}['"]/,
    type: 'npm_token',
    description: 'npm access token',
    severity: 'high',
  },
  {
    pattern: /['"]pypi-[A-Za-z0-9_-]{50,}['"]/,
    type: 'pypi_token',
    description: 'PyPI API token',
    severity: 'high',
  },
  {
    pattern: /['"]do_[a-zA-Z0-9]{64}['"]/,
    type: 'digitalocean_token',
    description: 'DigitalOcean API token',
    severity: 'high',
  },
  {
    pattern: /['"]dop_v1_[a-f0-9]{64}['"]/,
    type: 'doppler_token',
    description: 'Doppler service token',
    severity: 'high',
  },
  {
    pattern: /['"]NRAK-[A-Z0-9]{27}['"]/,
    type: 'newrelic_key',
    description: 'New Relic API key',
    severity: 'high',
  },
  {
    pattern: /['"]shpat_[a-fA-F0-9]{32}['"]/,
    type: 'shopify_key',
    description: 'Shopify Private App Access Token',
    severity: 'high',
  },
  {
    pattern: /['"]shpss_[a-fA-F0-9]{32}['"]/,
    type: 'shopify_secret',
    description: 'Shopify Shared Secret',
    severity: 'high',
  },
  {
    pattern: /['"]Bearer\s+[A-Za-z0-9_-]{20,}['"]/,
    type: 'bearer_token',
    description: 'Bearer authentication token',
    severity: 'high',
  },
  {
    pattern: /['"]Basic\s+[A-Za-z0-9+/=]{20,}['"]/,
    type: 'basic_auth',
    description: 'Basic authentication header',
    severity: 'high',
  },

  // === Database Connection Strings ===
  {
    pattern: /['"]mongodb(\+srv)?:\/\/[^'"]+['"]/,
    type: 'mongodb_uri',
    description: 'MongoDB connection string',
    severity: 'high',
  },
  {
    pattern: /['"]postgres(ql)?:\/\/[^'"]+['"]/,
    type: 'postgres_uri',
    description: 'PostgreSQL connection string',
    severity: 'high',
  },
  {
    pattern: /['"]mysql:\/\/[^'"]+['"]/,
    type: 'mysql_uri',
    description: 'MySQL connection string',
    severity: 'high',
  },
  {
    pattern: /['"]redis:\/\/[^'"]+['"]/,
    type: 'redis_uri',
    description: 'Redis connection string',
    severity: 'high',
  },
  {
    pattern: /['"]amqps?:\/\/[^'"]+['"]/,
    type: 'amqp_uri',
    description: 'AMQP connection string',
    severity: 'high',
  },
  {
    pattern: /['"]jdbc:[^'"]+['"]/,
    type: 'jdbc_uri',
    description: 'JDBC connection string',
    severity: 'high',
  },

  // === Generic Hardcoded Credentials ===
  {
    pattern: /password\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'password',
    description: 'Hardcoded password',
    severity: 'high',
  },
  {
    pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'api_key',
    description: 'Hardcoded API key',
    severity: 'high',
  },
  {
    pattern: /secret\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'secret',
    description: 'Hardcoded secret',
    severity: 'high',
  },
  {
    pattern: /token\s*[:=]\s*['"][^'"]{20,}['"]/i,
    type: 'token',
    description: 'Hardcoded token',
    severity: 'high',
  },
  {
    pattern: /private[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'private_key',
    description: 'Hardcoded private key',
    severity: 'high',
  },
  {
    pattern: /access[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'access_key',
    description: 'Hardcoded access key',
    severity: 'high',
  },
  {
    pattern: /auth[_-]?token\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'auth_token',
    description: 'Hardcoded auth token',
    severity: 'high',
  },
  {
    pattern: /client[_-]?secret\s*[:=]\s*['"][^'"]+['"]/i,
    type: 'client_secret',
    description: 'Hardcoded client secret',
    severity: 'high',
  },
  {
    pattern: /['"][A-Za-z0-9_]{32,}['"]/,
    type: 'generic_token',
    description: 'Generic high-entropy token (32+ chars)',
    severity: 'medium',
  },
];

export interface SecretMatch {
  type: string;
  description: string;
  severity: 'high' | 'medium';
  line: number;
  match: string;
}

export function detectSecrets(code: string): SecretMatch[] {
  const lines = code.split('\n');
  const matches: SecretMatch[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return;
    }

    for (const pattern of SECRET_PATTERNS) {
      const match = line.match(pattern.pattern);
      if (match) {
        matches.push({
          type: pattern.type,
          description: pattern.description,
          severity: pattern.severity,
          line: index + 1,
          match: match[0].substring(0, 20) + '...',
        });
      }
    }
  });

  return matches;
}

export function isSecretLine(line: string): SecretPattern | null {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.pattern.test(line)) {
      return pattern;
    }
  }
  return null;
}
