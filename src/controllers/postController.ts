import {Request, Response} from 'express'
import { Post } from './../models/postModel'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { jwtVerifyPro } from '../utils/jwtVerifyPromise'

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
        console.log(err)
        res.status(400).json ({
            status : "failed",
            message : `Something went wrong : ${err}`
        })
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
        console.log(err)
        res.status(400).json ({
            status : "failed",
            message : `Something went wrong : ${err}`
        })
    }
}

export const createPost = async (req: Request, res: Response) : Promise<any> => {
    try {
        let token = req.headers.authorization?.split(" ")[1]
        const decoded = await jwtVerifyPro(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(decoded.id)
        const post = await Post.create({
            author : user?.username,
            content : req.body.content,
            totalNumberOfCommets : 0,
            comments : []
        })
        const postObj = {
            _id : post._id,
            content : post.content,
            totalNumberOfComments : post.totalNumberOfCommets,
            comments : post.comments
        }
        const increment = await user?.updateOne({ $inc : {totalNumberOfPosts : 1}})
        const postsArray = await user?.updateOne({ $push : {posts : postObj}})
        res.status(200).json({
            status : "success",
            postDetails : {
                post : {
                    content : post.content,
                    NumberOfComments : post.totalNumberOfCommets,
                    comments : post.comments
                }
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json ({
            status : "failed",
            message : `Something went wrong : ${err}`
        })
    }
}

