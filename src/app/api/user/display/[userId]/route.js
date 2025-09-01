// This sends back little userdata like profile image and username to be used for comments and other stuff.
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request, { params }) {

    try {
        // Ensure user is authenticated
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to MongoDB
        await dbConnect();

        const { userId } = await params;
        if (!userId) {
            return NextResponse.json({ error: "No UserId provided" }, { status: 404 });
        }

        // Get user data based on userId
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return user data
        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            profilePicture: user.profilePicture
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
