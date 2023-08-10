import {v2 as cloudinary} from 'cloudinary'

export const uploadImage = async (imagePath : string, username: string) => {
    try {
        const x = await cloudinary.uploader.upload(imagePath, {
            public_id : username
        })
        console.log(x)
    }
    catch (err) {
        console.log(err)
    }
    
}