import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouter from "./routes/auth.routes.js"
import interviewRouter from "./routes/interview.route.js"
import cookieParser from 'cookie-parser';
import cors from "cors"

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth",authRouter);
app.use("/api/interview", interviewRouter);

app.listen(8080, ()=>{
    console.log(`Server is running on port 8080`);
})

