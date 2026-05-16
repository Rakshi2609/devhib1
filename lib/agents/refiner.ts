import { BaseAgent } from './base'
import { AgentResponse, GeneratorOutput, EvaluationResult } from '../types/agents'

export class RefinerAgent extends BaseAgent {
  async refine(
    original: GeneratorOutput, 
    prompt: string, 
    evaluation: EvaluationResult
  ): Promise<AgentResponse<GeneratorOutput>> {
    const systemPrompt = `You are an Expert UI Refiner. 
    You have a DRAFT website layout and CRITICAL FEEDBACK from an Evaluator.
    Your job is to RE-GENERATE the layout, incorporating the feedback to make it truly PREMIUM.

    CRITIQUES TO FIX:
    ${evaluation.critique}
    
    SUGGESTED FIXES:
    ${evaluation.fixSuggestions?.join('\n')}

    OUTPUT FORMAT:
    Return a JSON object with a "components" array (same structure as original).
    `

    const userPrompt = `
    ORIGINAL PROMPT: ${prompt}
    DRAFT LAYOUT: ${JSON.stringify(original)}
    
    Refine this layout to be 10/10 quality based on the above feedback.`

    const result = await this.ask(systemPrompt, userPrompt, true)
    
    const finalContent = result.content?.components ? result.content : { components: result.content }

    return {
      ...result,
      content: finalContent as GeneratorOutput
    }
  }
}
