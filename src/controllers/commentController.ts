import {Request, Response} from 'express'
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { AppError } from "../utils/AppError";


export const Write_A_Comment = async (req: Request, res:Response) => {
    try {

        const post = await Post.findById(req.params.postID)
        if(!post){
            throw new Error ('No post with such ID')
        }
        const comment = {
            author : req.user.username,
            content : req.body.content
        }
        post.totalNumberOfCommets += 1
        post.comments.push(comment)
        await post.save()
          res.status(200).json ({
            status : "success",
            data : {
                comment
            }
        })
    }
    catch (err) {
        AppError(res, 400, err as String)
    }
}

