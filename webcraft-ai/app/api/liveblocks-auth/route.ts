import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EditorRoom from '@/models/EditorRoom'
import { getLoggedInUsername } from '@/lib/auth'

// The package has dual ESM/CJS exports; require keeps this route compatible with the current TS config.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Liveblocks } = require('@liveblocks/node')

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
})

export async function POST(req: NextRequest) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const roomId = typeof body?.room === 'string' ? body.room : ''

  if (!roomId) {
    return NextResponse.json({ error: 'Room is required' }, { status: 400 })
  }

  try {
    await dbConnect()
    const room = await EditorRoom.findOne({ roomId } as any)

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    let accessType: 'read' | 'write' = 'read'

    if (room.ownerUsername === username) {
      accessType = 'write'
    } else {
      const collaborator = room.collaborators.find((c: any) => c.username === username)
      if (collaborator?.role === 'edit') {
        accessType = 'write'
      } else if (collaborator?.role === 'view') {
        accessType = 'read'
      } else {
        return NextResponse.json({ error: 'No access to this room' }, { status: 403 })
      }
    }

    const session = liveblocks.prepareSession(username, {
      userInfo: { name: username },
    })
    if (accessType === 'write') {
      session.allow(roomId, session.FULL_ACCESS)
    } else {
      session.allow(roomId, session.READ_ACCESS)
    }

    const { body: authBody, status } = await session.authorize()
    return new Response(authBody, { status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
