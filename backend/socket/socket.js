import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://snapgram-5f9m.onrender.com"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      console.log("User joined:", userId);
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-message" ,({senderId, receiverId, message })=>{

      const receiverSocketId = onlineUsers.get(receiverId)
      if (!receiverSocketId) {
        console.log("Receiver is offline");
        return;
    }

    const receiver = io.to(receiverSocketId)
    receiver.emit("receiver-message",{
      sender:senderId,
      receiver: receiverId,
      message

    })



    })



  });

  return io;
};
