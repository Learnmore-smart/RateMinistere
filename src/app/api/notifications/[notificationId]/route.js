import dbConnect from '@/app/lib/dbConnect';
import Notification from '@/app/models/notification';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function PATCH(request, { params }) {
    await dbConnect();
    const { notificationId } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            error: true,
            modalMessage: 'Unauthorized'
        }, { status: 401 });
    }

    try {

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!updatedNotification) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Notification not found'
            }, { status: 404 });
        }

        return NextResponse.json(updatedNotification, { status: 200 });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Could not update notification',
            errorDetails: error.message,
        }, { status: 500 });

    }
}
