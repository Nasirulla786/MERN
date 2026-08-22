import imageKit from "./imagekit.js";
import fs from "fs";

const uploadOnImageKit = async (file) => {
  try {
    const buffer = await fs.promises.readFile(file.path);
    console.log("BUFFER SIZE:", buffer.length);
    const res = await imageKit.files.upload({
      file: buffer.toString("base64"),
      fileName: file.originalname,
      folder: "public",
    });

    fs.unlinkSync(file.path);
    return res.url;
  } catch (error) {
    console.log("IMAGEKIT ERROR:", error);
    console.log("MESSAGE:", error.message);
    return null;
  }
};

export default uploadOnImageKit;
