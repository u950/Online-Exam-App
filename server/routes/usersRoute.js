import express from 'express';
import { Test } from '../models/tests.js';
import { User } from '../models/user_db.js';
import { Question } from '../models/questions.js';
import { TestAttempt } from '../models/testAttempt.js';
const router = express.Router();

// fetch exams for specific users with user id
// add token based authenticastion for user and protected routes

// user/id/test
// fetch avilable tests
// fetching test using user id if verified user can take test
router.get('/test/:id' ,async (req,res)=>{
    const {id} = req.params;

    try{
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).send({message: "usernot found", error: err.message});
        }
        const fetchTest = await Test.find({});
        if(!fetchTest){
            return res.status(404).send({message: 'Test not available',})
        }
        return res.status(200).send({
            message: `hello ${user.username} test availble`,
            count: fetchTest.length,
            data: fetchTest
        })
    } catch(e){
        return res.status(404).send({message: "error fetching test", err: e.message})
    }
})

// access each test write test for this 
// path user/test/:testId

router.get('/test/:testId', async(req, res)=>{
    const {testId} = req.params;

    try{
        const newTest = await Test.findById(testId);
        if(!newTest)
            return res.status(404).send({message: 'test not available'})

        return res.status(200).send({
            message: 'Test fetched successfully',
            test : newTest
        })
    } catch(error){
        return res.status(404).send({
            message: "Error fetching test",
            error : error
        })
    }

})


// fetch questions one by one here
// path /user/testpage/:questionId

router.get('/testpage/:questionId', async(req,res)=>{
    const {questionId} = req.params;

    try{
        const newQuestion = await Question.findById(questionId);
        if(!newQuestion){
            return res.status(404).send({
                message: "question not found",
                error_message : response.message
            })
        }

        return res.status(200).send({
            message: "question fetched successfull",
            question : newQuestion
        })
    }catch(error){
        return res.status(404).send({
            message: "error retriving question",
            error : error.message
        })
    }
})


// path /user/testSubmit/:testID

router.post('/testSubmit/:testId', async (req, res) => {
    const { testId } = req.params;
    const { user, responses, timeTaken } = req.body;

    if (!user || !responses || !Array.isArray(responses)) {
        return res.status(400).send({
            message: "Invalid request data: user, responses are required"
        });
    }

    try {
        // Calculate total score
        let totalScore = 0;
        const processedResponses = responses.map(response => {
            if (response.correct) {
                totalScore += 1; // Add points for correct answer
            }
            return {
                questionId: response.questionId,
                selectedOption: response.selectedOption,
                timeTaken: response.timeTaken,
                correct: response.correct
            };
        });

        const newAttempt = new TestAttempt({
            user,
            testId,
            responses: processedResponses,
            timeTaken,
            score: totalScore,
            completedAt: new Date()
        });

        const savedAttempt = await newAttempt.save();

        return res.status(201).send({
            message: "Test submitted successfully",
            attemptId: savedAttempt._id,
            score: totalScore
        });
    } catch (e) {
        console.error('Test submission error:', e);
        return res.status(500).send({
            message: "Failed to submit test",
            error_msg: e.message
        });
    }
});

// get student test details
// path /user/student/getresults/:id
// optimize later on fetching test using testid and student id
router.get('/student/getresults/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).send({
                message: 'Student ID is required'
            });
        }

        const results = await TestAttempt.findByStudentId(id);
        
        if (!results || results.length === 0) {
            return res.status(404).send({
                message: 'No test attempts found for this student'
            });
        }

        const finalresults = results.map(attempt =>({
            id: attempt._id,
            testName: attempt.testId?.title || "Unknown Test",
            timeTaken: attempt.timeTaken,
            score: attempt.score,
            completedAt: attempt.completedAt
        }))
        return res.status(200).json(finalresults);

    } catch (e) {
        return res.status(500).send({
            message: 'Server error while fetching results',
            error: e.message
        });
    }
});

export default router;