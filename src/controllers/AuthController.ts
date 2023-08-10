import {Request ,Response} from 'express'
import { User } from '../models/userModel';
import { jwtVerifyPro } from '../utils/jwtVerifyPromise';
import { AppError } from '../utils/AppError';
import  bcrypt from 'bcrypt' 
import { app } from '../app';

export const Protect = async (req:Request, res: Response, next:any) : Promise<any> => {
    try {
        let token;
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
            throw new Error ('You must be logged in to access this feature')
        }
        token = req.headers.authorization.split(" ")[1];
        const decoded = await jwtVerifyPro(token, process.env.JWT_SECRET_KEY)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser){
            throw new Error ('The user no longer exists')
        }
        if(currentUser.passwordChangedAt){
            const changedTimestamp = parseInt(`${currentUser.passwordChangedAt.getTime() / 1000}` , 10);
            if (changedTimestamp > decoded.iat){
                throw new Error ('Password has been changed please re log-in')
            }
        }        
        req.user = currentUser
        next();
    }
    catch (err : any) {
        AppError(res, 401, err)
    }
}

export const AdminAuth = async(req: Request, res: Response, next:any) => {
    try {
        const user = await User.findById(req.user.id).select('+admin')
        if (user!.admin){
            next();
        }
        else {
            throw new Error ('You must be an admin to access this feature')
        }
    }
    catch (err) {
        AppError(res,400,err as string)
    }
}
