import express from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js"
import isAuth from "../middleware/isAuth.js"

const authRouter = express.Router()


authRouter.post("/register-user",registerUser)
authRouter.post("/login-user",loginUser)
authRouter.get("/logout-user",logoutUser)


export default authRouter
