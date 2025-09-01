import dbConnect from '@/app/lib/dbConnect';
import Notification from '@/app/models/notification';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: true,
            modalMessage: 'Unauthorized'
        }, { status: 401 });
    }

    try {
        const count = await Notification.countDocuments({ userId: session.user.id, read: false });
        return NextResponse.json({ count }, { status: 200 });
    } catch (error) {
        console.error('Error getting unread count:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Could not get unread count',
            errorDetails: error.message,
        }, { status: 500 });
    }
}
