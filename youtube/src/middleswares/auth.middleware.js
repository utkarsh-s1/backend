import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt  from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next)=>{
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorized Error")
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = User.findById(decode?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Unauthorized Error no user")
        }
        req.user = user
        next()
    
    } catch (error) {
            throw new ApiError(500, "Server Error no user")
        
    }




})