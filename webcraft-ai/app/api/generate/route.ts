// app/api/generate/route.ts
import { generateLayout } from '@/lib/featherless'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const components = await generateLayout(prompt)
  return Response.json({ components })
}
