import {Request, Response} from 'express'
import { Post } from './../models/postModel'
import { User } from '../models/userModel'
import { AppError } from '../utils/AppError'

export const viewAllPosts = async (req: Request, res: Response) : Promise<any> => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            status : "success",
            data : {
                posts
            }
        })
    }catch(err) {
        AppError(res, 400, err as String);
    }
}

export const viewUserPosts = async (req: Request, res: Response) : Promise<any>=> {
    try {
        const posts = await Post.find({ author : req.params.user})
        if (posts.length == 0){
            throw new Error ('No user found with this username or this user hasn\'t published anything')
        }
        res.status(200).json({
            status:"success",
            data : {
                posts
            }
        })
    }
    catch (err) {
        AppError(res, 404, err as String);
    }
}

export const createPost = async (req: Request, res: Response) : Promise<any> => {
    try {
        const post = await Post.create({
            author : req.user.username,
            content : req.body.content,
        })
        res.status(200).json({
            status : "success",
            postDetails : {
                author : req.user.username,
                content : post.content,
                NumberOfComments : post.totalNumberOfCommets,
                comments : post.comments
            }
        })
    }
    catch (err) {
        AppError(res, 400, err as String);
    }
}

