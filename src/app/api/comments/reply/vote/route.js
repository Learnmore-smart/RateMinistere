import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import reply from "@/app/models/reply";
import mongoose from "mongoose";
import Notification from "@/app/models/notification";
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function POST(request) {
    await dbConnect();

    try {
        const { replyId, voteType } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Validate input
        if (!replyId || !voteType) {
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

        // Validate replyId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(replyId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid reply ID'
            }, { status: 400 });
        }

        // Find the reply
        const existingReply = await reply.findById(replyId);

        if (!existingReply) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Reply not found'
            }, { status: 404 });
        }

        // Check if the user has already voted
        const hasVoted = existingReply.votes.some(vote => vote.accountId.toString()=== accountId.toString());

        if (hasVoted) {
            const voteIndex = existingReply.votes.findIndex(vote => vote.accountId.toString() === accountId.toString());

            // Update vote counts
            if (voteType === 'upvote' && existingReply.votes[voteIndex].upVote == false) {
                existingReply.upvotes += 1;
                existingReply.downvotes -= 1;
            } else if (voteType === 'downvote' && existingReply.votes[voteIndex].upVote == true) {
                existingReply.upvotes -= 1;
                existingReply.downvotes += 1;
            }

            existingReply.votes[voteIndex] = {
                accountId: accountId,
                upVote: voteType === 'upvote'
            }

        } else {
            // Add vote to the votes array
            existingReply.votes.push({
                accountId,
                upVote: voteType == "upvote"
            });

            // Update vote counts
            if (voteType === 'upvote') {
                existingReply.upvotes = (existingReply.upvotes || 0) + 1;
            } else if (voteType === 'downvote') {
                existingReply.downvotes = (existingReply.downvotes || 0) + 1;
            }
        }

        // Save the updated reply
        const updatedReply = await existingReply.save();
        // Create notification if the user upvoted and it is not the owner of the reply.
        if (voteType === 'upvote' && accountId !== existingReply.accountId) {
            await Notification.create({
                _id: new mongoose.Types.ObjectId(),
                userId: existingReply.accountId,
                type: 'like',
                content: {
                    translationKey: 'Notification.ReplyLiked',
                    data: {
                        userId: session.user.id
                    }
                },
                meta: {
                    commentId: existingReply.commentId,
                    replyId: replyId,
                },
                originId: replyId,
            });
        }
        return NextResponse.json({
            success: true,
            modalMessage: 'Vote recorded successfully',
            reply: updatedReply
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