import { Comment } from "../models/commentModel";
import {Request, Response} from 'express'
import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import { AppError } from "../utils/AppError";
import { jwtVerifyPro } from "../utils/jwtVerifyPromise";


export const Write_A_Comment = async (req: Request, res:Response) => {
    try {
        const user = await User.findOne({username : req.params.user})
        if (!user) {
            throw new Error ("No user with such username");
        }
        const index = parseInt(req.params.postIndex)
        if(Number.isNaN(index) || index >= user.posts.length) {
            throw new Error ("The index input must be a number and between the range of the user posts")
        }
        const token = req.headers.authorization?.split(" ")[1]
        const decoded = await jwtVerifyPro(token, process.env.JWT_SECRET_KEY);
        const author = await User.findById(decoded.id) 
        const comment = {
            author : author!.username,
            content : req.body.content
        }
        const post = user?.posts[index]
        await Post.updateOne({_id : post._id}, {$inc : {totalNumberOfCommets : 1}, $push : {comments : comment}})
        await User.updateOne({ username : req.params.user, "posts._id" : `${post._id}`}, {$inc : {"posts.$.totalNumberOfComments": 1}, $push : {"posts.$.comments" : comment}})
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

