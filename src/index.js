// require('dotenv').config({ path :'./env'})   // this will work but it effects the consistency of our code as we using module js 

// import dotenv from "dotenv/config"
import 'dotenv/config'
import mongoose from "mongoose"
// import { DB_NAME } from "./constants";
import { app } from './app.js';

import express from "express"

import connectDB from "./db/index.js";


// import dotenv from "dotenv"
// dotenv.config({ 
//     path:'./.env'
// })
// anoher way to do is to add it in the dev script in pakage. json
// "dev":"nodemon -r dotenv/config src/index .js "





/*
approach1 
func defination
function connectDB(){

}
function call
connectDB() 
*/

// approach 2 define and execute together (IIFE Immediately Invoked Function Expression)
//   (func defination)(call)

// ;(async ()=>{})()       //a semicolon is written at first just cause if the above code has not ended with a semicolon it might caus eproblem // so it is just a precaution 





// CONNENCTING A DATABASE (directly in index.js along with creating express app)

/*

const app =express() 

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) ;
        app.on("error" , (error)=>{
            console.log("erorr")
            throw error 
        })

        app.listen(process.env.PORT ,()=>{
            console.log(`app is listening on ${process.env.PORT}`)
        })
    }catch(error){
        console.error("Error : " , error) ;

    }
})()
*/



const port = process.env.PORT ; 

//another way when logic is written in DB folder and we just run a func here 
// also note that a asyn metod returns a promise so u can push .then() ans .catch()
connectDB()
.then(()=> {
    app.listen(port  , ()=>{
        console.log(`Server listening at : ${port}`)
    })
})
.catch((err) => {
    console.log("mongob connection failed" , err);
})
