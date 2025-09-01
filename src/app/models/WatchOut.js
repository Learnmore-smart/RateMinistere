import mongoose from 'mongoose';

const watchOutSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teacherId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Teacher' // Reference the Teacher model (assuming you have one)
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        required: true,
        maxLength: 30,  // Enforce 30-character limit at the schema level
    },
    createdAt: {  // Good practice to include timestamps
        type: Date,
        default: Date.now,
    },
    //  Optional:  Add upvotes/downvotes if you want that functionality later
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    // Optional:  Add a flag to indicate if the comment has been moderated
    isModerated: {
        type: Boolean,
        default: false,
    }
    // Add more fields here if needed (e.g.,  reported: Boolean)
});

//  Pre-save hook to ensure the comment doesn't exceed 30 characters.
// This is a *second* layer of protection, in addition to the client-side checks.
watchOutSchema.pre('save', function(next) {
    if (this.comment.length > 30) {
        this.comment = this.comment.substring(0, 30); // Truncate at the database level
    }
    next();
});

//  Create a compound index to prevent duplicate comments from the same user for the same teacher.
watchOutSchema.index({ teacherId: 1, accountId: 1 }, { unique: true });

//  Use mongoose.models.WatchOut to prevent OverwriteModelError.
// Store watchOut comments within a dedicated collection.
const WatchOut = mongoose.models.WatchOut || mongoose.model('WatchOut', watchOutSchema, 'watchOutComments');
export default WatchOut;