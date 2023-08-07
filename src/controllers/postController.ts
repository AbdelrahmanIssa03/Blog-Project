import {Request, Response} from 'express'
import { Post } from './../models/postModel'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { jwtVerifyPro } from '../utils/jwtVerifyPromise'
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
        const user = await User.findOne({ username : req.params.user})
        if (!user){
            throw new Error ('No user found with this username')
        }
        res.status(200).json({
            status:"success",
            data : {
                posts : user.posts
            }
        })
    }
    catch (err) {
        AppError(res, 400, err as String);
    }
}

export const createPost = async (req: Request, res: Response) : Promise<any> => {
    try {
        const post = await Post.create({
            author : req.user.username,
            content : req.body.content,
        })
        const postObj = {
            _id : post._id,
            content : post.content,
            totalNumberOfComments : post.totalNumberOfCommets,
            comments : post.comments
        }
        await req.user.updateOne({ $inc : {totalNumberOfPosts : 1}, $push : {posts : postObj}})
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

