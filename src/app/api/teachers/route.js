import dbConnect from "@/app/lib/dbConnect";
import teacher from "@/app/models/teacher";
import comment from "@/app/models/comment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";

// Flag to track if Monday update has already run
let mondayUpdateRun = false;

// Function to update previousRank for all teachers (run on Mondays)
const updatePreviousRanks = async () => {
    try {
        await dbConnect();

        const teachers = await teacher.find({});

        // Update previousRank for each teacher
        await Promise.all(
            teachers.map(async (teacherDoc) => {
                teacherDoc.lastWeekRank = teacherDoc.currentRank ?? null;
                await teacherDoc.save();
            })
        );

        console.log("Teacher ranks updated successfully for the week.");
    } catch (error) {
        console.error("Error updating teacher ranks:", error);
    }
};

// Function to calculate and update currentRank for all teachers
const updateAllCurrentRanks = async () => {
    try {
        await dbConnect();

        const allTeachers = await teacher.find({});

        if (!allTeachers || !Array.isArray(allTeachers)) {
            console.warn("No teachers found or invalid data for rank calculation.");
            return;
        }

        // Sort teachers by competition criteria
        const sortedTeachers = [...allTeachers].sort((a, b) => {
            if (a.numRatings === 0 && b.numRatings === 0) {
                return 0;
            }

            if (a.numRatings === 0) return 1;
            if (b.numRatings === 0) return -1;

            const ratingComparison = b.rating - a.rating;

            if (ratingComparison !== 0) {
                return ratingComparison;
            }

            return b.numRatings - a.numRatings;
        });

        // Update currentRank for each teacher
        await Promise.all(
            sortedTeachers.map(async (teacher, index) => {
                teacher.currentRank = index + 1;
                await teacher.save();
            })
        );

        console.log("Current ranks updated for all teachers.");
    } catch (error) {
        console.error("Error updating current ranks:", error);
    }
};

//fetch teachers
export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const schoolIdQuery = searchParams.get("sid");
        const teacherIdQuery = searchParams.get("tid");

        // Check if it's Monday and update ranks
        const today = new Date();
        if (today.getDay() === 1 && !mondayUpdateRun) {
            await updatePreviousRanks();
            await updateAllCurrentRanks(); // Recalculate after moving ranks
            mondayUpdateRun = true; // Set the flag to true
        } else if (today.getDay() !== 1) {
            mondayUpdateRun = false; // Reset the flag on other days
        }

        let results = {
            dbResults: [],
        };

        if (query) {
            // MongoDB search
            const dbResults = await teacher
                .find({
                    $and: [
                        schoolIdQuery ? { schoolId: schoolIdQuery } : {},
                        { name: { $regex: `\\b(${query})`, $options: "i" } },
                    ],
                })
                .limit(5);

            results = {
                dbResults: dbResults,
            };
        } else if (teacherIdQuery) {
            const document = await teacher.findById(teacherIdQuery);
            if (document === null) {
                results.dbResults = "No teachers found";
                return NextResponse.json(results);
            }

            results.dbResults = document;
        } else if (schoolIdQuery) {
            const document = await teacher.find({ schoolId: schoolIdQuery });
            if (document === null) {
                results.dbResults = "No teachers found";
                return NextResponse.json(results);
            }

            results.dbResults = document;
        } else {
            // If no search query, return all teachers from DB
            results.dbResults = await teacher.find({});
        }

        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

//Create teacher (from admin panel)
const admins = ["kendrick.nguyen.huu@gmail.com", "noahzh52@gmail.com"];

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session || !admins.includes(session.user.email)) {
        return NextResponse.json(
            { message: "You must be logged in." },
            { status: 401 }
        );
    }

    await dbConnect();

    try {
        // Parse the incoming request body
        const { name, role, schoolId } = await request.json();

        if (!name && !role && !schoolId) {
            return NextResponse.json(
                { message: "Missing information: name, role, schoolId" },
                { status: 404 }
            );
        }

        // Create a new teacher instance
        const newTeacher = new teacher({
            _id: new mongoose.Types.ObjectId(),
            name,
            role,
            schoolId,
        });

        // Save the new teacher to the database
        const savedTeacher = await newTeacher.save();

        return NextResponse.json(
            {
                message: "Teacher added successfully",
                teacher: savedTeacher,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding teacher:", error);
        return NextResponse.json(
            {
                message: "Failed to add teacher",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

//rate a teacher
export async function PATCH(request) {
    await dbConnect();

    try {
        // Parse the incoming request body
        const { teacherId, ratings, deleteComment } = await request.json();

        const session = await getServerSession(authOptions);

        const accountId = session.user.id

        if (!session) {
            return NextResponse.json({
                redirect: true,
                destination: '/login'
            }, { status: 401 });
        }

        if (!teacherId) {
            return NextResponse.json(
                { message: "Missing information: teacherId" },
                { status: 400 }
            );
        }
        // Check if a comment with the same teacherId and accountId already exists
        const existingComment = await comment.findOne({
            teacherId: teacherId,
            accountId: accountId,
        });

        // Find the teacher document
        const teacherToUpdate = await teacher.findById(teacherId);

        if (!teacherToUpdate) {
            return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
        }

        //if delete comment exists
        if (deleteComment) {
            if (!existingComment) {
                return NextResponse.json(
                    { message: "Comment not found, cannot delete comment" },
                    { status: 404 }
                );
            }
            //save existingComment data before deletion
            const criteriaKeys = Object.keys(existingComment._doc).filter((key) =>
                ["teachingQuality", "engagement", "fairness", "support", "ease"].includes(
                    key
                )
            );
            const previousRatings = criteriaKeys.reduce((obj, key) => {
                // Check if the key is present in the _doc property of the document
                if (existingComment._doc && existingComment._doc.hasOwnProperty(key)) {
                    obj[key] = existingComment._doc[key];
                }
                return obj;
            }, {});
            const previousAverageRating = existingComment.overallRating;
            //remove rating from teacher
            criteriaKeys.forEach((key) => {
                const currentRating = teacherToUpdate[key] || 0;
                const previousRating = previousRatings[key] || 0;
                const numRatings = teacherToUpdate.numRatings;

                teacherToUpdate[key] =
                    ((currentRating * numRatings) - previousRating) /
                    Math.max(1, numRatings - 1);
            });

            //overall rating update
            const numRatings = teacherToUpdate.numRatings;

            teacherToUpdate.rating =
                ((teacherToUpdate.rating * numRatings) - previousAverageRating) /
                Math.max(1, numRatings - 1);

            teacherToUpdate.numRatings = Math.max(0, teacherToUpdate.numRatings - 1);

            await comment.deleteOne({ _id: existingComment._id });

            if (teacherToUpdate.numRatings == 0) {
                teacherToUpdate.rating = 0;
                teacherToUpdate.teachingQuality = 0;
                teacherToUpdate.engagement = 0;
                teacherToUpdate.fairness = 0;
                teacherToUpdate.support = 0;
                teacherToUpdate.ease = 0;
            }
            await teacherToUpdate.save();

            // Recalculate ranks after deletion
            await updateAllCurrentRanks();

            return NextResponse.json({
                message: "Comment deleted successfully",
                updatedTeacher: teacherToUpdate,
            });
        }

        //if deleteComment does not exists, follow rating/new comment logic
        if (!ratings) {
            return NextResponse.json(
                { message: "Missing information: ratings" },
                { status: 400 }
            );
        }

        //
        //Code under is when modifying or creating a comment
        //

        //save existingComment data before modifications
        const criteriaKeys = Object.keys(ratings);

        const originalHasRated = existingComment?.hasRated;
        const previousRatings = criteriaKeys.reduce((obj, key) => {
            // Check if the key is present in the _doc property of the document
            if (existingComment && existingComment._doc && existingComment._doc.hasOwnProperty(key)) {
                obj[key] = existingComment._doc[key];
            }
            return obj;
        }, {});
        const previousAverageRating = existingComment?.overallRating;

        if (existingComment) {
            // Update existing comment

            // Update the ratings fields in the comment document
            for (const key in ratings) {
                existingComment[key] = ratings[key];
            }

            existingComment.overallRating =
                Object.values(ratings).reduce((a, b) => a + b, 0) /
                Object.values(ratings).length;
            existingComment.hasRated = true;

            //saving this later on after setting new criteria values
        } else {
            //Create a new comment
            const newComment = new comment({
                _id: new mongoose.Types.ObjectId(),
                teacherId: teacherId,
                accountId: accountId,
                overallRating:
                    Object.values(ratings).reduce((a, b) => a + b, 0) /
                    Object.values(ratings).length,
                hasRated: true,
                ...ratings,
            });

            // Save the new comment to the database
            await newComment.save();
        }

        // Update ratings for each criteria

        if (originalHasRated) {
            //remove previous rating
            criteriaKeys.forEach((key) => {
                const currentRating = teacherToUpdate[key] || 0;
                const previousRating = previousRatings[key] || 0;
                const numRatings = teacherToUpdate.numRatings;

                teacherToUpdate[key] =
                    ((currentRating * numRatings) - previousRating + ratings[key]) /
                    numRatings;
            });

            //overall rating update
            const numRatings = teacherToUpdate.numRatings;
            const newRating =
                Object.values(ratings).reduce((a, b) => a + b, 0) /
                Object.values(ratings).length;

            teacherToUpdate.rating =
                ((teacherToUpdate.rating * numRatings) - previousAverageRating +
                    newRating) /
                numRatings;

            //existing comment update
            existingComment.teachingQuality = ratings.teachingQuality;
            existingComment.engagement = ratings.engagement;
            existingComment.fairness = ratings.fairness;
            existingComment.support = ratings.support;
            existingComment.ease = ratings.ease;

            await existingComment.save();
        } else {
            // Update ratings for each criteria
            const currentNumRatings = teacherToUpdate.numRatings || 0;

            criteriaKeys.forEach((key) => {
                const newRating = ratings[key];
                const averageRating = teacherToUpdate[key] || 0;

                teacherToUpdate[key] =
                    ((averageRating * currentNumRatings) + newRating) /
                    (currentNumRatings + 1);
            });

            //overall rating for new ratings
            const newRating =
                Object.values(ratings).reduce((a, b) => a + b, 0) /
                Object.values(ratings).length;
            const averageRating = teacherToUpdate.rating || 0;

            //overallRating is adding the averageRating into the overall rating including all other ratings
            const overallRating =
                ((averageRating * currentNumRatings) + newRating) /
                (currentNumRatings + 1);

            teacherToUpdate.rating = overallRating;
            teacherToUpdate.numRatings = (teacherToUpdate.numRatings || 0) + 1;
        }

        await teacherToUpdate.save();

        // Recalculate ranks after rating submitted
        await updateAllCurrentRanks();

        return NextResponse.json({
            message: "Rating submitted successfully",
            updatedTeacher: teacherToUpdate,
        });
    } catch (error) {
        console.error("Error submitting teacher rating:", error);
        return NextResponse.json({
            message: "Failed to submit teacher rating",
            error: error.message,
        }, { status: 500 });
    }
}