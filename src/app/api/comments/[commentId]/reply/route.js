import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import comment from "@/app/models/comment";
import reply from "@/app/models/reply";

export async function GET(request, { params }) {
    await dbConnect();
    const { commentId } = await params;

    try {
        // Validate the input data
        if (!commentId) {
            return NextResponse.json({
                message: 'Missing information: commentId'
            }, { status: 400 });
        }

        // Validate commentId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        // Find the comment by its ID and populate its replies
        const existingComment = await comment.findById(commentId).populate('replies');

        if (!existingComment) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Comment not found'
            }, { status: 404 });
        }

        // Retrieve the array of reply objectIds
        const replyIds = existingComment.replies;

        // Fetch all replies based on the retrieved objectIds
        const replies = await reply.find({ _id: { $in: replyIds } });

        return NextResponse.json({
            message: 'Replies retrieved successfully',
            replies: replies
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching replies:', error);
        return NextResponse.json({
            message: 'Failed to fetch replies',
            error: error.message
        }, { status: 500 });
    }
}