import express from 'express';
import { User } from "../models/user_db.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const router = express.Router();

// signup here .. create user
// path /account/sign-up

router.post('/signup', async (req, res) => {
    const { username, email, password,examType } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            examType
        });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        // const token = jwt.sign(
        //     { id: newUser._id, role: 'user' },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '7d' }
        // );

        // Send success response with token
        return res.status(201).json({
            message: 'User created successfully',
            // token
        });

    } catch (error) {
        // Send error response
        return res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
});

// user login endpoint
// path localhost:3000/auth/login
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username: username})

        if(!user) {
            return res.status(404).send({message: "invalid username"})
        }
        const isMatch = await bcrypt.compare(password, user.password)  // create compare 
        if(!isMatch) {
            return res.status(404).send({message: "invalid password"})
        }

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({message: 'User login successfull', token : token }) // send token to front end
    } catch(e){
        res.status(500).send({message : 'Error while logging in', error : e.message})
    }
})


// update user..

router.put('/:id', async (req, res) =>{
    const {id} = req.params;
    if(!req.body.username || 
        !req.body.password || 
        !req.body.email || 
        !req.body.examType) 
    {
        res.status(400).send({message: 'All fields are required'});
    }
    const updatedUser = {
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
        examType : req.body.examType,
    }

    try{
        const user = await User.findByIdAndUpdate(id, updatedUser, {new: true});
        if(!user){
            return res.status(404).send({message: 'User not found'});
        } else{
            return res.status(200).send({message : 'User updated successfully', data :user});
        }
    } catch(err){
        res.status(500).send({message: 'Error while updating user', err: err});}
})

export default router;