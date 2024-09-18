import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/jobs.model.js";
import cloudinary from "cloudinary";

const postJobApplication= asyncHandler(async(req,res)=>{
    const { role } = req.user;
  if (role === "Employer") {
   
      throw new ApiError(400,"Employer not allowed to access this resource.")
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400,"Resume File Required!");
  }
  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
  throw new ApiError(400, "Invalid file type. Please upload a PNG file.")
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    throw new ApiError(500,"Failed to upload Resume to Cloudinary");
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    throw new ApiError(404,"Job not found!");
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    throw new ApiError(404,"Job not found!", 404);
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    throw new ApiError(400,"Please fill all fields.");
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

const jobSeekerAllJob=asyncHandler(async(req,res)=>{
    const{role}=req.user
    if(role=="Employer")
    {
        throw new ApiError(400,"Employer not allowed to access this resource.")
    }
    const{_id}=req.user
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
        success: true,
        applications,
      });
});

const jobSeekerDeleteJobApplication= asyncHandler(async(req,res)=>{
    const{role}=req.user
    if(role=="Employer")
    {
        throw new ApiError(400,"Employer not allowed to access this resource.")
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if(!application)
    {
        throw new ApiError(404,"Application not found!")
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
});

const EmployerAllJob=asyncHandler(async(req,res)=>{
    const{role}=req.user
    if(role=="Job Seeker")
    {
        throw new ApiError(400,"Job Seeker not allowed to access this resource.")
    }
    const{_id}=req.user
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
        success: true,
        applications,
      });
});
 export{jobSeekerAllJob, jobSeekerDeleteJobApplication, EmployerAllJob, postJobApplication}