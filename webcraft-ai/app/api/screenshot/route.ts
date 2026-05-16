import { callLLM } from '@/lib/llm'

export async function POST(req: Request) {
  const { imageBase64 } = await req.json()
  
  const content = await callLLM([
    {
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
    }
  ], { model: 'meta-llama/Llama-3.2-11B-Vision-Instruct' })
  
  return Response.json({ 
    components: JSON.parse(content) 
  })
}
