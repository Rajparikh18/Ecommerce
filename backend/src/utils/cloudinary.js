import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// this is the file handling and uploading ......
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  // Upload an image
  const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) return null;
        //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      // file has been uploaded successfull
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file
      console.log("file is uploaded ");
      return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file 
        // as the upload operation got failed
        return null;
      } };
       

  export { uploadOnCloudinary };