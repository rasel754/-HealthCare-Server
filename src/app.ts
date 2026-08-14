import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import { indexRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", indexRouter)



// Basic route
// app.get('/', async (req: Request, res: Response) => {
// throw new AppError(status.BAD_REQUEST,"just testin error handeler ")

//   res.status(200).json({
//     success: true,
//     message: "Specialty created successfully",
//     data: specialty
//   })
// });



app.use(globalErrorHandler)

app.use(notFound)

export default app;