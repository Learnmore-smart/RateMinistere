import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import comment from "@/app/models/schoolComment";
import mongoose from "mongoose";
import Notification from "@/app/models/notification";
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            redirect: true,
            destination: '/login'
        }, { status: 401 });
    }

    try {
        const { commentId, voteType, schoolId } = await request.json();

        const accountId = session.user.id

        // Validate input
        if (!commentId || !voteType || !schoolId) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Missing required parameters'
            }, { status: 400 });
        }

        // Validate voteType
        if (!['upvote', 'downvote'].includes(voteType)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid vote type'
            }, { status: 400 });
        }

        // Validate commentId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        // Find the comment
        const existingComment = await comment.findById(commentId);

        if (!existingComment) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Comment not found'
            }, { status: 404 });
        }

        // Check if the user has already voted
        const hasVoted = existingComment.votes.some(vote => vote.accountId.toString() === accountId.toString());

        if (hasVoted) {
            const voteIndex = existingComment.votes.findIndex(vote => vote.accountId.toString() === accountId.toString());

            // Update vote counts
            if (voteType === 'upvote' && existingComment.votes[voteIndex].upVote == false) {
                existingComment.upvotes += 1;
                existingComment.downvotes -= 1;
            } else if (voteType === 'downvote' && existingComment.votes[voteIndex].upVote == true) {
                existingComment.upvotes -= 1;
                existingComment.downvotes += 1;
            }

            existingComment.votes[voteIndex] = {
                accountId: accountId,
                upVote: voteType === 'upvote'
            }

        } else {
            // Add vote to the votes array
            existingComment.votes.push({
                accountId,
                upVote: voteType == "upvote"
            });

            // Update vote counts
            if (voteType === 'upvote') {
                existingComment.upvotes = (existingComment.upvotes || 0) + 1;
            } else if (voteType === 'downvote') {
                existingComment.downvotes = (existingComment.downvotes || 0) + 1;
            }
        }

        // Save the updated comment
        const updatedComment = await existingComment.save();

        // Create notification if the user upvoted and it is not the owner of the comment.
        if (voteType === 'upvote' && accountId !== existingComment.accountId) {
            await Notification.create({
                _id: new mongoose.Types.ObjectId(),
                userId: existingComment.accountId, // Notify the owner of the comment
                type: 'like',
                content: {
                    translationKey: 'Notification.SchoolLiked',
                    data: {
                        userId: session.user.id
                    }
                },
                meta: {
                    commentId: commentId,
                },
                originId: commentId,
            });
        }

        return NextResponse.json({
            success: true,
            modalMessage: 'Vote recorded successfully',
            comment: updatedComment
        }, { status: 200 });

    }
    catch (error) {
        console.error('Error processing vote:', error);
        return NextResponse.json({
            error: true,
            modalMessage: 'Failed to process vote',
            errorDetails: error.message
        }, { status: 500 });

    }
}