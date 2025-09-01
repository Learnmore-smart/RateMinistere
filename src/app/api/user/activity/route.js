import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';


export async function GET(request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  try {
    const user = await User.findOne({ email: session.user.email }).select('pointHistory');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Reverse the history array to show most recent first
    const pointHistory = user.pointHistory ? [...user.pointHistory].reverse() : [];
    return NextResponse.json({ history: pointHistory }, { status: 200 });
  } catch (error) {
    console.error('Error fetching points history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function POST(request) {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = Date.now();

    // Only update points if:
    // 1. User has been active for at least 25 minutes
    // 2. Last activity was recorded
    // 3. Enough time has passed since last points award
    if (user.lastActivity &&
        now - user.lastActivity >= 25 * 60 * 1000 &&
        (!user.lastPointsAwarded || now - user.lastPointsAwarded >= 25 * 60 * 1000)) {

      user.lastPointsAwarded = now;
      user.points += 5;
      user.pointHistory.push({
        action: 'WOW! You stayed active for 25 minutes!',
        points: 5,
        timestamp: now
      });
    }

    // Always update last activity
    user.lastActivity = now;
    await user.save();

    return NextResponse.json({
      message: 'Activity recorded',
      lastActivity: user.lastActivity,
      lastPointsAwarded: user.lastPointsAwarded
    }, { status: 200 });

  } catch (error) {
    console.error('Error recording activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
