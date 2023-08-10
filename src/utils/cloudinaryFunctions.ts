import {v2 as cloudinary} from 'cloudinary'

export const uploadImage = async (imagePath : string) => {
    try {
        const x = await cloudinary.uploader.upload(imagePath)
        console.log(x)
    }
    catch (err) {
        console.log(err)
    }
    
}