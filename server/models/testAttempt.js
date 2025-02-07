import mongoose from "mongoose"
const testAttemptSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true //index for lookups
    },
    testId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
        index: true
    },
    responses:[{
        questionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Question'
        },
        selectedOption:Number,   // changed to store number only for easy validation
        timeTaken:{
            type:Number,
            required: true
        },
        correct: Boolean
    }],

    timeTaken:{
        type: Number, // total time taken for test
        default : 0
    },
    score:{
        type: Number, // total score
        default: 0
    },
    completedAt:{
        type:Date, 
        default: Date.now
    }
})

// as soon as the user submits answers this should be filled to database , and fetched later

testAttemptSchema.index({user: 1, testId: 1})

testAttemptSchema.statics.findByStudentId= function(studentId){
    return this.find({user : studentId})
        .populate('testId', 'name')
        .select('testId timeTaken score completedAt')
        .sort({completedAt: -1})
}

export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);