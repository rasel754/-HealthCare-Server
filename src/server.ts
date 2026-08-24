import app from "./app";
import { seedSuperAdmin } from "./app/utils/seed";
import { envVars } from "./config/env";




const bootstrap = async () => {
    try {
        await seedSuperAdmin();
        app.listen(envVars.PORT || 5000, () => {
            console.log( `Server is running on port ${envVars.PORT || 5000}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }   
}

bootstrap();