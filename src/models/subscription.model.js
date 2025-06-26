import mongoose ,{Schema} from "mongoose";
// this is like the dbms table which joins 2 table (not exactly 2 table but u understand my feelings)( a subscriber can subscribe multiple channel and a channel can have multiple subscriber )
const subscriptionSchema = new Schema ({
    subscriber:{
        type: Schema.Types.ObjectId,  // one who is subscribing 
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId,  // one to whom channel is subscribing
        ref:"User"
    }
},{timestamps:true})






export const Subscription = mongoose.model("Subcription" , subscriptionSchema)