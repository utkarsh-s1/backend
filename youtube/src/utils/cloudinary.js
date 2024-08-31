import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(filePath)=>{
    try {
        if(!filePath){
            return null
        }
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type:"auto"
        })
        console.log("File Uploaded SuccessFully")
        fs.unlinkSync(filePath)
        return response


    } catch (error) {
        fs.unlinkSync(filePath)
        console.log("Error occured in uploadig the file", error)
        return null
    }

}

async function deleteFromCloudinary(fileUrl){
    const regex = /\/image\/upload\/(.+?)\./;
    const match = fileUrl.match(regex);
    const Id = match ? match[1] : null;
    try {
        const response = await cloudinary.uploader.destroy(Id)
        
    } catch (error) {
        console.log(error)
    }



}

export {uploadOnCloudinary, deleteFromCloudinary}