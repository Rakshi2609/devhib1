import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Site from '@/models/Site'
import { getLoggedInUsername } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const site = await Site.findOne({ _id: params.id, ownerUsername: username } as any).lean()
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }
    return NextResponse.json({ site })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const body = await req.json()
    const { title, description, content } = body

    const site = await Site.findOne({ _id: params.id, ownerUsername: username } as any)

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    if (typeof title === 'string') site.title = title
    if (typeof description === 'string') site.description = description
    if (content) site.content = content

    await site.save()

    return NextResponse.json({ site: site.toObject() })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
