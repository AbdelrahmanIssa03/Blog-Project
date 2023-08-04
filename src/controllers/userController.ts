import {User} from './../models/userModel'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { jwtVerifyPro } from '../utils/jwtVerifyPromise'
export const SignUp = async (req: Request, res: Response) : Promise<void> => {
    try {
        const newUser = await User.create({
            email : req.body.email,
            password : req.body.password,
            username : req.body.username,
            DateOfBirth : req.body.DateOfBirth,
            gender : req.body.gender,
            totalNumberOfPosts : req.body.totalNumberOfPosts,
            posts : req.body.posts
        })
        const authToken = await jwt.sign({id : req.body._id}, process.env.JWT_SECRET_KEY!, {expiresIn : "90d"})
        res.status(201).json ({
            status : "Successful",
            jwt : authToken,
            data : {
                Information : newUser
            }
        })
    }
    catch(err) {
        console.log (err);
        res.status(400).json ({
            status : "Failed",
            message : err
        })
    }
}

export const SignIn = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { email, password} = req.body;
        if (!email || !password ) {
            return res.status(400).json ({
                status : "failed",
                message : "Please enter the email and the password"
            })
        }
        const user = await User.findOne({email : email}).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password!))) {
            return res.status(401).json ({
                status : "failed",
                message : "Incorrect email or password"
            })
        }
        const authToken = await jwt.sign({id : user._id}, process.env.JWT_SECRET_KEY!, {expiresIn : "90d"})
        res.status(200).json({
            status : "success",
            token : authToken,
            data : {
                user
            }
        })
    } catch (err) {
        console.log(err) 
    }
}

export const userInformation = async (req: Request, res:Response) => {
    try {
        let token = req.headers.authorization?.split(' ')[1]
        const decoded = await jwtVerifyPro(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        res.status(200).json ({
            status : "success",
            userInformation : {
                user
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            status : "failed",
            message : `something went wrong : Error : ${err}`
        })
    }
}
