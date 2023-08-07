import {User} from './../models/userModel'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from '../utils/AppError'
export const SignUp = async (req: Request, res: Response) : Promise<void> => {
    try {
        const newUser = await User.create({
            email : req.body.email,
            password : req.body.password,
            username : req.body.username,
            image : req.body.image,
            age : req.body.age,
            description : req.body.description,
            hobbies : req.body.hobbies
        })
        const authToken = await jwt.sign({id : req.body._id}, process.env.JWT_SECRET_KEY!, {expiresIn : "90d"})
        res.status(201).json ({
            status : "Success",
            jwt : authToken,
            data : {
                Information : newUser
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
        const authToken = await jwt.sign({id : user._id}, process.env.JWT_SECRET_KEY!, {expiresIn : "90d"})
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
