import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB!");
}).catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

// enable allow using json for requesting
app.use(express.json())

//get information form cookie
app.use(cookieParser())

//enable cors for calling api to another platforms
app.use(cors({
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200

}))

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

app.use(`/api/user`, userRouter);
app.use(`/api/auth`, authRouter);
app.use(`/api/listing`, listingRouter);

app.use(express.static(path.join(__dirname, `/client/dist`)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

// create middleware for error handling
/**
 * Describe parameters:
 * err: error need to response
 * req: Request 
 * res: Response
 * next: if valid with the pre-condition with be done on the next step
 */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.message || `Internal Server Error`;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: message,
    });
})