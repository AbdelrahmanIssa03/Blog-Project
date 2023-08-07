import {Request ,Response} from 'express'
import { User } from '../models/userModel';
import { jwtVerifyPro } from '../utils/jwtVerifyPromise';
import { AppError } from '../utils/AppError';

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
        req.user = currentUser
        next();
    }
    catch (err : any) {
        AppError(res, 400, err)
    }
}
