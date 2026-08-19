import express from "express";
import isAuth from "../middleware/isAuth.js";
import { currentUser, editProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, currentUser);
userRouter.get("/edit-profile", isAuth, editProfile);

export default userRouter;
