
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    examType: {
        type: String,
        required: true,
        enum: ['JEE','NEET']
    },
    role:{
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'  // role based access
    },
    createdAt:{
        type: Date,
        default: Date.now
    },

})

// username or email index for faster lookup change later
// userSchema.index({email: 1}) //index for fater lookup 

// hash password before saving user
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next();  // continue
})

// export mongoode model named User
export const User = mongoose.model('User', userSchema);