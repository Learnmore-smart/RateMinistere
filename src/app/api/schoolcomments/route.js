import dbConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import schoolComment from "@/app/models/schoolComment";
import { getServerSession } from 'next-auth';
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { convertKebabCaseToCamelCase, convertSnakeCaseToCamelCase } from "@/app/utils/stringUtils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//get school comments
export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const schoolId = searchParams.get('sid')

        let results = {
            dbResults: []
        };

        if (schoolId) {
            // MongoDB search
            if (Number.isInteger(schoolId)) {
                results.dbResults = 'No comments found';
                return NextResponse.json(results);
            }

            const dbResults = await schoolComment.find({ schoolId: schoolId });
            if (dbResults === null) {
                results.dbResults = 'No comments found';
                return NextResponse.json(results);
            }
            results = {
                dbResults: dbResults
            };
        } else {
            results.dbResults = 'No comments found';
        }

        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

//rate a school
export async function POST(request) {
    await dbConnect();

    try {
        const { accountName, review, schoolId, ratings, commentCriteria } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        // Define requiredRatings BEFORE using it
        const requiredRatings = [
            'academic-focus',
            'support-system',
            'school-culture',
            'extracurriculars',
            'surveillant-attitude',
            'teacher-quality',
            'class-quality',
            'club',
            'location'
        ];

        // Validate that all required rating criteria are present
        const missingRatings = requiredRatings.filter(criterion => !ratings[criterion]);

        if (missingRatings.length > 0) {
            return NextResponse.json({
                message: `Missing ratings for: ${missingRatings.join(', ')}`
            }, { status: 401 });
        }

        const formattedRatings = {};
        for (const key in ratings) {
            if (ratings.hasOwnProperty(key)) {
                formattedRatings[convertKebabCaseToCamelCase(key)] = ratings[key]
            }
        }

        // Calculate overall rating from all criteria
        const overallRating = Object.values(formattedRatings).reduce((a, b) => a + b, 0) / Object.values(formattedRatings).length;

        // Validate the input data
        if (!review || !schoolId || isNaN(overallRating)) {
            return NextResponse.json({
                message: 'Missing information: review, schoolId, overallRating, commentCriteria'
            }, { status: 402 });
        }

        // Validate schoolId is a valid Number
        if (isNaN(Number(schoolId))) {
            return NextResponse.json({
                error: true,
                modalMessage: 'Invalid school ID'
            }, { status: 400 });
        }

        // Check if a comment with the same schoolId and accountId already exists
        const existingComment = await schoolComment.findOne({
            schoolId: schoolId,
            accountId: accountId
        });

        if (existingComment) {
            return NextResponse.json({
                message: 'A comment for this school from this account already exists'
            }, { status: 409 }); // Conflict status code
        } const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `You are a comment moderator for a school rating website. Approve comments if they meet the following criteria: Avoid offensive or vulgar language (e.g., no profanity or slurs). Avoid excessive insults or personal attacks (e.g., 'This school is horrible and useless' is too extreme, but 'This school is not helpful in explaining concepts' is acceptable). Provide reasons or specific examples (e.g., 'The building is never clean' or 'The staff are friendly and they help a lot' is acceptable; 'The school is bad' without examples is not). Allow informal language and minor grammar errors, provided the meaning is clear (e.g., 'The teachers literally just repeat the book word for word' or 'This is the greatest school ever!' is fine. However, 'asdfghjk     The school is great, because they explain clearly in class' should be blocked for random characters). Sentence like: 'I hope it does well' should be blocked, it's not constructive and doesn't explain anything. Block contradictory comments like 'I love it, they explain nothing in class,' since they lack logical coherence. Emotional language is acceptable when supported by specific examples and context (e.g., 'The staff loves their job and are very friendly' is fine). Comments unrelated to the school (e.g., 'To study better, you need to listen in class') should be blocked. Respond with 'APPROVED' or 'BLOCKED' followed by a concise reason written in the language of the comment if blocked. Focus on content, not grammar or tone. Block comments in all other languages except French and English. If the user comments in French, reply the reason in French. Spam or repeated messages must be blocked. Only moderate comments about school! Ensure a balance: overly vague, nonsensical, or contradictory comments should be BLOCKED, while clear, detailed feedback, even if emotional, should be APPROVED.

This comment was written by ${accountName}. ${review}`;

        const result = await model.generateContent(prompt);
        const moderationResult = result.response.text();

        if (moderationResult.includes("BLOCKED")) {
            return NextResponse.json({
                message: 'Blocked',
                moderationResult: moderationResult
            }, { status: 201 });
        }


        // Create a new comment instance with all rating criteria
        const newComment = new schoolComment({
            _id: new mongoose.Types.ObjectId(),
            schoolId: schoolId,
            accountId: accountId,
            comment: review,
            commentCriteria,
            overall: overallRating,
            hasRated: false,
            ...formattedRatings
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