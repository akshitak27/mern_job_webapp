import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Job } from "../models/jobs.model.js";


const getAllJobs= asyncHandler(async(req,res)=>{
    const jobs=await Job.find({expired:false});
    res.status(200).json({
        success: true,
        jobs,
      });
});
 const  postJobs =asyncHandler(async(req, res)=>{
    const {role}=req.user;
    if(role== "Job Seeker")
    {
        throw new ApiError(400 ,"Job Seeker not allowed to access this resource.")
    }
    const  {title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo}= req.body
      
    if (!(title ,description ,category ,country ,city ,location))
        {
            throw new ApiError(400 ,"Please provide full job details.");
        } 
        if ((!salaryFrom || !salaryTo) && !fixedSalary)
        {
            throw new ApiError(400 ,"Please either provide fixed salary or ranged salary.");
        }
        if (salaryFrom && salaryTo && fixedSalary){
            throw new ApiError (400, " Cannot Enter Fixed and Ranged Salary together.");
        }
 });

 const postedBy =asyncHandler(async(req,res)=>{
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
      });
      res.status(200).json({
        success: true,
        message: "Job Posted Successfully!",
        job,
      });
 });
  
  const getMyJobs =asyncHandler(async(req,res)=>{
    const {role}=req.user
    if(role=="Job Seeker")
    {
      throw new ApiError("Job Seeker not allowed to access this resource.", 400);
    }
    const myJobs=await Job.find({postedBy: req.user._id})
    return res.status(200).json({
      success:true,
      myJobs
    });
  });

  const updateJob=asyncHandler(async(req,res)=>{
    const {role}=req.user
    if(role=="Job Seeker")
    {
      throw new ApiError("Job Seeker not allowed to access this resource.", 400);
    }
    const{id}=req.params
    const job= await Job.findById(id)
    if(!job)
    {
      throw new ApiError(404,"OOPS! Job not found.")
    }
    job= await Job.findByIdAndUpdate(id,req,body,{
      new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
  });

  const deleteJob = asyncHandler(async (req, res) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      
       throw new ApiError4(400,"Job Seeker not allowed to access this resource.");
    }
    const {id}= req.params;
    const job = await Job.findById(id);
    if (!job) {
      throw new ApiError(404,"OOPS! Job not found.");
    }
    await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
    });

    const getSingleJob= asyncHandler(async(req,re)=>{
      try {
        const job = await Job.findById(id);
        if (!job) {
         throw new ApiError("Job not found.", 404);
        }
        res.status(200).json({
          success: true,
          job,
        });
      } catch (error) {
        throw new ApiError(404,`Invalid ID / CastError`);
      }
    });
    export{getAllJobs,
      postJobs,
      getMyJobs,updateJob, deleteJob, getSingleJob
    }
  