import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateRefreshandAccessToken= async(userId)=>
    {
        try{
            const user= await User.findById(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
    
            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })
    
            return {accessToken, refreshToken}
    
    
        }
        catch(error){
            throw new ApiError(500, "Something went wrong while generating access and refresh token")
        }
    }
const registerUser= asyncHandler(async(req,res)=>{
    const {fullName , email, phone , password, role}=req.body;

    if(!(fullName , email, phone , password, role))
    {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = await User.findOne({email});

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role,
  });



const createdUser = await User.findById(user._id).select("-password -refreshToken");

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
}

// Respond with the created user
return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

 const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!(email, password,role)) {
      throw new ApiError(400,"Please provide email ,password and role.");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
     throw new ApiError(400,"Invalid Email Or Password.");
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      throw new ApiError( 400,"Invalid Email Or Password.");
    }
    if (user.role !== role) {
    throw new ApiError (404,`User with provided email and ${role} not found!`);
    }
    const {accessToken, refreshToken} = await generateRefreshandAccessToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
            200,{
            user: loggedInUser, accessToken, refreshToken,
            },
            "User logged In successfully"
        )
    )
  });

  const logoutUser= asyncHandler(async(req, res)=>{
    await  User.findByIdAndUpdate(
          req.user._id,
          {
              $set:{
                  refreshToken:undefined
              }
          },
          {
              new:true
          }
      )
      const options={
          httpOnly:true,
          secure:true
      }
      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(
          200,
          {},
          "User logged out"
      ))
  })

  const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken|| req.body.refreshToken
 
    if(!incomingRefreshToken)
    {
     throw new ApiError(401,"unauthorized request")
    }
    try{
   const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   const user= await User.findById(decodedToken?._id)
 
   if(!user)
   {
     throw new ApiError(401, "Invalid refresh token")
   }
   if(incomingRefreshToken!==user?.refreshToken)
   {
     throw new ApiError(401, "Refresh token is expired or used")
   }
 
    const options={
     httpOnly:true,
     secure:true
    }
 
  const {accessToken, newRefreshToken}= await generateRefreshandAccessToken(user._id)
 
   return res
   .status(200)
   .cookie("accessToken",options)
   .cookie("newRefreshToken",options)
   .json(
     new ApiResponse(
         200,
         {
             accessToken,newRefreshToken
         },
         "Access token refreshed"
     )
   )
}

catch(error)
{
throw new ApiError(401, error?.message || "Invalid refresh token")
}     


})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})
export{
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    
};
