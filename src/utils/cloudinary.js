import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"  //file system // in node we get file system which help in read write files


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// workflow
// we dont directly upload the image to cloudinary we store it on our server first then upload it 
const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath)return null 
        // upload file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto" //image or video etc here auto to auto detect 
        })
        //file is uploaded 
        console.log("fileis uploaded on cloudinary " , response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        // if file do not get uploaded we want it to be removed from our server now as it can malicious
        fs.unlinkSync(localFilePath)
        return null 
    }
}

export {uploadOnCloudinary}