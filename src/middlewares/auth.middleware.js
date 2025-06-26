// this middleware verifies ki user hai ya nhi 

import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT =asyncHandler(async (req,_    ,next)=>{    // here there is no use of res so u can write _
    try {
        //token can conme from cookies as we stored it ther or user can send it via header
        const token = req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer " ,"")                 //name should be same as send from use // typically its authorization header using the Bearer scheme ie :    Authorization: Bearer <Token>     // so here when we replace "Bearer " with "" we are left with Token only 
    
        if (!token){
            throw new ApiError(401 , "Unauthorized requent")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") 
    
        if(!user){
            throw new ApiError(401 , "invalid access token")
        }
    
        req.user=user 
        next() 
    
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }

})