import mongoose from 'mongoose';

const schoolCommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    schoolId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: false
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        unique: false
    },
    commentCriteria: {
        type: mongoose.SchemaTypes.String,
        required: false,
    },
    comment: {
        type: mongoose.SchemaTypes.String,
        required: false,
        unique: false
    },
    /* this is a check that is false when comment is created and true when the teacher is rated (This is just to help know if user already voted or not) */
    hasRated: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        unique: false
    },
    upvotes: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    downvotes: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    votes: [{
        accountId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        upVote: {
            type: mongoose.SchemaTypes.Boolean,
            required: true
        }
    }],
    // Additional rating criteria fields
    overall: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: false,
        default: 0
    },
    // Additional rating criteria fields
    academicFocus: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    supportSystem: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    schoolCulture: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    extracurriculars: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    surveillantAttitude: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    teacherQuality: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    classQuality: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    club: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    location: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    numRatings: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    timestamp: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.SchoolComment || mongoose.model('SchoolComment', schoolCommentSchema, 'schoolComments');