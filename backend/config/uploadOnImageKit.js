import imageKit from "./imagekit.js";
import fs from "fs";

const uploadOnImageKit = async (file) => {
  try {
    const buffer = await fs.promises.readFile(file.path);
    const res = await imageKit.files.upload({
      file: buffer.toString("base64"),
      fileName: file.originalname,
      folder: "public",
    });

    fs.unlinkSync(file.path);
    return res.url;
  } catch (error) {
    console.error("Image kit upload error", error);
    return null;
  }
};

export default uploadOnImageKit;
