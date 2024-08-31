import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const genRefAccessToken = async function(userId){
    try {
        const user =await  User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

        
    } catch (error) {
        throw new ApiError(500, "cannot generate tokens")
        
    }
}

const registerUser =  asyncHandler(async(req, res)=>{
    const {fullname, email, username, password} = req.body
    if([fullname, username, email, password].some((f)=>f?.trim()==="")){
        throw new ApiError(400, "Fill all required fields")
    }

    const prev_user = await User.findOne({
        $or:[{username: username},{email: email}]
    })

    if(prev_user){
        throw new ApiError(404, "User already exists")
    }
    const  avatarlocalPath = req.files?.avatar[0]?.path
    let coverImagepath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImagepath = req.files?.coverImage[0]?.path
    }
    

    if(!avatarlocalPath){
        throw new ApiError(400, "no avatar Image")
    }

    console.log(avatarlocalPath, coverImagepath)

    const avatar = await uploadOnCloudinary(avatarlocalPath)
    console.log(100000)
    const coverImage = await uploadOnCloudinary(coverImagepath)

    console.log(1000)
    if(!avatar){
        throw new ApiError(400, "im tired")
     }
    const user = await User.create({
        fullname, 
        avatar:avatar.url,
        coverImage:coverImage?.url||null,
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered")
    )



})


const loginUser = asyncHandler(async(req, res)=>{
    console.log(req.body)

    const {username, email, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or:[{username:username}, {email:email}]
    })

    if(!user){
        throw new ApiError(400, "no such user exists")
    }
    if(!(await user.isPasswordCorrect(password))){
        throw new ApiError(400, "password incrorrect")
    }

    const {accessToken, refreshToken}=await genRefAccessToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        http:true,
        secure:true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options ).json(
        new ApiResponse(200, {
            user:loggedInUser, refreshToken, accessToken
        }, "User logged in successfully")
    )


})


const logOutUser = asyncHandler(async(req, res)=>{

    
    await User.findByIdAndUpdate(req.user._id, {
        $set:{
            refreshToken:undefined
        },
        new:true
    })
    const options = {
        http:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options ).json(
        new ApiResponse(200,{} ,  "User logged out successfully")
    )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await genRefAccessToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changePassword = asyncHandler(async(req,res)=>{
    const {password, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    if(!(await user.isPasswordCorrect(password))){
        throw new ApiError(404, "wrong password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200).json(
        new ApiResponse(200,{} ,"passowrd changed successfully")
    )


})


const getCurrentUser = asyncHandler(async(req, res)=>{
    return res.status(200).json(
        new ApiResponse(200, req.user, "user returned successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullname, email} = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname:fullname,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const prevUrl = await User.findById(req.user?._id).avatar


    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    await deleteFromCloudinary(prevUrl)

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "coverInage file is missing")
    }

    const prevUrl = await User.findById(req.user?._id).coverImage

    const coverImage = await uploadOnCloudinary(avatarLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")
    await deleteFromCloudinary(prevUrl)

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "COver image updated successfully")
    )
})


const getUserProfile = asyncHandler(async(req, res)=>{
    const {username} = req.params
    if(!username?.trim()){
        throw new ApiError(404, "no user given")

    }

    const channel = await User.aggregate([
        {
            $match:{username:username}
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"


            }
        },
        {
            $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"

            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if: {$in:[
                                    req.user?._id, "$subscribers.subscriber"
                                ]       
                            },
                        then:true,
                        else:false
                        
                    }
                }

            }

        },
        {
            $project:{
                fullname:1,
                username:1,
                email:1,
                subscribersCount:1,
                channelSubscribedToCount:1,
                isSubscribed:1,
                coverImage:1,
                avatar:1

            }
        }

    ])
    console.log(channel)
    if(channel?.length){
        throw ApiError(404, "CHannel do not exist")
    }
    return res.status(200).json(
        new ApiResponse(200, channel[0], "channel info given")
    )


})

const getWatchHistory = async function(req, res){

    const user = User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                foreignField:"_id",
                localField:"watchHistory",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:'Users',
                            foreignField:"_id",
                            localField:"owner",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        avatar:1,
                                        username:1
                                    }
                                }
                            ]
                        },


                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]

            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )

}

export {registerUser, getWatchHistory, loginUser, logOutUser, getUserProfile, refreshAccessToken, getCurrentUser, changePassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage}