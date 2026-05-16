import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EditorRoom from '@/models/EditorRoom'
import { getLoggedInUsername } from '@/lib/auth'
import crypto from 'crypto'

function randomToken() {
  return crypto.randomBytes(16).toString('hex')
}

export async function GET(_req: NextRequest, { params }: { params: { roomId: string } }) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const roomId = params.roomId

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
      return NextResponse.json({ role: 'owner' })
    }

    if (room.ownerUsername === username) {
      return NextResponse.json({ role: 'owner' })
    }

    const collaborator = room.collaborators.find((c: any) => c.username === username)
    if (collaborator) {
      return NextResponse.json({ role: collaborator.role })
    }

    return NextResponse.json({ role: 'none' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
