import { NextFunction, Request, Response } from "express";

export const profileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
        try {
            const parsed = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
            req.body = { ...parsed, ...req.body };
            delete req.body.data;
        } catch (e) {
            // Keep body as is
        }
    }
    const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined } | undefined;
    if (req.file?.path) {
        req.body.profilePhoto = req.file.path;
    } else if (files?.profilePhoto?.[0]?.path) {
        req.body.profilePhoto = files.profilePhoto[0].path;
    }
    next();
};
