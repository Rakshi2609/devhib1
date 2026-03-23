import { BaseAgent } from './base'
import { AgentResponse, GeneratorOutput } from '../types/agents'

export class GeneratorAgent extends BaseAgent {
  async generate(prompt: string, context?: string): Promise<AgentResponse<GeneratorOutput>> {
    const systemPrompt = `You are a Senior UI/UX Engineer and AI Website Generator. 
    Your goal is to generate HIGHLY PREMIUM, modern, and aesthetic website layouts.
    
    NAVY BLUE PREMIUM STYLE GUIDELINES:
    - Use shades of deep navy (#020617, #0f172a).
    - Use accents of electric blue, cyan, or soft purple.
    - Designs should feel "glassmorphic" (blur, transparency, thin borders).
    - Typography should be clean and bold (Inter/Geist).

    AVAILABLE COMPONENTS:
    - navbar: { logo: string, links: [{label, href}], cta: string, ctaHref: string }
    - hero: { title: string, subtitle: string, cta: string, ctaHref: string, cta2?: string, cta2Href?: string, bg?: string }
    - about: { heading: string, body: string, image?: string }
    - features: { heading: string, subheading: string, featureList: [{icon, title, desc}], learnMoreHref?: string }
    - pricing: { heading: string, plans: [{name, price, features: string[], popular?: boolean, cta, href}] }
    - testimonials: { heading: string, reviews: [{quote, name, role}] }
    - contact: { heading: string, subtitle: string, submitTxt: string }
    - footer: { brand: string, copy: string, footerLinks: [{label, href}] }

    OUTPUT FORMAT:
    You MUST return a JSON object with a "components" array.
    {
      "components": [ ... ],
      "metadata": { "theme": "navy-premium", "accentColor": "#3b82f6" }
    }

    ${context ? `CONTEXT FROM PREVIOUS SESSIONS: ${context}` : ''}
    `

    const userPrompt = `Create a premium landing page layout for: ${prompt}. 
    Ensure the copy is professional and specific to the niche. Do NOT use generic placeholder text.`

    const result = await this.ask(systemPrompt, userPrompt, true)
    
    // Sometimes models wrap the result in a top-level key or just return the object
    const finalContent = result.content?.components ? result.content : { components: result.content }
    
    return {
      ...result,
      content: finalContent as GeneratorOutput
    }
  }
}
