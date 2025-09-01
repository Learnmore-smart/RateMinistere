import mongoose from 'mongoose';

const replySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    commentId: {
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
});

export default mongoose.models.Reply || mongoose.model('Reply', replySchema, 'replies');