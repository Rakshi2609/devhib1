// webcraft-ai/lib/llm.ts

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: any; // Can be string or array of parts
}

export async function callLLM(messages: LLMMessage[], options: { model?: string, max_tokens?: number } = {}) {
  // 1. Try Featherless AI
  if (process.env.FEATHERLESS_API_KEY) {
    try {
      const res = await fetch('https://api.featherless.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || 'mistralai/Mistral-7B-Instruct-v0.3',
          messages,
          max_tokens: options.max_tokens || 1000
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.warn('Featherless AI failed, falling back to Gemini...', e);
    }
  }

  // 2. Try Gemini Fallback
  if (process.env.GEMINI_API_KEY) {
    try {
      // Convert OpenAI messages to Gemini format
      const geminiMessages = messages.map(m => {
        let parts = [];
        if (typeof m.content === 'string') {
          parts.push({ text: m.content });
        } else if (Array.isArray(m.content)) {
          parts = m.content.map(p => {
            if (p.type === 'text') return { text: p.text };
            if (p.type === 'image_url') {
              const base64 = p.image_url.url.split(',')[1];
              return { inline_data: { mime_type: 'image/jpeg', data: base64 } };
            }
            return { text: '' };
          });
        }
        return { role: m.role === 'assistant' ? 'model' : 'user', parts };
      });

      // Gemini doesn't support 'system' role in the same way in v1beta, 
      // but we can prepend it to the first user message or use systemInstruction.
      const systemMessage = messages.find(m => m.role === 'system');
      const contents = geminiMessages.filter(m => m.role !== 'system');
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
          generationConfig: {
            maxOutputTokens: options.max_tokens || 1000,
            responseMimeType: 'application/json'
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn('Gemini failed, falling back to Ollama...', e);
    }
  }

  // 3. Try Ollama Fallback
  const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
  try {
    const res = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        messages: messages.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : m.content.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n'),
          images: Array.isArray(m.content) ? m.content.filter((p: any) => p.type === 'image_url').map((p: any) => p.image_url.url.split(',')[1]) : undefined
        })),
        stream: false,
        options: { num_predict: options.max_tokens || 1000 }
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.message.content;
    }
  } catch (e) {
    console.error('All LLM providers failed.', e);
  }

  throw new Error('No LLM provider available or all failed.');
}
