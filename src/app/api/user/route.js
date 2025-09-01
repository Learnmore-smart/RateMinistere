// src/app/api/user/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function PATCH(request) {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { name } = body;

        // Check if username is taken (excluding current user)
        if (name) {
            // Add username validation
            if (name.length < 3 || name.length > 20) {
                return NextResponse.json({
                    error: "Invalid username",
                    message: "Username must be between 3 and 20 characters"
                }, { status: 400 });
            }

            // Check if username is taken by another user
            const existingUser = await User.findOne({
                name: name,
                email: { $ne: session.user.email } // Exclude current user
            });

            if (existingUser) {
                return NextResponse.json({
                    error: "Username already taken",
                    message: "This username is already taken. Please choose another one."
                }, { status: 400 });
            }
        }

        // Parse request body
        const {
            profileDescription,
            profilePicture,
            selectedTheme,
            backgroundColor,
            gradientEndColor,
            backgroundImage,
            profileVisibility,
            allowDirectMessages,
            showProfileInSearch,
            notificationsEnabled,
            customCursor,
            badges // Add badges here, assuming you might update multiple at once later
        } = body;

        const updateFields = {
            name,
            profileDescription,
            profilePicture,
            appearence: {
                selectedTheme,
                backgroundColor,
                gradientEndColor,
                backgroundImage,
                customCursor
            },
            privacySettings: {
                profileVisibility,
                allowDirectMessages,
                showProfileInSearch,
                notificationsEnabled
            }
        };

        // Conditionally add badges to the update if present
        if (badges) {
            updateFields.badges = badges;
        }

        // Update user with new fields
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            [{
                $set: {
                    ...updateFields,
                    // Update lastUsernameUpdate only if name is changing
                    lastUsernameUpdate: {
                        $cond: {
                            if: { $ne: ["$name", name] },
                            then: new Date(),
                            else: "$lastUsernameUpdate"
                        }
                    }
                }
            }],
            { new: true, upsert: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(options);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { action, points } = await request.json();

        // Validate points value
        if (typeof points !== 'number' || points <= 0) {
            return NextResponse.json({ error: "Invalid points value" }, { status: 400 });
        }

        // Update user points and add to history
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $inc: { points: points },
                $push: {
                    pointHistory: {
                        action: action,
                        points: points,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            points: updatedUser.points
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating points:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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
