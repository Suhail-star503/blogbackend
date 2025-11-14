
import mongoose from "mongoose";

const connectUsingMongoose=async()=>{
    try{
        await mongoose.connect(process.env.DB_HOST);
        console.log("Mongoose is connected");

    }catch(err){
        console.log(err);
    }
}
export default connectUsingMongoose;