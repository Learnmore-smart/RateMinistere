import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import comment from "@/app/models/comment";
import reply from "@/app/models/reply";
import User from "@/app/models/user";
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('cid');

        if (!commentId) {
            return NextResponse.json({ replies: [] });
        }

        // Get replies with user data using mongoose aggregate
        const replies = await reply.aggregate([
            {
                $match: {
                    commentId: new mongoose.Types.ObjectId(commentId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { accountId: '$accountId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$email', '$$accountId'] }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 0
                            }
                        }
                    ],
                    as: 'userInfo'
                }
            },
            {
                $addFields: {
                    accountName: {
                        $ifNull: [
                            { $arrayElemAt: ['$userInfo.name', 0] },
                            'Anonymous'
                        ]
                    }
                }
            },
            {
                $project: {
                    userInfo: 0
                }
            }
        ]);

        return NextResponse.json({ replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const { replyText, commentId } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Validate the input data
        if (!replyText || !commentId) {
            return NextResponse.json({
                message: 'Missing information: replyText, commentId'
            }, { status: 400 });
        }

        // Validate teacherId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 400 });
        }

        // Check if the comment exists
        const existingComment = await comment.findOne({
            _id: commentId
        });

        if (!existingComment) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid comment ID'
            }, { status: 401 });
        }

        // Find user info first
        const user = await User.findById(accountId);
        if (!user) {
            return NextResponse.json({
                message: 'User not found'
            }, { status: 404 });
        }        const prompt = `You are a reply moderator for a teacher rating website. Approve replies to comments as long as they contribute to the discussion in a meaningful way. Use the following guidelines:

- Relevant and on-topic: The reply should relate to the original comment, whether by agreeing, disagreeing, asking a relevant question, or adding information. Avoid blocking replies that make a loose connection to the topic, but block replies that are entirely off-topic (e.g., random personal questions).
- Respectful and civil: Mild frustration or disagreement is acceptable as long as it doesn't escalate into direct insults, profanity, or offensive language. Light sarcasm or casual disagreement is fine.
- Adds value: Prefer replies that offer reasoning, examples, or explanations, but allow brief supportive replies (e.g., "I agree!" or "Same experience") as long as they contribute to the conversation.
- Coherent and understandable: Informal language, minor grammar mistakes, and casual phrasing are acceptable as long as the reply makes sense. Block nonsensical replies (e.g., "qwerty amazing point").
- Avoid spam or repetition: Block repeated replies or obvious spam.
- Emotional language is fine if it stays relevant and specific (e.g., "I love this teacher! They make learning fun!").

Respond with "APPROVED" or "BLOCKED" followed by a concise reason written in the language of the reply if blocked. Only moderate replies to comments about teachers. Block replies in all other languages except French and English. If the reply is in French, provide the reason in French.

Reply to moderate: ${replyText}`;

        const result = await model.generateContent(prompt);
        const moderationResult = result.response.text();

        if (moderationResult.includes("BLOCKED")) {
            return NextResponse.json({
                message: 'Blocked',
                moderationResult: moderationResult
            }, { status: 201 });
        }

        // Create a new reply with user info
        const newReply = new reply({
            _id: new mongoose.Types.ObjectId(),
            commentId: commentId,
            accountId: accountId,
            comment: replyText
        });

        // Save the new reply
        const savedReply = await newReply.save();

        // Add the reply to the existing comment
        existingComment.replies.push(savedReply._id);

        // Save the updated comment
        await existingComment.save();

        return NextResponse.json({
            message: 'Successfully moderated',
            moderationResult: moderationResult,
            savedReply: savedReply
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding reply:', error);
        return NextResponse.json({
            message: 'Failed to add reply',
            error: error.message
        }, { status: 500 });
    }
}