import mongoose from 'mongoose';

const teacherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: false
    },
    role: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: false
    },
    rating: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: false,
        default: 0
    },
    numRatings: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: false,
        default: 0
    },
    schoolId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: false
    },
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
    lastWeekRank: {
        type: mongoose.SchemaTypes.Number,
        default: null,
    },
    currentRank: {
        type: mongoose.SchemaTypes.Number,
        default: null,
    }
});

export default mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema, 'teachers');