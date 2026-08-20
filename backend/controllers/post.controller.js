import uploadOnImageKit from "../config/uploadOnImageKit.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


export const uploadPost = async (req, res) => {
    try {

        const { caption, mediaType } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Media is required",
            });
        }

        let media;
        if(req.file){
            const media = await uploadOnImageKit(req.file);
        }

        if (!media) {
            return res.status(400).json({
                message: "Media upload failed",
            });
        }


        const post = await Post.create({
            caption,
            media,
            mediaType,
            author: req.userId,
        });


        user.posts.push(post._id);

        await user.save();

        return res.status(201).json({
            message: "Post created successfully",
            post,
        });

    } catch (error) {

        console.error("Upload post error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const getCurrentUserPosts = async (req, res) => {
    try {

        const userId = req.userId;

        const myPosts = await Post.find({
            author: userId,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts: myPosts,
        });

    } catch (error) {

        console.error(
            "Get current user posts error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



export const getAllPosts = async (req, res) => {
    try {

        const userId = req.userId;

        const allPosts = await Post.find({
            author: {
                $ne: userId,
            },
        })
        .sort({
            createdAt: -1,
        })
        .populate(
            "author",
            "username dp"
        );

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts: allPosts,
        });

    } catch (error) {

        console.error(
            "Get all posts error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
