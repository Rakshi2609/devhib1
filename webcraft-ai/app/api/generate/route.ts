// app/api/generate/route.ts
import { MonitorAgent } from '@/lib/agents/monitor'
import { getLoggedInUsername } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const username = getLoggedInUsername() || "anonymous"
    
    const monitor = new MonitorAgent()
    const result = await monitor.run(prompt, username)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ 
      components: result.components,
      thoughts: result.thoughts,
      logs: result.logs
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
