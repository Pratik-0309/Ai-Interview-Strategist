import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import {generateInterviewReportController} from "../controllers/interview.controller.js"
import upload from "../middleware/multer.middleware.js"

const interviewRouter = express.Router();

interviewRouter.post("/", verifyJWT,upload.single("resume"), generateInterviewReportController);


export default interviewRouter;