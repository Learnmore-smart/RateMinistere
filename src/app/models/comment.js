import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teacherId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        unique: false
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        unique: false
    },

    comment: {
        type: mongoose.SchemaTypes.String,
        required: false,
        unique: false
    },
    overallRating: {
        type: mongoose.SchemaTypes.Number,
        required: true,
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
    replies: [{
        type: mongoose.SchemaTypes.ObjectId
    }],
    // Additional rating criteria fields
    teachingQuality: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    engagement: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    fairness: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    support: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    ease: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema, 'comments');