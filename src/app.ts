import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { indexRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", indexRouter)



// Basic route
app.get('/', async (req: Request, res: Response) => {

  const specialty = await prisma.specialty.create({
    data: {
      title: "cardiology"
    }
  })

  res.status(200).json({
    success: true,
    message: "Specialty created successfully",
    data: specialty
  })
});



app.use(globalErrorHandler)

app.use(notFound)

export default app;