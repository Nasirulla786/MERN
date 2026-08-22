import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  createStory,
  deleteStory,
  getStories,
} from "../controllers/story.controller.js";

const storyRouter = express.Router();

storyRouter.post("/upload-story", isAuth, upload.single("media"), createStory);
storyRouter.get("/get-stories", isAuth, getStories);
storyRouter.delete("/delete-stories/:id", isAuth, deleteStory);

export default storyRouter;
