// app/api/screenshot/route.ts
export async function POST(req: Request) {
  const { imageBase64 } = await req.json()
  
  const res = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
          },
          {
            type: 'text',
            text: `Analyze this website screenshot and return ONLY a JSON array of components:
            [{"type":"navbar","props":{...}}, {"type":"hero","props":{...}}]`
          }
        ]
      }],
      max_tokens: 1000
    })
  })
  
  const data = await res.json()
  return Response.json({ 
    components: JSON.parse(data.choices[0].message.content) 
  })
}
