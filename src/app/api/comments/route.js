import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import comment from "@/app/models/comment";

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get('tid')
        const accountId = searchParams.get('aid')

        let results = {
            dbResults: []
        };

        if (accountId) {
            const dbResults = await comment.find({ accountId: accountId }).sort({ createdAt: -1 });

            results.dbResults = dbResults
        }

        if (teacherId) {
            if (Number.isInteger(teacherId)) {
                results.dbResults = 'No comments found';
                return NextResponse.json(results);
            }

            // Get comments and populate with user data using mongoose populate
            const dbResults = await comment.aggregate([
                {
                    $match: {
                        teacherId: new mongoose.Types.ObjectId(teacherId)
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
                    $lookup: {
                        from: 'replies',
                        let: { commentId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$commentId', '$$commentId'] }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    let: { replyAccountId: '$accountId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$email', '$$replyAccountId'] }
                                            }
                                        },
                                        {
                                            $project: {
                                                name: 1,
                                                _id: 0
                                            }
                                        }
                                    ],
                                    as: 'replyUserInfo'
                                }
                            },
                            {
                                $addFields: {
                                    accountName: {
                                        $ifNull: [
                                            { $arrayElemAt: ['$replyUserInfo.name', 0] },
                                            'Anonymous'
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    replyUserInfo: 0
                                }
                            }
                        ],
                        as: 'replies'
                    }
                },
                {
                    $project: {
                        userInfo: 0
                    }
                }
            ]);

            if (!dbResults || !dbResults.length) {
                results.dbResults = [];
                return NextResponse.json(results);
            }

            results = {
                dbResults: dbResults
            };
        }

        return NextResponse.json(results);
    } catch (err) {
        console.error('Error in GET comments:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();

    try {
        const { review, teacherId, ratings } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Validate that all required rating criteria are present
        const requiredRatings = ['teachingQuality', 'engagement', 'fairness', 'support', 'ease'];
        const missingRatings = requiredRatings.filter(criterion => !ratings[criterion]);

        if (missingRatings.length > 0) {
            return NextResponse.json({
                message: `Missing ratings for: ${missingRatings.join(', ')}`
            }, { status: 400 });
        }

        // Calculate overall rating from all criteria
        const overallRating = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length;

        // Validate the input data
        if (!review || !teacherId || !overallRating) {
            return NextResponse.json({
                message: 'Missing information: review, teacherId, overallRating'
            }, { status: 400 });
        }

        // Validate teacherId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid teacher ID'
            }, { status: 400 });
        }

        // Check if a comment with the same teacherId and accountId already exists
        const existingComment = await comment.findOne({
            teacherId: teacherId,
            accountId: accountId
        });

        if (existingComment //check if all the properties are the same (meaning the user didn't update shit)
            && existingComment.comment === review
            && existingComment.ease === ratings.ease
            && existingComment.fairness === ratings.fairness
            && existingComment.engagement === ratings.engagement
            && existingComment.teachingQuality === ratings.teachingQuality
            && existingComment.support === ratings.support
        ) {
            return NextResponse.json({
                message: 'Please change your ratings or your comment in order to update it.'
            }, { status: 409 }); // Conflict status code
        } const prompt = `You are a comment moderator for a teacher rating website. Approve comments if they meet the following criteria: Avoid offensive or vulgar language (no profanity or slurs). Avoid excessive insults or personal attacks unless using examples to prove the point(e.g., 'This teacher is horrible and useless' is too extreme; 'This teacher is not helpful in explaining concepts' is acceptable). Comments must include reasons or specific examples. For instance, 'The teacher never answers questions in class' or 'She gives us almost no homework and smiles while teaching' is acceptable. You may say the teacher is very bad if you provide concrete examples ( 'This teacher is horrible and useless, because she explains nothing in class and her exams are super hard' is acceptable). Allow informal language and minor grammar errors if the meaning is clear. Block comments with random characters (e.g., 'asdfghjk     The teacher is great, because she explains clearly in class'). Block vague comments like 'I hope he does well' since they are not constructive. Block contradictory comments such as 'I love him, he explains nothing in class' for lacking logical coherence. Emotional language is acceptable when supported by specific examples and context (e.g., 'She loves her job, smiles when she teaches, and explains clearly'). Block comments unrelated to the teacher (e.g., 'To study better, you need to listen in class'). Respond with 'APPROVED' or 'BLOCKED' followed by a concise reason in the comment's language (French or English). Only moderate comments in French and English; block all others. Block spam or repeated messages. Moderate only comments about teachers; ensure that overly vague, nonsensical, or contradictory comments are BLOCKED, while clear, detailed feedback—even if emotional—is APPROVED.

Comment to moderate: ${review}`;

        const result = await model.generateContent(prompt);
        const moderationResult = result.response.text();

        if (moderationResult.includes("BLOCKED")) {
            return NextResponse.json({
                message: 'Blocked',
                moderationResult: moderationResult
            }, { status: 201 });
        }

        if (existingComment) {
            existingComment.comment = review;

            const savedComment = await existingComment.save();

            return NextResponse.json({
                message: 'Successfully moderated',
                moderationResult: moderationResult,
                savedComment: savedComment
            }, { status: 201 });
        }

        // Create a new comment instance with all rating criteria
        const newComment = new comment({
            _id: new mongoose.Types.ObjectId(),
            teacherId: teacherId,
            accountId: accountId,
            comment: review,
            overallRating: overallRating,
            hasRated: false,
            teachingQuality: ratings.teachingQuality,
            engagement: ratings.engagement,
            fairness: ratings.fairness,
            support: ratings.support,
            ease: ratings.ease
        });

        // Save the new comment to the database
        const savedComment = await newComment.save();

        return NextResponse.json({
            message: 'Successfully moderated',
            moderationResult: moderationResult,
            savedComment: savedComment
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({
            message: 'Failed to add comment',
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const updateData = await request.json();

        const comment = await Comment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!comment) {
            return new Response(JSON.stringify({ error: "Comment not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(comment), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}