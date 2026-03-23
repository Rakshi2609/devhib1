import { BaseAgent } from './base'
import { AgentResponse, EvaluationResult } from '../types/agents'

export class EvaluatorAgent extends BaseAgent {
  async evaluate(generatedLayout: any, prompt: string): Promise<AgentResponse<EvaluationResult>> {
    const systemPrompt = `You are an Expert Visual Critic and Senior Code Reviewer.
    Your task is to EVALUATE a generated website layout JSON against the user's prompt.

    CRITERIA:
    1. Premium Look: Does it use sophisticated copy? Are the sections logical? (1-10)
    2. Prompt Match: Did it fulfill the user's request? (1-10)
    3. Technical Correctness: Is the JSON structure valid for the components? (1-10)

    OUTPUT FORMAT:
    Return a JSON object:
    {
      "score": number, 
      "critique": "overall feedback",
      "isPremium": boolean,
      "fixSuggestions": ["suggestion 1", "suggestion 2"]
    }
    `

    const userPrompt = `
    USER PROMPT: ${prompt}
    GENERATED LAYOUT: ${JSON.stringify(generatedLayout)}
    
    Evaluate this layout and provide a score / critique.`

    const result = await this.ask(systemPrompt, userPrompt, true)
    return {
      ...result,
      content: result.content as EvaluationResult
    }
  }
}
