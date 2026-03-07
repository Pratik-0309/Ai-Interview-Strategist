import express from 'express'
import { registerUser, loginUser, logoutUser,userProfile, refreshAccessToken} from '../controllers/auth.controller.js';
import verifyJWT from "../middleware/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);   
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/profile",verifyJWT, userProfile);
authRouter.post("/logout",verifyJWT ,logoutUser);

export default authRouter;