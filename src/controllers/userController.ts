import {User} from './../models/userModel'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from '../utils/AppError'
import { Post } from '../models/postModel'
import { uploadFromBuffer } from '../utils/cloudinaryFunctions'

const cookieOptions : any = {
    expires : new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000),
    httpOnly : true
}

export const filterObj = (obj : any, ...allowedFields : string[]) => {
    let newObj : any= {}
    for (const key in obj){
        if(allowedFields.includes(key)){
            newObj[key] = obj[key]
        }
    }
    return newObj
}

export const updatePost_CommentAfterDelete = async (req: Request, allPosts:any, user_name: string) : Promise<any> => {
    try {
        for (let i = 0; i < allPosts.length; i++){
            if(allPosts[i].author == user_name){
                allPosts[i].author = "Deleted User"
            }
            for(let j = 0 ; j < allPosts[i].comments.length; j++){
                if(allPosts[i].comments[j].author == user_name){
                    allPosts[i].comments[j].author = "Deleted User"
                }
            }
            await allPosts[i].save()
        }
    }
    catch (err){
        return "Something went wrong with updating the posts / comments"
    }
    
}

export const SignUp = async (req: Request, res: Response) :  Promise<void> => {
    try {
        const newUser = await User.create({
            email : req.body.email,
            password : req.body.password,
            username : req.body.username,
            age : req.body.age,
            description : req.body.description,
            hobbies : req.body.hobbies,
        });
        if(req.file){
            const image :any = await uploadFromBuffer(req)
            newUser.image = image.secure_url
            await newUser.save({validateBeforeSave : false}) 
        }
        const authToken = await jwt.sign({id : req.body._id}, process.env.JWT_SECRET_KEY!, {expiresIn : `${process.env.JWT_EXPIRES_IN}`})
        if(process.env.ENV_MODE === 'production'){
            cookieOptions.secure = true
        }
        res.cookie('jwt', authToken,cookieOptions)
        res.status(201).json ({
            status : "Success",
            jwt : authToken,
            data : {
                user : newUser
            }
        })
    }
    catch(err) {
        AppError(res, 400, err as String)
    }
}

export const SignIn = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { Email_Username, password } = req.body;
        
        if (!Email_Username || !password ) {
            throw new Error ('Please enter your email or username and the password')
        }
        const user = await User.findOne({$or : [{email : Email_Username}, {username : Email_Username}]}).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password!))) {
            throw new Error ('Incorrect email or password')
        }
        const authToken = await jwt.sign({id : user._id}, process.env.JWT_SECRET_KEY!, {expiresIn : `${process.env.JWT_EXPIRES_IN}`})
        if(process.env.ENV_MODE === 'production'){
            cookieOptions.secure = true
        }
        res.cookie('jwt', authToken,cookieOptions)
        res.status(200).json({
            status : "Success",
            token : authToken,
            data : {
                user
            }
        })
    } catch (err) {
        AppError(res, 400, err as String)
    }
}

export const userInformation = async (req: Request, res:Response) => {
    try {
        res.status(200).json({
            status : "Success",
            userInformation : {
                email : req.user.email,
                username : req.user.username,
                image : req.user.image,
                age : req.user.age,
                description : req.user.description,
                hobbies : req.user.hobbies
            }
            
        })
    }
    catch (err) {
        AppError(res, 400, err as String)
    }
}

export const changePass = async (req: Request, res: Response) => {
    try {
        
        const user = await User.findById(req.user._id).select('+password')
        const {currentPassword, newPassword, confirmNewPassword} = req.body
        if(!currentPassword || !newPassword || !confirmNewPassword){
            throw new Error('Please fill all the fields : current password / new password / confirm new password')
        }
        const accepted = await bcrypt.compare(currentPassword,user!.password!)
        if(!accepted) {
            throw new Error ("Please enter your valid current password")
        }
        if(newPassword != confirmNewPassword){
            throw new Error ('The passwords are not matching')
        }
        user!.password = newPassword
        user!.passwordChangedAt! = new Date()
        await user!.save({validateBeforeSave : true})
        
        const jwtToken = await jwt.sign({id : user!._id}, process.env.JWT_SECRET_KEY!, {expiresIn : `${process.env.JWT_EXPIRES_IN}`})
        if(process.env.ENV_MODE === 'production'){
            cookieOptions.secure = true
        }
        res.cookie('jwt', jwtToken,cookieOptions)
        res.status(201).json ({
            status : "Success",
            jwt : jwtToken,
            data : {
                user
            }
        })
    }
    catch (err) {
        AppError(res, 400, err as String)
    }
}
export const updateMe = async (req: Request, res: Response, next: any) => {
    try {
        if(req.body.password) {
            throw new Error('this route is not for password updates. Please use /changePassword route')
        }
        const filteredObj = filterObj(req.body, 'username', 'email', 'description', 'hobbies', 'age')
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
            new : true,
            runValidators : true
        })
        if(req.file){
            const image : any = await uploadFromBuffer(req)
            updatedUser!.image = image.secure_url
            updatedUser?.save({validateBeforeSave : false})
        }
        res.status(200).json({
            status : "Success",
            data : {
                UpdatedInfo : updatedUser
            }
        })
    }
    catch (err) {
        AppError(res,400,err as string)
    }
}

export const deleteMe = async (req: Request, res: Response) => {
    try {
        const allPosts = await Post.find()
        await updatePost_CommentAfterDelete(req, allPosts, req.user.username)
        await User.findByIdAndRemove(req.user.id);
        res.status(204).json({
            status : "Success",
            data : null
        })
    }
    catch(err){
        AppError(res,400, err as string)
    }
}
