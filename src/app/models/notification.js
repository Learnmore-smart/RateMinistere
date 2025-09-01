import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
        index: true, // Crucial for query performance
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'message', 'system', 'post', 'mention'], // Customize this to your needs
        required: true,
    },
    content: {
        type: Object,  // Change to Object type
        required: true,
        validate: {
            validator: function(v) {
                return v.translationKey && typeof v.translationKey === 'string' &&
                       v.data && typeof v.data === 'object';
            },
            message: 'Content must have translationKey (string) and data (object)'
        }
    },
    link: {
        type: String, // Optional: Link to related content
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    meta: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    originId: {
        type: String, // Change from ObjectId to String
        index: true,
    },
},
    { timestamps: true } // Enables createdAt and updatedAt timestamps
);


// Ensure index exists
notificationSchema.index({ createdAt: -1 }); // For sorting notifications by date

// Create a compound index for efficiency of getting all unread notifications
notificationSchema.index({ userId: 1, read: 1 });


export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema, 'notifications');