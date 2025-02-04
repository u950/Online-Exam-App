import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import signupRoutes from './routes/signup.js';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js'  // admin routes
import userRoutes from './routes/usersRoute.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/account', signupRoutes) // create user here login

app.use('/user', userRoutes);
// admin routes
app.use('/admin', adminRoutes); // create admin here 




mongoose.connect(process.env.MONGO_URI )
    .then(() => {
        console.log('Connected to the Database successfully');
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(err => {console.log('Error connecting to mongodb',err)});

