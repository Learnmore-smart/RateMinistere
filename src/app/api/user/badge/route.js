import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { options } from "@/app/api/auth/[...nextauth]/options";

//Select the badge equipped
export async function PATCH(request) {
    // Ensure user is authenticated
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Connect to MongoDB
        await dbConnect();

        // Parse request body - This is where the data from the client comes in
        const body = await request.json();

        // Extract data from the request body
        const {
            badgeId // Badges are extracted from the request body here
        } = body;

        // Conditionally add badges to the update if present
        if (!badgeId && badgeId == null) {
            return NextResponse.json({ message: 'Missing information: badgeId' }, { status: 404 });
        }

        // Find the user
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the user owns the badge

        if (badgeId !== 0 && !user.badges.owned.includes(badgeId)) {
            return NextResponse.json({ error: "User does not own this badge" }, { status: 403 });
        }

        // Update the user's current badge directly
        user.badges.current = badgeId == 0 ? null : badgeId;
        await user.save(); // Save the updated user document

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//Get user badges
export async function GET(request) {
    try {
        // Ensure user is authenticated
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Connect to MongoDB
        await dbConnect();

        // Get user data based on email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return user data
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
