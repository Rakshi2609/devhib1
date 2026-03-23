import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import EditorRoom from '@/models/EditorRoom'
import { getLoggedInUsername } from '@/lib/auth'

function randomToken() {
  return crypto.randomBytes(16).toString('hex')
}

export async function POST(req: NextRequest) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const roomId = typeof body?.roomId === 'string' ? body.roomId : ''
  const access = body?.access === 'view' ? 'view' : 'edit'

  if (!roomId) {
    return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
  }

  try {
    await dbConnect()

    let room = await EditorRoom.findOne({ roomId } as any)
    if (!room) {
      room = await EditorRoom.create({
        roomId,
        ownerUsername: username,
        collaborators: [],
        shareTokens: {
          edit: randomToken(),
          view: randomToken(),
        },
      })
    }

    if (room.ownerUsername !== username) {
      return NextResponse.json({ error: 'Only owner can create share links' }, { status: 403 })
    }

    const token = room.shareTokens[access]
    const link = `${req.nextUrl.origin}/editor/${roomId}?mode=${access}&token=${token}`

    return NextResponse.json({ access, link })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
