// app/api/comments/[replyId]/route.js
import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import Reply from "@/app/models/reply";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    await dbConnect();
    const { replyId } = await params;

    try {
        console.log(replyId);
        if (!mongoose.Types.ObjectId.isValid(replyId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        const existingComment = await Reply.findById(replyId);

        if (!existingComment) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Comment not found'
            }, { status: 404 });
        }

        return NextResponse.json(existingComment, { status: 200 });
    } catch (error) {
        console.error('Error fetching comment:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Failed to fetch comment',
            errorDetails: error.message
        }, { status: 500 });
    }
}