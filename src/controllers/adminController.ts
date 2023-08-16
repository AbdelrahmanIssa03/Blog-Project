import { User } from "../models/userModel";
import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { Post } from './../models/postModel' 
import { updatePost_CommentAfterDelete, filterObj } from "./userController";
import { uploadFromBuffer } from "../utils/cloudinaryFunctions";

export const viewAllUsersData = async(req: Request, res : Response) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({
            status : "Success",
            data : {
                allUsers
            }
        })
    }
    catch (err){
        AppError(res,400,err as string)
    }
}
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.ID)
        if(!user){
            throw new Error ('No user with such ID')
        }
        const posts = await Post.find()
        await updatePost_CommentAfterDelete(req, posts, user.username!)
        await User.findByIdAndRemove(req.params.ID)
        res.status(204).json({
            status : "Success"
        })
    }
    catch (err){
        AppError(res, 400, err as string)
    }
}

export const changeUserPass = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.ID)
        if(!user){
            throw new Error ('No user with such ID')
        }
        if(!req.body.password){
            throw new Error ('Please enter a new password')
        }
        user.password = req.body.password
        user.passwordChangedAt = new Date()
        await user.save({validateBeforeSave : true})
        res.status(200).json ({
            status : "Success",
            data : {
                user
            }
        })
    }
    catch(err) {
        AppError(res, 400,err as string)
    }
}

export const updateUser = async (req: Request, res:Response) => {
    try {
        if(Object.keys(req.body).length === 0 && !req.file){
            throw new Error ('Please enter the fields you want to update')
        }
        const user = await User.findById(req.params.ID)
        if(!user){
            throw new Error('No user with such ID')
        }
        const FilteredFields = filterObj(req.body, "email","username","description","age", "hobbies")
        const updatedUser = await User.findByIdAndUpdate(req.params.ID, FilteredFields, {
            new : true,
            runValidators : true,
        })
        if(req.file){
            const image :any = await uploadFromBuffer(req)
            updatedUser!.image = image.secure_url
            await updatedUser!.save({validateBeforeSave : false})           
        }
        res.status(200).json({
            status : "Success",
            data : {
                newUser : updatedUser
            }
        })
    }
    catch(err){
        AppError(res,400,err as string)
    }
}