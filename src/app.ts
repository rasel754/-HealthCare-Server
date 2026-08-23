import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { indexRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from "cors";
import { envVars } from './config/env';
import qs from "qs";


const app: Application = express();
app.set("query parser", (str:string)=>qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`))


app.post("/webhook",express.raw({type:"application/json"}),(req,res)=>{
    console.log("webhook recived",req.body);
    res.send(200).json({recieved:true})
})


app.use(cors({
    origin : [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))


app.use("/api/auth",toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", indexRouter)
app.use(express.urlencoded({extended:true}));



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