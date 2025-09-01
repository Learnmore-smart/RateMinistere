import mongoose from 'mongoose';

const schoolSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    schoolId: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: false
    },
    geolocation: { // Geographic location
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: false
    },
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
    }
});

export default mongoose.models.School || mongoose.model('School', schoolSchema, 'schools');