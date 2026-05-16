import { callLLM } from './llm'

export async function generateLayout(prompt: string) {
  const content = await callLLM([
    {
      role: 'system',
      content: `You are a website layout generator. 
      Return ONLY a JSON array of components like:
      [{"type":"navbar","props":{"logo":"Brand","links":["Home","About"]}},
      {"type":"hero","props":{"title":"Welcome","subtitle":"We build things"}}]
      Available types: navbar, hero, about, features, pricing, testimonials, contact, footer`
    }, 
    {
      role: 'user',
      content: prompt
    }
  ])
  
  return JSON.parse(content)
}
