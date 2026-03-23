export async function generateLayout(prompt: string) {
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
        content: `You are a website layout generator. 
        Return ONLY a JSON array of components like:
        [{"type":"navbar","props":{"logo":"Brand","links":["Home","About"]}},
        {"type":"hero","props":{"title":"Welcome","subtitle":"We build things"}}]
        Available types: navbar, hero, about, features, pricing, testimonials, contact, footer`
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 1000
    })
  })
  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}
