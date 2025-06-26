import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN    ,
    credentials:true   
}))

// some more configutrations the incoming data 
// middlewares and are applied to all routes 

// from json //stores the data inside the incoming json to req.body
app.use(express.json({limit: "16kb"}))  //sets a limit ot the json (cause stuff can crash the server )

// for url // our backend cant read the url encoded form data the frontend send so this parses it and stores in req.body 
// this cant handle file data (we use multer for file data ie multipart/form-data)
app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))  //(to store public assets)

app.use(cookieParser()) //letss us access cookies inside users browser also set such coocies //there are some waus we can leep secure cookies om users browser that only th eserver can read amd remove






// ROUTES 

import userRouter from "./routes/user.routes.js"


//routes declaration


  
// app.use("/users" , userRouter)         

/* 
earlier we were directly doing 
app.get("/users/register" , ()=>{ })
but now we are writing a middleware --->   what this middleware do is that when it sees "\users" after the main url then give the control to the userRouter 
where the router.route("/register").get(controller) is written 
this makes the code cleaner as all the user tasks like /register /login etc can be done there
*/


//more better approach 

app.use("/api/v1/users" , userRouter)















export {app}

