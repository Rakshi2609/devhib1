import { AgentResponse } from '../types/agents'
import { callLLM } from '../llm'

export class BaseAgent {
  protected model: string = 'meta-llama/Llama-3.3-70B-Instruct'
  protected apiKey: string = process.env.FEATHERLESS_API_KEY || ''

  constructor(model?: string) {
    if (model) this.model = model
  }

  protected async ask(systemPrompt: string, userPrompt: string, json: boolean = true): Promise<AgentResponse> {
    try {
      const content = await callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], { model: this.model, max_tokens: 2000 })

      let parsed = content
      if (json) {
        try {
          parsed = JSON.parse(content)
        } catch (e) {
          console.error("Failed to parse JSON response:", content)
        }
      }

      return {
        success: true,
        content: parsed,
        thoughts: "Agent processed request successfully."
      }
    } catch (error: any) {
      return {
        success: false,
        content: null,
        thoughts: "Error occurred during generation.",
        error: error.message
      }
    }
  }
}
