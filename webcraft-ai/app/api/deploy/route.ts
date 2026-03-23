import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Site from '@/models/Site'
import { deployToVercel } from '@/lib/vercel'

export async function POST(req: NextRequest) {
  try {
    const { projectName, subdomain } = await req.json()

    if (!subdomain) {
      return NextResponse.json({ error: 'subdomain is required' }, { status: 400 })
    }

    // Optionally: register in DB as well
    if (subdomain) {
      await dbConnect()
      const exists = await Site.findOne({ subdomain } as any)
      if (!exists) {
        await Site.create({
          subdomain,
          title: projectName || subdomain,
          description: 'Deployed via WebCraft AI',
          ownerUsername: 'system',
          content: { hero: { heading: `Welcome to ${subdomain}`, subheading: 'Built with WebCraft AI' } },
        })
      }
    }

    const url = await deployToVercel(projectName || 'webcraft-ai', subdomain)
    return NextResponse.json({ url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
