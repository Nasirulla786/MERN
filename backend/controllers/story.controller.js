    import fs from "fs";
    import Story from "../models/story.model.js";
    import uploadOnImageKit from "../config/uploadOnImageKit.js";

    export const createStory = async (req, res) => {
    try {

        if (!req.file) {
        return res.status(400).json({
            message: "Story media is required",
        });
        }


//   console.log("FILE SIZE:", req.file.size);
// console.log("FILE PATH:", req.file.path);
// console.log("FILE NAME:", req.file.originalname);

    const result = await uploadOnImageKit(req.file);
    console.log("this is res",result)
    if (!result) {
        return res.status(500).json({
          message: "Story media upload failed",
        });
      }
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

        const story = await Story.create({
        user: req.userId,
        mediaUrl: result,
        mediaType,
        });

        // fs.unlinkSync(req.file.path);

        return res.status(201).json({
        message: "Story created successfully",
        story,
        });
    } catch (error) {
        console.log("Create story error:", error);

        return res.status(500).json({
        message: "Error while creating story",
        error: error.message,
        });
    }
    };




    export const getStories = async (req, res) => {
        try {

            const stories = await Story.find({
                expiresAt: { $gt: new Date() }
            })
            .populate("user", "username dp")
            .sort({ createdAt: -1 });

            return res.status(200).json({
                message: "Stories fetched successfully",
                stories
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Failed to fetch stories"
            });
        }
    };



    export const deleteStory = async (req, res) => {
        try {

            const { id } = req.params;

            const story = await Story.findById(id);

            if (!story) {
                return res.status(404).json({
                    message: "Story not found"
                });
            }

            if (story.user.toString() !== req.userId.toString()) {
                return res.status(403).json({
                    message: "You can only delete your own story"
                });
            }

            await Story.findByIdAndDelete(id);

            return res.status(200).json({
                message: "Story deleted successfully"
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Failed to delete story"
            });
        }
    };
