import { Request } from 'express';
import {v2 as cloudinary} from 'cloudinary'
import streamifier from 'streamifier'

export const uploadFromBuffer = (req: Request) => {

    return new Promise((resolve, reject) => {
 
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        {
            folder: "profilePics"
        },
       (error: any, result: any) => {
 
         if (result) {
           resolve(result);
         } else {
           reject(error);
          }
        }
      );
 
      streamifier.createReadStream(req.file!.buffer).pipe(cld_upload_stream);
    });

 };