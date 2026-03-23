import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EditorRoom from '@/models/EditorRoom'
import { getLoggedInUsername } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const username = getLoggedInUsername()
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const roomId = typeof body?.roomId === 'string' ? body.roomId : ''
  const token = typeof body?.token === 'string' ? body.token : ''

  if (!roomId || !token) {
    return NextResponse.json({ error: 'roomId and token are required' }, { status: 400 })
  }

  try {
    await dbConnect()
    const room = await EditorRoom.findOne({ roomId } as any)

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.ownerUsername === username) {
      return NextResponse.json({ role: 'owner' })
    }

    const role = room.shareTokens.edit === token ? 'edit' : room.shareTokens.view === token ? 'view' : null
    if (!role) {
      return NextResponse.json({ error: 'Invalid share token' }, { status: 403 })
    }

    const existingIndex = room.collaborators.findIndex((c: any) => c.username === username)
    if (existingIndex === -1) {
      room.collaborators.push({ username, role })
    } else if (room.collaborators[existingIndex].role !== 'edit' && role === 'edit') {
      room.collaborators[existingIndex].role = 'edit'
    }

    await room.save()
    return NextResponse.json({ role })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
