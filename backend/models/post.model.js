import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
    },

    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
        },
      },
    ],

    views:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },

      ]
      
  },


  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
