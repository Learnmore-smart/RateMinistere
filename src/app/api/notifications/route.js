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

    const userId = session.user.id;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalNotifications = await Notification.countDocuments({ userId });
        const totalPages = Math.ceil(totalNotifications / limit);

        return NextResponse.json({ notifications, totalPages }, { status: 200 });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Could not get notifications',
        }, { status: 500 });
    }
}
