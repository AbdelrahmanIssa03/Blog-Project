import { Response } from "express"

export const AppError = (res: Response, statusCode: number, message: String) : void=> {
    res.status(statusCode).json({
        status : "Failed",
        message : `Something went wrong : ${message}`
    })
}