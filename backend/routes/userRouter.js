import express from "express"
import {  registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,} from "../controllers/user.controller.js"
    import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
router.get("/getuser", verifyJWT, getCurrentUser);
export default router