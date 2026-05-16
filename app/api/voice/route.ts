import { callLLM } from '@/lib/llm'

export async function POST(req: Request) {
  const { command } = await req.json()
  
  const content = await callLLM([
    {
      role: 'system',
      content: `Parse voice commands into JSON actions. 
      Return ONLY JSON like:
      {"action": "changeColor", "target": "navbar", "value": "#000000"}
      {"action": "changeFont", "target": "hero", "value": "serif"}
      {"action": "addComponent", "type": "testimonials"}
      {"action": "removeComponent", "target": "pricing"}
      {"action": "changeText", "target": "hero.title", "value": "new text"}`
    }, 
    {
      role: 'user',
      content: command
    }
  ], { max_tokens: 100 })
  
  return Response.json(JSON.parse(content))
}
