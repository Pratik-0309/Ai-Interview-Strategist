import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import {generateInterviewReportController, getInterviewReportById, getUserInterviewReport} from "../controllers/interview.controller.js"
import upload from "../middleware/multer.middleware.js"

const interviewRouter = express.Router();

interviewRouter.post("/", verifyJWT,upload.single("resume"), generateInterviewReportController);
interviewRouter.get("/report/:interviewId", verifyJWT, getInterviewReportById);
interviewRouter.get("/", verifyJWT, getUserInterviewReport);


export default interviewRouter;