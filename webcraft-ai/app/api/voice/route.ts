// app/api/voice/route.ts
export async function POST(req: Request) {
  const { command } = await req.json()
  
  const res = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{
        role: 'system',
        content: `Parse voice commands into JSON actions. 
        Return ONLY JSON like:
        {"action": "changeColor", "target": "navbar", "value": "#000000"}
        {"action": "changeFont", "target": "hero", "value": "serif"}
        {"action": "addComponent", "type": "testimonials"}
        {"action": "removeComponent", "target": "pricing"}
        {"action": "changeText", "target": "hero.title", "value": "new text"}`
      }, {
        role: 'user',
        content: command
      }],
      max_tokens: 100
    })
  })
  
  const data = await res.json()
  return Response.json(JSON.parse(data.choices[0].message.content))
}
