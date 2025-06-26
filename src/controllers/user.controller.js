import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId )
        const accessToken=  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})     //validationBeforeSave: false means that we are just giving refresh token here so other reqired fields might cause error so it handles that
        return {accessToken , refreshToken}
    }catch(error){
        throw new ApiError(500 , "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req ,res) => {
    //gat user details  from frontend 
    //validation- req fields are not empty 
    //check if user already exists : username  , email
    //check for images , check for avatar 
    //upload them for cloudinary ,  avatar
    // create user object - create entry in db 
    //remove password and refreshtoken field from response (we dont want to send the encrypted password)
    //check for user creation 
    //return res 

    const{fullname , email, username ,password } =req.body
    // console.log(email)

    // console.log(req.body)

    // if(fullname ==""){
    //     throw new ApiError(400 ," fullname is required ")
    // }

    if(
        [fullname ,email, username , password].some((field)=>     //.some() checks if at least one item in the array makes the function return true.
        field?.trim()==="")
    ) {
        throw new ApiError(400 ,"All fields are required")  // this is catched by the .catch((er)=>next(err)) in the asynchandler wrapper 
    }


    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })


    if(existedUser){
        throw new ApiError(409 , "user alredy exists with this username or email")
    }
    // console.log(existedUser)
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log(req.files)

    // const coverImageLocalPath = req.files?.coverImage[0]?.path   //sometime this kind of syntax gives error 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log(avatar) 
    if(!avatar){
        throw new ApiError(400 ,"Avatar not uploaded to cloudinary")
    }

    const user = await User.create({  //this will return an object 
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url|| "",
        email ,
        password,
        username:username.toLowerCase()
    })

     
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" , //it is wht it is
    )  //mogo db created a unique _id for each    // we r removing password and reftoken from this byt could also have done from the user created above but via a diff mehtod 


    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user ")
    }

    return res.status(201).json( 
        new ApiResponse(200 ,createdUser , "user registered ")
    )
})


const loginUser = asyncHandler(async (req , res)=>{
    // get username or email and password (rq body- > data )
    // validation -not empty
    // find username in db 
    // compare password with hashed password
    // generate access and refresh token 
    // send cookies 

    const {email, username  , password } = req.body 

    if(!username && !email){
        throw new ApiError(400, "both username and email is required ") 
    }

    const user = await User.findOne({
        $or:[{username}  ,{email}]
    })

    if(!user){
        throw new ApiError(404 , "User does not exist")
    }

    const isPasswordValid  =await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401 , "password is invalid  ")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    // here even after implementing this user refresh token would be emty cause this varible was initialized before adding refreshtoken to db
    // db has refresh token but user doesnt 

    const loggedinUser = await User.findById(user._id).select("-password -refershToken")


    // Cookies are small pieces of data stored in your browser by a website. They help websites remember information about you across different pages or visits. 
    const options= {
        httpOnly:true ,
        secure:true 
        //cookies are modifiable by the frontend too , but if u want onlt the server can modify cookies then u need these options
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)  // we can do this cause cookie-parser middleware is set 
    .cookie("refreshToken" , refreshToken , options)
    .json( 
        new ApiResponse(
            200 ,
            {
                user :loggedinUser , 
                accessToken , 
                refreshToken  //why send again here if send via cookies  ?  (just for the case that when user want to to store the toke by himeself (say in local storage))
            },

            "user logged in successfully"
        )
    )


} )


const logoutUser = asyncHandler(async (req,res ) =>{
    //  how to get user ?
    // like we send cooqies res.cookies() by a middleware cookie-parser
    // same way we can also access cookies req.cookies() via cookie-parser middleware (see the auth.js (verifyjwt middleware))

    //verify user (done in middleware)
    //remove the refersh token 
    //remove cookies    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $usset: {//monfgofb operator
                refreshToken: 1  //this removes the field from docs 
            },
        },
        {
            new: true  //return the updated values/info
        }
    )

    const options= {
        httpOnly:true ,
        secure:true 
        //cookies are modifiable by the frontend too , but if u want onlt the server can modify cookies then u need these options
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200,{} , "User logged out "))




    
    


})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw ApiError(401, "unauthorized request")
    }

    try {
        const decodedRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedRefreshToken?._id)
        if(!user){
            throw ApiError(401 , "no user with this refreshtoken")
        }
        if(incomingRefreshToken!=user.refreshToken) {
            throw ApiError(401 , "refresh token is expired or used refresh token dont match with the db")
        }
        const{accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    } catch (error) {
        throw new ApiError(401 , error?.message|| "invalid refresh token")
    }

    const options ={
        httpOnly : true ,
        secure: true 
    }

    return 
    res.
    status(200)
    .cookie("accessToken" ,accessToken , options)
    .cookie("refreshToken" ,refreshToken , options)
    .json(
        new ApiResponse(
            200 , 
            {
                accessToken,
                refreshToken
            },
            "accessToken refreshed successfully"
    ))


})



const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})



const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true} //user will get the updated info
        
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

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
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

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params   // params is like getting from url  ,, '/video/:username'

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([  // aggregation returns an array of docs // but in ourcasse when we match we are left with only one doc (a doc is like a row in sql table entity)
        {
            $match: {  // where clause( where username== given username)
                username: username?.toLowerCase()
            }
        },
        {
            //lookup returns a field that has a array of matching ones  
            $lookup: { //join user and sunscription  (this is like a pipeline so above output is input for this )(it finds the document (like row in sql) and attach it to user as a field in a array  )
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {  // join (but this will generate a diff fiels )
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {   //like select query // select id , username from table1 
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {  //why we will there be a case that we dont get channel ? when username is wrong and we dont get a match 
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})


const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)   // we do this because req.user._id will return a string '8967765' but whath actully stored in mondo db is     OnjectId('8967765') // but in other places mongoose handle this for us ie it automatically converts the string (like User.findById(user._id )) // but hare we are using aggregation pipeline where mongoose has no role  
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"   // we get a owner array but since there will only be one value inside this array we remove the array and directly store the object   
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
})








export {
    registerUser,
    loginUser, 
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
    getUserChannelProfile
}       