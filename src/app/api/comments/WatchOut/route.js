import WatchOut from "@/app/models/WatchOut";
import dbConnect from "@/app/lib/dbConnect";  // Your database connection
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export async function POST(request) {
    await dbConnect();

    try {
        const { review, teacherId } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Input Validation (Essential!)
        if (!review || !teacherId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return NextResponse.json({ message: 'Invalid teacher ID' }, { status: 400 });
        }        // Gemini Moderation (Updated Prompt)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `You are a comment moderator for a teacher 'watch out' section. Your task is to approve or block comments based on whether they provide *constructive, specific, and relevant warnings* about a teacher's behavior in exams or in class. Focus on things students should *watch out for*. Avoid offensive language, personal attacks, and irrelevant information. 'APPROVED' or 'BLOCKED', followed by a concise reason *in the language of the comment* if blocked. French and English only. Block spam/repeated messages. Moderate comments about the *teacher*, not other topics.

Comment by ${session.user.name}: ${review}`;

        const result = await model.generateContent(prompt);
        const moderationResult = result.response.text();

        if (moderationResult.includes("BLOCKED")) {
            return NextResponse.json({
                message: 'Blocked',
                moderationResult: moderationResult
            }, { status: 200 }); //  Return 200 even if blocked, to avoid client-side errors
        }
        const newWatchOutComment = new WatchOut({
            _id: new mongoose.Types.ObjectId(),
            teacherId: teacherId,
            accountId: accountId,
            comment: review, // Store the moderated review
        });
        const savedComment = await newWatchOutComment.save();

        // Award points for sharing Watch-Out section
        await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'watchout_share',
                points: 3
            }),
        });

        return NextResponse.json({
            message: 'Successfully moderated and saved',
            moderationResult: moderationResult,
            savedComment: savedComment // Return the saved comment
        }, { status: 201 });


    } catch (error) {
        console.error("Error in watchOut POST:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    await dbConnect();

    try {
        const { teacherId, comment } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Input validation
        if (!teacherId || !comment) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return NextResponse.json({ message: 'Invalid teacher ID' }, { status: 400 });
        }

        // Find the teacher
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
        }

        // Check for duplicate comments
        const existingComment = teacher.watchOutComments.find(existing => existing.accountId.toString() === accountId.toString());
        if (existingComment) {
            return NextResponse.json({ message: 'Comment already exists for this user' }, { status: 409 });
        }


        // Add the comment to the teacher (assuming you have a 'watchOutComments' field)
        teacher.watchOutComments.push({
            accountId: accountId,
            comment: comment,
        });

        // Save the updated teacher
        await teacher.save();

        return NextResponse.json({ message: 'Comment added successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error in watchOut PATCH:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
