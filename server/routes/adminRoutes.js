import express from 'express';
import { User } from '../models/user_db.js';
import auth from '../middleware/auth.js';
import { Admin } from '../models/admin.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { Test } from '../models/tests.js';
import { Question } from '../models/questions.js';

const router = express.Router();
dotenv.config();


// const isAdmin = (req, res, next) =>{
//     if(req.user.role !== 'admin'){
//         return res.status(403).json({message: 'Access forbidden : Admin only!'})
//     }
//     next();
// }
// admin create signup deleted further
 
// path http://localhost:3000/admin/createAdmin

router.post('/createAdmin', async (req, res) => {
    const {username, email ,password} = req.body;

    try{
        const newAdmin = new Admin({username, email, password});
        await newAdmin.save();
        // generate the token jwt after successful signup
        const token = jwt.sign({id:newAdmin._id, role: 'admin'}, process.env.JWT_SECRET, {expiresIn:'7d'})
        // send/store  the token as soon as signup to admin 
        return res.status(201).send({
            message: 'Admin created successfully token authencation token valid upto 1hour',
            token: token});

    } catch(err){
        return res.status(400).send({message: err.message})
    }
})


// admin login

// path /admin/loginAdmin

router.post('/login', async(req,res) => {
    const {username, password} = req.body;
    try{
        const admin = await Admin.findOne({username});
        if(!admin){
            return res.status(404).send({message: 'Admin profile not found'});
        }
        const isMatch = await admin.comparePassword(password); // implement this 
        if(!isMatch){
            return res.status(404).send({message: 'Invalid credentials'})
        }
        const token = jwt.sign({id:admin._id, role: 'admin'}, process.env.JWT_SECRET,{expiresIn : '7d'})
        
        return res.status(200).send({message : 'Login successful ', token}) // send tokens

    } catch(err){
        return res.status(500).send({message : "error during login", err: err.message});
    }
})


// admin get all users / students names enrolled path 

//  http://localhost:3000/admin/GetUsersAdmin for list all users

router.get('/GetUsers', auth ,async (req, res) =>{
    try{
        const users = await User.find({});
        return res.status(200).json({
            message : 'fetched all users successfully..',
            count : users.length,
            data : users
        });
    } catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error while fetching users', err : err.message})}

})

// path /admin/deleteuser/:id

router.delete('/deleteUser/:id' ,auth,async (req, res) =>{
    const {id} = req.params;
    try{
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).send({message: 'User not found'});
        } else{
            return res.status(200).send({message: 'User deleted successfully'});
        }
    } catch(err){
        res.status(500).send({message: 'Error while deleting user', err: err.message});}
})

// get all admin 

// path /admimn/admins

router.get('/admins',async (req, res) =>{
    try{
        const admin = await Admin.find({});
        if(!admin){
            return res.status(404).send({message: 'admins not found '})
        }
        return res.status(200).send({
            message : 'successfully fetched admin', 
            data: admin
        })
    }catch(e){
        return res.status(404).send({message : 'error fetching admins', err: err.message})
    }
})

// create question
// path /admin/createQuestion
router.post('/createQuestion', async (req, res) => {
    const {subject, topic, questionText, options, correctAnswer} = req.body;

    try {
        const question = new Question({subject, topic, questionText, options, correctAnswer});
        await question.save();
        
        return res.status(201).json({
            message: 'Question created successfully',
            question
        });
        
    } catch(e) {
        return res.status(400).json({
            message: 'Error saving question',
            error: e.message
        });
    }
});

// fetch questions for admin to set test
// oath /admin/getquestion

router.get('/getquestion', async (req, res) => {
    try{
        const question = await Question.find({});
        if(!question){
            return res.status(404).send({message: 'question not found', err: err.message})
        }

        return res.status(200).send({
            message: 'question found',
            counts : question.length,
            questions : question 
        })
    } catch(e){
        return res.status(404).send({message: 'error finding question', err: err})
    }
})
// this should be protected route for admin
// http://localhost:3000/admin/createTest

// removed auth but will add later 
router.post('/createTest', async (req, res) => {
    const {
        title, 
        description, 
        examType, 
        totalMarks, 
        totalTime,
        subjects = [] // Default to empty array if not provided
    } = req.body;

    try {
        const newTest = new Test({
            title, 
            description, 
            examType, 
            totalMarks, 
            totalTime,
            subjects  // Use the subjects from req.body
        });

        await newTest.save();
        if(!newTest) {
            return res.status(404).send({message: 'error saving test', err: err.message});
        }

        return res.status(200).send({
            message: 'New Test created successfully',
            data: newTest
        });
    } catch(err) {
        return res.status(500).send({message: "error creating test", err: err.message});
    }
});

export default router;