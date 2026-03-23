// app/api/auth/login/route.ts
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();
  const { username } = await req.json();

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }
    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
