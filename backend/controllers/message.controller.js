import Message from "../models/message.model.js";

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
