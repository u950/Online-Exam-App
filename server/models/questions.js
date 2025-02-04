import mongoose from "mongoose";

// first create question based on the subject
const questionShema = new mongoose.Schema({
    subject: {
        type: String,
        required:true,
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
    },
    topic:{
        type: String,  // optional
    },
    questionText: {
        type: String,
        required:true,
        unique:true
    },
    options:[{
        type: String,
        // required:true  
    // not required for fill in the blank type question
    }],
    correctAnswer: {
        type: String,
        required:true
    }
})

// index for faster filtering
questionShema.index({subject:1, topic:1}) 

export const Question = mongoose.model('Question', questionShema)