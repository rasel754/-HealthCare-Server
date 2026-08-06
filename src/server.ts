import app from "./app";
import { envVars } from "./config/env";




const bootstrap = () => {
    try {
        app.listen(envVars.PORT || 5000, () => {
            console.log( `Server is running on port ${envVars.PORT || 5000}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }   
}

bootstrap();