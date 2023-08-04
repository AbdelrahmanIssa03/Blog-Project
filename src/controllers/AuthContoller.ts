import {Request, Response} from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { isJSDocUnknownTag } from 'typescript';
import { User } from '../models/userModel';
import { jwtVerifyPro } from '../utils/jwtVerifyPromise';

export const Protect = async (req: Request, res: Response, next:any) : Promise<any> => {
    try {
        let token;
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
            return res.status(401).json ({
                status : "Unauthorized",
                message : "You must be logged in to access this feature"
            })
        }
        token = req.headers.authorization.split(" ")[1];
        const decoded = await jwtVerifyPro(token, process.env.JWT_SECRET_KEY)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser){
            return res.status(401).json({
                status : "failed",
                message : "The user no longer exists"
            })
        }
        next();
    }
    catch (err : any) {
        if (err.name === 'TokenExpiredError'){
            res.status(401).json ({
                status : "failed",
                message : "The token has expired"
            })
        }
        else if (err.name === 'JsonWebTokenError'){
            res.status(401).json({
                status : "failed",
                message : "Invalied token"
            })
        }
    }
}
