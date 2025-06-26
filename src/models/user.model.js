import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken" 
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username:{
        type: String , 
        required: true ,
        unique:true ,
        lowercase:true,
        trim:true ,
        index:true  // to make a field searchable in an optimized way // but it is expensive (computation) so use only when required
    },
    email:{
        type: String , 
        required: true ,
        unique:true ,
        lowercase:true,
        trim:true ,
    },
    fullname:{
        type: String , 
        required: true ,
        trim:true ,
        index:true
    },
    avatar:{
        type: String , //URL from a third party , not an image directly (say cloudinary )
        required: true 
    },
    coverImage:{
        type: String , //URL from a third party , not an image directly (say cloudinary )
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId , 
            ref: "Video"
        }
    ] , 
    password :{
        type:String , // direct password is not written // encrypted string is kept // but then how will we match while verification 
        required: [true ,'Password is required']
    }, 
    refreshToken:{
        type: String 
    }

} ,{timestamps: true})


// we adding a middleware that just before data gets saved we perform something (her encryption of password)
//  userSchema.pre("save" , ()=>{})  // while we write a pre dont use arrow callcack as we dont have access to 'this' here so we wont be able to access the fields
//in a middle where there is always an access to this flag next
// when our work is done we call this next func which tells to pass this flag to the next midlleware 
userSchema.pre("save" , async function (next) {
    //here is a problem that everytime something is changes in user then password gets changes  (if password is not changes then we dont need modification in it )so...
    if(!this.isModified("password"))return next() ; 

    this.password = await bcrypt.hash(this.password , 10)   // 10 is number of rounds (what is rounds??)
    next()
})

/*
the 10 is the salt rounds (or cost factor).

What does "salt rounds" mean?
It tells bcrypt how many times to process (hash) the password.

More rounds = more secure but slower hashing.*/




userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {//payload  (payload is just a fancy name given to a set of data we are sending )
            _id:this.id,
            email:this.email,
            username:this.username,
            fullname: this.fullname 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {//payload
            _id:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)