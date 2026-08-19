import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
dotenv.config()


const PORT = process.env.PORT || 8000

const app = express()


app.use("/api", authRouter)





app.listen(PORT ,async()=>{
    await connectDb()
    console.log("Server is running at " + PORT)


})
