import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    dp: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    posts:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
      }
    ]
    
  },
  { timestamps: true },
);

userSchema.virtual("fullName").get(function () {
  return this.username[0].toUpperCase() + this.username.slice(1);
});

userSchema.index({
  email: 1,
  username: 1,
});

const User = mongoose.model("User", userSchema);

export default User;
