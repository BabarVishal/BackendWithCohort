import{v2 as cloudinary} from "cloudinary"
import fs from "fs"
                   
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadedOnCloudanary = async (localFilepath) =>{
    try {
        if(!localFilepath) return null
         //upload the file on cloudanary!
        const responce = await cloudinary.uploader.upload(localFilepath, {
            resource_type:"auto"
         })
             //file has ben uploaded successfull
             console.log("file uploded is Done!", responce.url)
             return responce;
    } catch (error) {
        //remove the locally saved temporary file as uploder goy fail
        fs.unlinkSync(localFilepath)
        return null;
    }
}

export {uploadedOnCloudanary}