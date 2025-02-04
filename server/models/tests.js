import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    examType: {
        type: String,
        required: true,
        enum: ['JEE', 'NEET']
    },
    totalMarks: {
        type: Number,
        required: true,
        // diffrent for JEE and NEET
    },
    totalTime: {
        type: Number,
        default: 180
    },
    subjects: [{
        name: {
            type: String,
            required: true,
            enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
        },
        questions:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }]
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt fields

// Indexing for optimized queries
testSchema.index({ examType: 1 });

export const Test = mongoose.model('Test', testSchema);
