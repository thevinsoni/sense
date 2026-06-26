/**
 * Adversarial Verification - AI attacker proves exploitability
 */

import { TaintTrace } from './taint.js';
import { callAI, getAIProviderFromEnv, type AIProvider } from '../ai/client.js';

export interface AdversarialResult {
  exploitable: boolean;
  confidence: number;
  attackVector: string;
  payload: string;
  reasoning: string;
}

/**
 * Generate adversarial attack prompt
 */
export function buildAdversarialPrompt(trace: TaintTrace, code: string): string {
  return `You are a security researcher testing for vulnerabilities.

**Vulnerability:** ${trace.finding}
**Category:** ${trace.category}
**CWE:** ${trace.cwe || 'N/A'}

**Data Flow:**
${trace.path}

**Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Task:**
Try to exploit this vulnerability. If you can create a working exploit, respond with:

\`\`\`json
{
  "exploitable": true,
  "confidence": 0.0-1.0,
  "attackVector": "description of attack",
  "payload": "actual exploit payload",
  "reasoning": "why this works"
}
\`\`\`

If you CANNOT exploit it (properly sanitized), respond with:

\`\`\`json
{
  "exploitable": false,
  "confidence": 0.0-1.0,
  "attackVector": "none",
  "payload": "",
  "reasoning": "why exploitation failed"
}
\`\`\``;
}

/**
 * Parse adversarial response
 */
export function parseAdversarialResult(response: string): AdversarialResult | null {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      exploitable: Boolean(parsed.exploitable),
      confidence: Number(parsed.confidence) || 0.5,
      attackVector: String(parsed.attackVector || ''),
      payload: String(parsed.payload || ''),
      reasoning: String(parsed.reasoning || ''),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify exploitability using adversarial AI
 */
export async function verifyWithAdversary(
  trace: TaintTrace,
  code: string,
  provider?: AIProvider
): Promise<AdversarialResult> {
  // Get provider from env if not provided
  const aiProvider = provider || getAIProviderFromEnv();
  
  // If no AI provider available, return conservative result
  if (!aiProvider) {
    console.warn('⚠️  No AI provider configured for adversarial verification');
    console.warn('💡 Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or OLLAMA_HOST to enable');
    
    return {
      exploitable: true,
      confidence: 0.7,
      attackVector: 'Adversarial verification not configured',
      payload: '',
      reasoning: 'Marked as potentially exploitable - configure AI provider to verify',
    };
  }
  
  try {
    const prompt = buildAdversarialPrompt(trace, code);
    const response = await callAI(aiProvider, prompt);
    
    const result = parseAdversarialResult(response.text);
    
    if (!result) {
      console.warn('⚠️  Failed to parse adversarial response');
      return {
        exploitable: true,
        confidence: 0.6,
        attackVector: 'Failed to parse AI response',
        payload: '',
        reasoning: 'Parser error - marked as potentially exploitable',
      };
    }
    
    return result;
  } catch (error) {
    console.warn(`⚠️  Adversarial verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      exploitable: true,
      confidence: 0.7,
      attackVector: `AI verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      payload: '',
      reasoning: 'Marked as potentially exploitable due to verification error',
    };
  }
}
