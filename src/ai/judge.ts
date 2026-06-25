/**
 * AI Path Judge - Uses host AI to determine exploitability
 */

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
 * Placeholder for host AI integration
 * In Phase 2, this will call the actual host AI (Claude/etc.)
 */
export async function judgePathWithAI(context: PathContext): Promise<PathJudgment> {
  const prompt = buildPathJudgePrompt(context);
  
  // TODO: Phase 2 - integrate with host AI
  // For now, return a conservative judgment
  console.warn('⚠️  AI path judgment not yet integrated - using conservative defaults');
  
  return {
    exploitable: true, // Conservative: assume exploitable until AI confirms otherwise
    confidence: 0.7,
    reasoning: 'AI judgment not yet integrated - marked as potentially exploitable',
    severity: 'high',
    recommendation: 'Manual review required until AI integration complete',
  };
}
