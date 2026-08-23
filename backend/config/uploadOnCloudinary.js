import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
  });






  const uploadOnCloudinary = async (file) => {
    try {

        console.log("FILE PATH:", file);

        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        });

        console.log("CLOUDINARY RESULT:", result);

        fs.unlinkSync(file);

        return result.secure_url;

    } catch (error) {

        console.log("STATUS:", error.http_code);
        console.log("MESSAGE:", error.message);
        console.log("FULL ERROR:", error);

        return null;
    }
};


export default uploadOnCloudinary
