import dotenv from "dotenv";
dotenv.config();


interface envConfig {
    PORT: string,
    NODE_ENV: string,
    BETTER_AUTH_SECRET: string,
    BETTER_AUTH_URL: string,
    DATABASE_URL: string,

}


const loadEnvVariable = (): envConfig => {
    const requireEnvVariable = [
        'PORT',
        'NODE_ENV',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'DATABASE_URL',
    ];

    requireEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is not defined in .env file`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,

    }
}

export const envVars = loadEnvVariable()