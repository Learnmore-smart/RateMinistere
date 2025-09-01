import { getServerSession } from 'next-auth/next';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/user';

export async function GET(req, res) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new Response(JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).select('appearence.customCursor');

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true, customCursor: user.appearence?.customCursor ?? true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error fetching user settings:", error);
        return new Response(JSON.stringify({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch user settings', details: error.message } }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}