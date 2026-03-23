// app/api/auth/login/route.ts
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const rawUsername = typeof body?.username === 'string' ? body.username : ''
  const username = rawUsername.trim().toLowerCase()

  if (!username) {
    return NextResponse.json({ success: false, error: 'username is required' }, { status: 400 })
  }

  try {
    let user = await User.findOne({ username } as any)
    if (!user) {
      user = await User.create({ username })
    }

    const response = NextResponse.json({ success: true, data: user })
    response.cookies.set('webcraft_user', username, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
