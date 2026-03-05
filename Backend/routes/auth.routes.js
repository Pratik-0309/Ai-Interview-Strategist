import express from 'express'
import { registerUser, loginUser, logoutUser, refreshAccessToken} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/logout", logoutUser);

export default authRouter;