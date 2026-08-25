import uploadOnCloudinary from "../config/uploadOnCloudinary.js";
import uploadOnImageKit from "../config/uploadOnImageKit.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption } = req.body;
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
    let mediaType;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
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
    console.error("Get current user posts error:", error);

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
      .populate("author", "username dp");

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts: allPosts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const handleLike = async (req, res) => {
  try {

    const postId = req.params.id;
    const post = await Post.findById(postId);


    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "user not authenticate" });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found..!" });
    }

    const alreadyPost = post.likes.some(
      (userId) => userId.toString() == req.userId.toString(),
    );



    if (alreadyPost) {

      post.likes = post.likes.filter(
        (userId) => userId.toString() != req.userId.toString(),
      );
    } else {

      post.likes.push(req.userId);
    }

    await post.populate("author" ,"username , dp")

    await post.save();

    return res.status(200).json({ post });
  } catch (error) {
    console.error("likes posts error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "user not authenticate" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found..!" });
    }
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Empty Message..." });
    }
    post.comments.push({ author: userId, message });
    await post.populate("comments.author" , "username dp");
    await post.save();

    return res.status(200).json({ post });
  } catch (error) {
    console.error("add comment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const getAllComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("comments.author", "username dp").sort({createdAt:-1});

    if (!post) {
      return res.status(404).json({
        message: "Post not found..!",
      });
    }

    return res.status(200).json({
      comments: post.comments,
    });

  } catch (error) {
    console.error("get all comments error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const myPosts = async (req, res) => {
  try {

      const posts = await Post.find({
          author: req.userId
      }).populate(
          "author",
          "userName dp"
      );

      return res.status(200).json(posts);

  } catch (error) {

      console.error("My Posts Error:", error);

      return res.status(500).json({
          message: "Server error",
          error: error.message
      });

  }
};



export const addPostView = async (req, res) => {
  try {
      const postId = req.params.id;
      const userId = req.userId;

      if (!userId) {
          return res.status(401).json({
              message: "User not authenticated"
          });
      }

      const post = await Post.findById(postId);

      if (!post) {
          return res.status(404).json({
              message: "Post not found"
          });
      }

      // Same user ko dobara view count nahi karna
      if (!post.views.some(id => id.toString() === userId.toString())) {
          post.views.push(userId);
          await post.save();
      }

      return res.status(200).json({
          message: "View added",
          views: post.views.length
      });

  } catch (error) {
      console.error("Add post view error:", error);

      return res.status(500).json({
          message: "Internal server error"
      });
  }
};
