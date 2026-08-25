import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;

    // jis user ko message bhejna hai
    const receiverId = req.params.id;

    // message frontend se aayega
    const { message } = req.body;

    if (!userId || !receiverId) {
      return res.status(400).json({
        message: "Sender and receiver are required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const messageCreate = await Message.create({
      sender: userId,
      receiver: receiverId,
      message: message.trim(),
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: messageCreate,
    });
  } catch (error) {
    console.error("Send message error", error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};



export const getMessages = async (req, res) => {

    try {

        const userId = req.userId;

        const friendId = req.params.id;


        if (!userId || !friendId) {
            return res.status(400).json({
                message: "User id and friend id are required"
            });
        }


        const messages = await Message.find({

            $or: [

                {
                    sender: userId,
                    receiver: friendId
                },

                {
                    sender: friendId,
                    receiver: userId
                }

            ]

        }).sort({ createdAt: 1 });


        return res.status(200).json({

            message: "Messages fetched successfully",

            data: messages

        });


    } catch (error) {

        console.error("Get messages error", error);

        return res.status(500).json({
            message: "Internal Server error"
        });

    }

};




export const getChatUsers = async (req, res) => {
    try {
        const currentUserId = req.userId;

        // Current user ke saare messages
        const messages = await Message.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ createdAt: -1 });

        // Har user ki sirf latest message rakhni hai
        const latestMessages = new Map();

        for (const message of messages) {

            const otherUserId =
                message.sender.toString() === currentUserId.toString()
                    ? message.receiver.toString()
                    : message.sender.toString();

            if (!latestMessages.has(otherUserId)) {
                latestMessages.set(otherUserId, message);
            }
        }

        // Chat wale users ki IDs
        const userIds = [...latestMessages.keys()];

        // Users ki details
        const users = await User.find({
            _id: { $in: userIds }
        }).select("_id username dp");

        // User + latest message combine
        const chatUsers = users.map((user) => ({
            _id: user._id,
            username: user.username,
            dp: user.dp,
            lastMessage: latestMessages.get(user._id.toString())
        }));

        // Latest message ke according sort
        chatUsers.sort(
            (a, b) =>
                new Date(b.lastMessage.createdAt) -
                new Date(a.lastMessage.createdAt)
        );

        return res.status(200).json({
            message: "Chat users fetched successfully",
            users: chatUsers
        });

    } catch (error) {
        console.error("Get chat users error:", error);

        return res.status(500).json({
            message: "Failed to fetch chat users"
        });
    }
};
