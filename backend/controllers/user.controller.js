import uploadOnImageKit from "../config/uploadOnImageKit.js";
import User from "../models/user.model.js";

export const currentUser = async (req, res) => {
  try {
    const userID = req.userId;

    const currentUser = await User.findById(userID);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current user fetched successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("CurrentUser controller Error", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const editProfile = async (req, res) => {
  try {

    const userId = req.userId;


    const currentUser = await User.findById(userId);


    if (!currentUser) {
      return res.status(404).json({
        message: "User not found  Please login first",
      });
    }


    const { bio } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnImageKit(req.file);
      if (!image) {
        return res.status(500).json({
          message: "Image upload failed",
        });
      }

      currentUser.dp = image;
    }

    if (bio != undefined) {
      currentUser.bio = bio;
    }

    await currentUser.save();

    return res.status(200).json({
      user:currentUser, message: "Profile Update successfully",
    });
  } catch (error) {
    console.error("editProfile controller Error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
