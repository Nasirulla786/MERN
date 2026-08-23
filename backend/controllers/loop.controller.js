import uploadOnCloudinary from "../config/uploadOnCloudinary.js";
import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";

export const uploadLoop = async (req, res) => {
    try {
        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Media is required"
            });
        }

        const media = await uploadOnCloudinary(req.file.path);

        const loop = await Loop.create({
            caption,
            media,
            author: req.userId,
        });


        const populatedLoop = await Loop.findById(loop._id).populate(
            "author",
            "username dp"
        );

        return res.status(200).json(populatedLoop);

    } catch (error) {
        console.error("Upload Loop Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


export const getAllLoops = async (req, res) => {
    try {
        const loops = await Loop.find({}).populate(
            "author",
            "username dp"
        );

        return res.status(200).json(loops);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const Like = async (req, res) => {
  // console.log("hello workd")
    try {
        const loopID = req.params.loopID;
        console.log(loopID)

        const loop = await Loop.findById(loopID);

        if (!loop) {
            return res.status(400).json({
                message: "Loop not found"
            });
        }

        const alreadyLike = loop.like.some(
            (id) => id.toString() === req.userId.toString()
        );

        if (alreadyLike) {
            loop.like = loop.like.filter(
                (id) => id.toString() !== req.userId.toString()
            );
        } else {
            loop.like.push(req.userId);
        }

        await loop.save();

        await loop.populate(
            "author",
            "username dp"
        );

        return res.status(200).json(loop);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export const Comment = async (req, res) => {
    try {
        const loopId = req.params.loopID;
        const { message } = req.body;

        const loop = await Loop.findById(loopId);

        if (!loop) {
            return res.status(400).json({
                message: "Loop not found"
            });
        }

        loop.comments.push({
            author: req.userId,
            message,
        });

        await loop.save();

        await loop.populate([
            {
                path: "author",
                select: "username dp"
            },
            {
                path: "comments.author",
                select: "username dp"
            }
        ]);

        return res.status(200).json(loop);

    } catch (error) {
        console.error("Comment Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
