// app/api/comments/[commentId]/route.js
import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import Comment from "@/app/models/schoolComment";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    await dbConnect();
    const { commentId } = await params;

    try {
        console.log(commentId);
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        const existingComment = await Comment.findById(commentId);

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

/* export async function DELETE(request, { params }) {
    await dbConnect();
    const { commentId } = await params;

    try {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Comment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Comment deleted successfully',
            deletedComment: deletedComment
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Failed to delete comment',
            errorDetails: error.message
        }, { status: 500 });
    }
} */
