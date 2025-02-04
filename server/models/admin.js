import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        default:'admin'
    }
})

// compare password for admin login
adminSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    // ensure only one admin exits
    if(this.role === 'admin'){
        const existingAdmin = await Admin.findOne({role: 'admin'});
        if(existingAdmin && existingAdmin.id.toString() === this.id.toString()){
            return next(new Error('Only one Admin is allowed'))
        }
    }
    next();
})

export const Admin = mongoose.model('Admin', adminSchema);