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
      user: currentUser,
      message: "Profile Update successfully",
    });
  } catch (error) {
    console.error("editProfile controller Error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const fetchMyFriendProfile = async (req, res) => {
  try {
      const userId = req.params.id;

      const user = await User.findById(userId)

      if (!user) {
          return res.status(404).json({
              message: "User not found"
          });
      }

      return res.status(200).json({
          message: "Friend profile fetched successfully",
          user
      });

  } catch (error) {
      return res.status(500).json({
          message: error.message
      });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
      const userId = req.userId;
      const targetUserId = req.params.id;

      if (userId.toString() === targetUserId.toString()) {
          return res.status(400).json({
              message: "You cannot follow yourself",
          });
      }

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!user || !targetUser) {
          return res.status(404).json({
              message: "User not found",
          });
      }

      // Check whether already following
      const isFollowing = user.following.some(
          (id) => id.toString() === targetUserId.toString()
      );


      if (isFollowing) {
          user.following = user.following.filter(
              (id) => id.toString() !== targetUserId.toString()
          );

          targetUser.followers = targetUser.followers.filter(
              (id) => id.toString() !== userId.toString()
          );

          await user.save();
          await targetUser.save();

          return res.status(200).json({
              message: "User unfollowed successfully",
              user,
              targetUser,
              check: false,
          });

      } else {


          if (!user.following.some(
                  (id) => id.toString() === targetUserId.toString()
              )
          ) {
              user.following.push(targetUserId);
          }

          if (
              !targetUser.followers.some(
                  (id) => id.toString() === userId.toString()
              )
          ) {
              targetUser.followers.push(userId);
          }

          await user.save();
          await targetUser.save();

          return res.status(200).json({
              message: "User followed successfully",
              user,
              targetUser,
              check: true,
          });
      }

  } catch (error) {
      console.error("FOLLOW ERROR:", error);

      return res.status(500).json({
          message: error.message,
      });
  }
};



export const handleSearch = async (req, res) => {
  try {
      const { query } = req.query;

      const currentUser = await User.findById(req.userId)

      if (!query) {
          return res.status(400).json({
              message: "Search query is required"
          });
      }

      const users = await User.find({
          username: {
              $regex: query,
              $options: "i",
              $ne:currentUser?.username
          }
      })

      return res.status(200).json({
          message: "Users found successfully",
          users
      });

  } catch (error) {
      console.error("Search Error:", error);

      return res.status(500).json({
          message: "Internal Server Error"
      });
  }
};



export const fetchAllUsers = async (req, res) => {
  try {

      const users = await User.find({
          _id: { $ne: req.userId }
      });

      return res.status(200).json({
          message: "All users fetched successfully",
          users
      });

  } catch (error) {

      console.error("Fetch all users error:", error);

      return res.status(500).json({
          message: "Internal Server Error"
      });
  }
};
