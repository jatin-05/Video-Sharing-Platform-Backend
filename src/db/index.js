import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // connectionInstance store the response after the connection gets done 
        console.log(`\n mongodb conneted , DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongodb connection error ", error )
        process.exit(1)  // study about this 
    }
}

export default connectDB 