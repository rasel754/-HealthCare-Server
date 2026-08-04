import { Response } from "express";

interface IResposnseData<T> {
    httpStatusCode: number,
    success: boolean,
    message: string,
    data?: T
}



export const sendResponse = <T>(
    res:Response,
    responseData:IResposnseData<T>

) => {
    const { httpStatusCode, success, message, data } = responseData
    res.status(httpStatusCode).json({
        success,
        message,
        data
    })
}