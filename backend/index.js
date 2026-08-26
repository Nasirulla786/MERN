import http from "http"
import { initializeSocket } from "./socket/socket.js";


import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import storyRouter from "./routes/story.route.js";
import loopRouter from "./routes/loop.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
initializeSocket(server);



app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", storyRouter);
app.use("/api", loopRouter);
app.use("/api", messageRouter);

server.listen(PORT, async () => {
  await connectDb();
  console.log("Server is running at " + PORT);
});
