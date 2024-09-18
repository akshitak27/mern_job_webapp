import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import{jobSeekerAllJob, jobSeekerDeleteJobApplication, EmployerAllJob, postJobApplication} from "../controllers/application.controller.js"
const router=express.Router();
router.post("/post", verifyJWT, postJobApplication);
router.get("/employer/getall", verifyJWT, EmployerAllJob);
router.get("/jobseeker/getall", verifyJWT, jobSeekerAllJob);
router.delete("/delete/:id", verifyJWT, jobSeekerDeleteJobApplication);
export default router