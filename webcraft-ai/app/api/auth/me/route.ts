import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const username = cookieStore.get('webcraft_user')?.value

  if (!username) {
    return NextResponse.json({ success: false, error: 'Not logged in' }, { status: 401 })
  }

  try {
    await dbConnect()
    const user = await User.findOne({ username } as any).lean()

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
