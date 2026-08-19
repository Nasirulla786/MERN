import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb server run")


    } catch (error) {
        console.error("Database Error",error)

    }
}

export default connectDb
