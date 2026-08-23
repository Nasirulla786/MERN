import express from "express";
import isAuth from "../middleware/isAuth.js";
import { currentUser, editProfile, fetchAllUsers, fetchMyFriendProfile, followUnfollowUser, handleSearch } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, currentUser);
userRouter.post("/edit-profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/follow/:id", isAuth, followUnfollowUser);
userRouter.get("/friend-profile/:id", isAuth, fetchMyFriendProfile);
userRouter.get("/search", isAuth , handleSearch);
userRouter.get("/all-users", isAuth, fetchAllUsers);

export default userRouter;
