import express from "express"
import { addComment, getAllComments, getAllPosts, getCurrentUserPosts, handleLike, myPosts, uploadPost } from "../controllers/post.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";


const postRouter = express.Router();

postRouter.post("/upload-post",isAuth, upload.single("image"), uploadPost)
postRouter.get("/get-current-user-post",isAuth, getCurrentUserPosts)
postRouter.get("/get-all-post", isAuth, getAllPosts)
postRouter.get("/like/:id", isAuth, handleLike)
postRouter.post("/add-comment/:id", isAuth, addComment)
postRouter.get("/get-comments/:id", isAuth, getAllComments)
postRouter.get(
    "/my-posts",
    isAuth,
    myPosts
);



export default postRouter
