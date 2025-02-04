import express from 'express';
import { Test } from '../models/tests.js';
import { User } from '../models/user_db.js';
const router = express.Router();

// fetch exams for specific users with user id

router.get('/:id1/test/:id' ,async (req,res)=>{
    const {id1, id} = req.params;

    try{
        const user = await User.findById(id1);
        if(!user) {
            return res.status(404).send({message: "usernot found", error: err.message});
        }
        const fetchTest = await Test.findById(id);
        if(!fetchTest){
            return res.status(404).send({message: 'Test not available',})
        }
        return res.status(200).send({
            message: `hello ${user.username} test availble`,
            data: fetchTest})
    } catch(e){
        return res.status(404).send({message: "error fetching test", err: e.message})
    }
})

export default router;