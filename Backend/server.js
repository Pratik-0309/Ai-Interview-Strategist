import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouter from "./routes/auth.routes.js"
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.listen(8080, ()=>{
    console.log(`Server is running on port 8080`);
})

