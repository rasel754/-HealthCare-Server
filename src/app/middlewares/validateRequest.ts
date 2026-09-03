import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            try {
                req.body = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
            } catch (e) {
                // Keep body as is
            }
        }
        const parsedResult = zodSchema.safeParse(req.body);

        if (!parsedResult.success) {
            return next(parsedResult.error);
        }

        // sanitizing the data
        req.body = parsedResult.data;

        next();
    };
};