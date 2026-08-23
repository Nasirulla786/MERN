import express from "express";
import isAuth from "../middleware/isAuth.js";
import { currentUser, editProfile, fetchMyFriendProfile, followUnfollowUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, currentUser);
userRouter.post("/edit-profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/follow/:id", isAuth, followUnfollowUser);
userRouter.get("/friend-profile/:id", isAuth, fetchMyFriendProfile);

export default userRouter;
