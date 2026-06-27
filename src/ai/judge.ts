/**
 * FivoSense - AI Security Scanner
 * Copyright (c) 2026 thevinsoni
 * Licensed under the MIT License
 * https://github.com/thevinsoni/sense
 */

/**
 * AI Path Judge - Uses host AI to determine exploitability
 */

import { callAI, getAIProviderFromEnv, type AIProvider } from './client.js';

export interface PathJudgment {
  exploitable: boolean;
  confidence: number;
  reasoning: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface PathContext {
  source: string;
  sourceType: string;
  sourceLoc: string;
  sink: string;
  sinkType: string;
  category: string;
  cwe?: string;
  dataFlow: string;
  codeSnippet: string;
  language: string;
}

/**
 * Build prompt for AI path judgment
 */
export function buildPathJudgePrompt(context: PathContext): string {
  return `Analyze this security path:

**Source:** ${context.source}
- Type: ${context.sourceType}
- Location: ${context.sourceLoc}

**Sink:** ${context.sink}
- Type: ${context.sinkType}
- Category: ${context.category}
${context.cwe ? `- CWE: ${context.cwe}` : ''}

**Data Flow:**
${context.dataFlow}

**Code Context:**
\`\`\`${context.language}
${context.codeSnippet}
\`\`\`

Is this path exploitable? Respond with JSON:
{
  "exploitable": true/false,
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "severity": "critical/high/medium/low",
  "recommendation": "specific fix"
}`;
}

/**
 * Parse AI response into PathJudgment
 */
export function parsePathJudgment(response: string): PathJudgment | null {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      exploitable: Boolean(parsed.exploitable),
      confidence: Number(parsed.confidence) || 0.5,
      reasoning: String(parsed.reasoning || 'No reasoning provided'),
      severity: parsed.severity || 'medium',
      recommendation: String(parsed.recommendation || 'Review manually'),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Judge path exploitability using AI
 */
export async function judgePathWithAI(
  context: PathContext,
  provider?: AIProvider
): Promise<PathJudgment> {
  // Get provider from env if not provided
  const aiProvider = provider || getAIProviderFromEnv();
  
  // If no AI provider available, return conservative judgment
  if (!aiProvider) {
    console.warn('⚠️  No AI provider configured - using conservative defaults');
    console.warn('💡 Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or OLLAMA_HOST to enable AI judgment');
    
    return {
      exploitable: true, // Conservative: assume exploitable
      confidence: 0.7,
      reasoning: 'AI judgment not configured - marked as potentially exploitable',
      severity: 'high',
      recommendation: 'Configure AI provider or review manually',
    };
  }
  
  try {
    const prompt = buildPathJudgePrompt(context);
    const response = await callAI(aiProvider, prompt);
    
    const judgment = parsePathJudgment(response.text);
    
    if (!judgment) {
      console.warn('⚠️  Failed to parse AI response - using conservative defaults');
      return {
        exploitable: true,
        confidence: 0.6,
        reasoning: 'Failed to parse AI response',
        severity: 'high',
        recommendation: 'Review manually',
      };
    }
    
    return judgment;
  } catch (error) {
    console.warn(`⚠️  AI judgment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      exploitable: true,
      confidence: 0.7,
      reasoning: `AI judgment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'high',
      recommendation: 'Review manually',
    };
  }
}
