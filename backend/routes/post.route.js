import express from "express"
import { getAllPosts, getCurrentUserPosts, uploadPost } from "../controllers/post.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";


const postRouter = express.Router();

postRouter.post("/upload-post",isAuth, upload.single("media"), uploadPost)
postRouter.get("/get-current-user-post",isAuth, getCurrentUserPosts)
postRouter.get("/get-all-post", getAllPosts)



export default postRouter
