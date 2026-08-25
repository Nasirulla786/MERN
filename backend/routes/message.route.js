import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getChatUsers, getMessages, sendMessage } from "../controllers/message.controller.js";



const messageRouter = express.Router();

messageRouter.post(
    "/message/:id",
    isAuth,
    sendMessage
);
messageRouter.get(
    "/messages/:id",
    isAuth,
    getMessages
);

messageRouter.get( "/chat-users", isAuth, getChatUsers );

export default messageRouter;
