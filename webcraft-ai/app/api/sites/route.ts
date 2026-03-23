import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Site from '@/models/Site'

// GET /api/sites — list all sites
export async function GET() {
  try {
    await dbConnect()
    const sites = await Site.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ sites })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/sites — create a new site
export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()
    const { subdomain, title, description, content } = body

    if (!subdomain || !title) {
      return NextResponse.json({ error: 'subdomain and title are required' }, { status: 400 })
    }

    // Check uniqueness
    const existing = await Site.findOne({ subdomain: subdomain.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'This subdomain is already taken' }, { status: 409 })
    }

    const site = await Site.create({ subdomain: subdomain.toLowerCase(), title, description, content })
    return NextResponse.json({ site }, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Subdomain already taken' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
