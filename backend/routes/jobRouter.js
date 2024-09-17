import express from "express"
import { getAllJobs,
     deleteJob, getMyJobs,updateJob, getSingleJob, postJobs } from "../controllers/job.controller.js";
     import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.get("/getall", getAllJobs);
router.post("/post", verifyJWT, postJobs);
router.get("/getmyjobs", verifyJWT, getMyJobs);
router.put("/update/:id", verifyJWT, updateJob);
router.delete("/delete/:id", verifyJWT, deleteJob);
router.get("/:id", verifyJWT, getSingleJob);
export default router;