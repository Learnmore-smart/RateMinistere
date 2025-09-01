// src/app/api/check-beta-eligibility/route.js
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { addBadge, getBadge } from "@/app/utils/badgeUtils";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ isEligible: false }, { status: 403 });
        }

        const userEmail = session.user.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return Response.json({
                isEligible: false,
                message: "User not found in the database"
            }, { status: 404 });
        }
        // Check if user already has the badge
        if (user?.badges?.owned.includes(1)) {
            return Response.json({
                isEligible: false,
                message: "Not eligible for Christmas letter"
            });
        }

        // Check if today is December 25th
        const today = new Date();
        const isChristmas = today.getMonth() === 11 && today.getDate() === 25;

        // Check if user signed up before December 25th 0AM
        const cutoffDate = new Date('2024-12-25T00:00:00');
        const signupDate = new Date(user.createdAt);
        const isEarlySignup = signupDate < cutoffDate;

        const isEligible = isChristmas && isEarlySignup;

        if (isEligible) {
            // Find the Early Bird badge from the imported list
            const earlyBirdBadge = getBadge('Early Bird');

            if (earlyBirdBadge) {
                // Call the API to save the badge
                try {
                    const response = await addBadge({
                        badgeId: earlyBirdBadge.id,
                        NoahPass: process.env.NotAPassword,
                        email: userEmail
                    });

                    if (!response.ok) {
                        console.error("Failed to save badge:", await response.json());
                        // Optionally handle the error, but don't block eligibility
                    } else {
                        console.log("Badge saved successfully");
                    }
                } catch (error) {
                    console.error("Error calling save badge API:", error);
                    // Optionally handle the error
                }
            } else {
                console.error("Early Bird badge not found in badge list.");
            }
        }

        return Response.json({
            isEligible: isEligible,
            message: isEligible
                ? "Eligible for Christmas letter"
                : "Not eligible for Christmas letter"
        });

    } catch (error) {
        console.log("ERROR", error);
        return Response.json({
            isEligible: false,
            message: error.message
        }, { status: 500 });
    }
}