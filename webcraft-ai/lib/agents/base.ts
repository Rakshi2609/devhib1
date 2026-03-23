import { AgentResponse } from '../types/agents'

export class BaseAgent {
  protected model: string = 'meta-llama/Llama-3.3-70B-Instruct'
  protected apiKey: string = process.env.FEATHERLESS_API_KEY || ''

  constructor(model?: string) {
    if (model) this.model = model
  }

  protected async ask(systemPrompt: string, userPrompt: string, json: boolean = true): Promise<AgentResponse> {
    try {
      const res = await fetch('https://api.featherless.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: json ? { type: 'json_object' } : undefined,
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!res.ok) {
        throw new Error(`Featherless API error: ${res.statusText}`)
      }

      const data = await res.json()
      const content = data.choices[0].message.content
      
      // Handle potential prefix/suffix text if not forced JSON by API
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
