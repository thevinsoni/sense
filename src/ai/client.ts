/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * AI Client - BYOK (Bring Your Own Key) support for multiple AI providers
 */

export interface AIProvider {
  name: string;
  endpoint?: string;
  apiKey?: string;
  model?: string;
}

export interface AIResponse {
  text: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Call OpenAI-compatible API
 */
async function callOpenAI(
  provider: AIProvider,
  prompt: string
): Promise<AIResponse> {
  const endpoint = provider.endpoint || 'https://api.openai.com/v1/chat/completions';
  const model = provider.model || 'gpt-4o-mini';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a security expert analyzing code vulnerabilities. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();
  
  return {
    text: data.choices[0].message.content,
    model: data.model,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    },
  };
}

/**
 * Call Anthropic Claude API
 */
async function callClaude(
  provider: AIProvider,
  prompt: string
): Promise<AIResponse> {
  const endpoint = provider.endpoint || 'https://api.anthropic.com/v1/messages';
  const model = provider.model || 'claude-3-5-sonnet-20241022';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature: 0.3,
      system: 'You are a security expert analyzing code vulnerabilities. Respond only with valid JSON.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();
  
  return {
    text: data.content[0].text,
    model: data.model,
    usage: {
      promptTokens: data.usage.input_tokens,
      completionTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens,
    },
  };
}

/**
 * Call Ollama (local)
 */
async function callOllama(
  provider: AIProvider,
  prompt: string
): Promise<AIResponse> {
  const endpoint = provider.endpoint || 'http://localhost:11434/api/generate';
  const model = provider.model || 'llama3.2';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt: `You are a security expert. ${prompt}`,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 500,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();
  
  return {
    text: data.response,
    model: data.model,
  };
}

/**
 * Main AI client - routes to correct provider
 */
export async function callAI(
  provider: AIProvider,
  prompt: string
): Promise<AIResponse> {
  if (!provider.apiKey && provider.name !== 'ollama') {
    throw new Error(`API key required for provider: ${provider.name}`);
  }

  switch (provider.name.toLowerCase()) {
    case 'openai':
      return callOpenAI(provider, prompt);
    
    case 'claude':
    case 'anthropic':
      return callClaude(provider, prompt);
    
    case 'ollama':
      return callOllama(provider, prompt);
    
    default:
      throw new Error(`Unsupported AI provider: ${provider.name}`);
  }
}

/**
 * Get AI provider from environment variables
 */
export function getAIProviderFromEnv(): AIProvider | null {
  // Check for OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      endpoint: process.env.OPENAI_ENDPOINT,
    };
  }
  
  // Check for Claude
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      name: 'claude',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      endpoint: process.env.ANTHROPIC_ENDPOINT,
    };
  }
  
  // Check for Ollama
  if (process.env.OLLAMA_ENDPOINT || process.env.OLLAMA_HOST) {
    return {
      name: 'ollama',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      endpoint: process.env.OLLAMA_ENDPOINT || process.env.OLLAMA_HOST || 'http://localhost:11434/api/generate',
    };
  }
  
  return null;
}
