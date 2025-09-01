import dbConnect from "@/app/lib/dbConnect";
import school from "@/app/models/school";
import schoolComment from "@/app/models/schoolComment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { convertKebabCaseToCamelCase } from "@/app/utils/stringUtils";

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const schoolIdQuery = searchParams.get('sid')

        let results = {
            dbResults: []
        };

        if (query) {
            // MongoDB search
            const dbResults = await school.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { geolocation: { $regex: query, $options: 'i' } }
                ]
            }).limit(5);

            results = {
                dbResults: dbResults
            };
        } else if (schoolIdQuery) {
            if (Number.isInteger(schoolIdQuery)) {
                results.dbResults = 'No school found';
                return NextResponse.json(results);
            }
            const document = await school.findOne({ schoolId: schoolIdQuery });
            if (document === null) {
                results.dbResults = 'No school found';
                return NextResponse.json(results);
            }

            results.dbResults = document;
        } else {
            // If no search query, return all schools from DB
            results.dbResults = await school.find({});
        }

        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

//create school (from admin panel)
const admins = [
    "kendrick.nguyen.huu@gmail.com", "noahzh52@gmail.com"
]

export async function POST(request) {
    const session = await getServerSession(authOptions)

    if (!session || !admins.includes(session.user.email)) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    await dbConnect();

    try {
        const { name, location } = await request.json();

        // Validate the input data
        if (!name || !location) {
            return NextResponse.json({ message: 'Missing information: name, location' }, { status: 400 });
        }

        // Find the highest existing schoolId
        const lastSchool = await school.findOne().sort({ schoolId: -1 }).exec();
        const newSchoolId = lastSchool ? lastSchool.schoolId + 1 : 1; // Start from 1 if no schools exist

        // Create a new school instance
        const newSchool = new school({
            _id: new mongoose.Types.ObjectId(),
            schoolId: newSchoolId,
            name,
            geolocation: location
        });

        // Save the new school to the database
        const savedSchool = await newSchool.save();

        return NextResponse.json({ message: 'School added successfully', school: savedSchool }, { status: 201 });
    } catch (error) {
        console.error('Error adding school:', error);
        return NextResponse.json({
            message: 'Failed to add school',
            error: error.message
        }, { status: 500 });
    }
}

//rate a school
export async function PATCH(request) {
    await dbConnect();

    try {
        // Parse the incoming request body
        const { schoolId, commentCriteria, ratings } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        if (!schoolId || !ratings) {
            return NextResponse.json({ message: 'Missing information: schoolId, ratings' }, { status: 400 });
        }

        // Check if a comment with the same schoolId and accountId already exists (this shows that they already rated the school)
        const existingComment = await schoolComment.findOne({ schoolId: schoolId, accountId: accountId });

        const formattedRatings = {};
        for (const key in ratings) {
            if (ratings.hasOwnProperty(key)) {
                formattedRatings[convertKebabCaseToCamelCase(key)] = ratings[key]
            }
        }

        if (existingComment && existingComment.hasRated) {
            return NextResponse.json({
                message: 'A rating for this school from this account already exists'
            }, { status: 409 }); // Conflict status code
        } else if (existingComment && existingComment.hasRated == false) {
            existingComment.hasRated = true;
            await existingComment.save();

        } else {
            //Create an empty comment
            const newComment = new schoolComment({
                _id: new mongoose.Types.ObjectId(),
                schoolId: schoolId,
                accountId: accountId,
                overall: Object.values(formattedRatings).reduce((a, b) => a + b, 0) / Object.values(formattedRatings).length,
                hasRated: true,
                commentCriteria,
                ...formattedRatings,
            });

            // Save the new comment to the database
            await newComment.save();
        }


        // Find the school
        const schoolToUpdate = await school.findOne({ schoolId: schoolId });

        if (!schoolToUpdate) {
            return NextResponse.json({ message: 'School not found' }, { status: 404 });
        }

        // Update ratings for each criteria
        const criteriaKeys = Object.keys(formattedRatings);
        const currentNumRatings = schoolToUpdate.numRatings || 0;

        criteriaKeys.forEach(key => {
            const newRating = formattedRatings[key];
            const averageRating = schoolToUpdate[key] || 0;
            schoolToUpdate[key] = ((averageRating * currentNumRatings) + newRating) / (currentNumRatings + 1);

        });

        schoolToUpdate.numRatings = (schoolToUpdate.numRatings || 0) + 1;
        const newRating = Object.values(formattedRatings).reduce((a, b) => a + b, 0) / Object.values(formattedRatings).length;
        const averageRating = schoolToUpdate.overall || 0;
        const overallRating = ((averageRating * currentNumRatings) + newRating) / (currentNumRatings + 1);

        schoolToUpdate.overall = overallRating;

        await schoolToUpdate.save();

        return NextResponse.json({
            message: 'Rating submitted successfully',
            updatedSchool: schoolToUpdate
        });

    } catch (error) {
        console.error('Error submitting school rating:', error);
        return NextResponse.json({
            message: 'Failed to submit school rating',
            error: error.message
        }, { status: 500 });
    }
}