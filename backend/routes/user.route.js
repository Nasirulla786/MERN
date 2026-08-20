import express from "express";
import isAuth from "../middleware/isAuth.js";
import { currentUser, editProfile } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, currentUser);
userRouter.post("/edit-profile", isAuth, upload.single("image"), editProfile);

export default userRouter;
