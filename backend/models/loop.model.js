import mongoose from "mongoose";
const loopSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    media: {
      type: String,
    },

    caption:{
      type:String
    },

    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
    ,

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


  },
  { timestamps: true }
);


const Loop = mongoose.model("loop",loopSchema);
export default Loop;
