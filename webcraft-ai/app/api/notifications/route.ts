import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { getLoggedInUsername } from '@/lib/auth'

export async function GET() {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const inbox = await Notification.find({ toUsername: username } as any)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ notifications: inbox })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const toUsername = typeof body?.toUsername === 'string' ? body.toUsername.trim().toLowerCase() : ''
  const roomId = typeof body?.roomId === 'string' ? body.roomId : ''
  const link = typeof body?.link === 'string' ? body.link : ''
  const message = typeof body?.message === 'string' ? body.message : ''

  if (!toUsername || !roomId || !link || !message) {
    return NextResponse.json({ error: 'toUsername, roomId, link, and message are required' }, { status: 400 })
  }

  try {
    await dbConnect()
    const notification = await Notification.create({
      toUsername,
      fromUsername: username,
      roomId,
      link,
      message,
      read: false,
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
