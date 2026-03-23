import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Site from '@/models/Site'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const subdomain = req.nextUrl.searchParams.get('subdomain')

    if (subdomain) {
      const site = await Site.findOne({ subdomain: subdomain.toLowerCase() } as any).lean()
      if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 })
      }
      return NextResponse.json({ site })
    }

    const sites = await Site.find({} as any)
      .sort({ createdAt: -1 })
      .select('subdomain title description ownerUsername content updatedAt')
      .limit(50)
      .lean()

    return NextResponse.json({ sites })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
