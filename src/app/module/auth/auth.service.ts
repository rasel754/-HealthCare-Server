import { Role, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUser.interface";
import jwtUtils from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

/** Interface representing the registration payload for a Patient. */
interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

/**
 * Service to register a new Patient user.
 *
 * Workflow:
 * 1. Creates an email user account using Better-Auth with role PATIENT.
 * 2. Creates corresponding Patient record in the database using a transaction.
 * 3. Generates JWT access & refresh tokens.
 * 4. Rolls back (deletes) the registered auth user if database record creation fails.
 *
 * @param payload - Patient registration details (name, email, password).
 * @returns Registration data, patient profile, and JWT tokens.
 */
const registerPatient = async (payload: IRegisterPatientPayload) => {
    let createdUserId: string | undefined;
    try {
        const { name, email, password } = payload;

        // Step 1: Create auth credentials via Better-Auth
        const data = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                role: Role.PATIENT,
            },
        });
        if (!data.user) {
            throw new AppError(status.BAD_REQUEST, "Failed to register patient");
        }
        createdUserId = data.user.id;

        // Step 2: Create Patient record in Prisma transaction
        const patient = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: name,
                    email: payload.email,
                },
            });
            return patientTx;
        });

        // Step 3: Issue access & refresh tokens
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });
        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            patient,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error("Error in patient registration:", error);

        // Step 4: Cleanup rollback if failure occurs
        if (createdUserId) {
            await prisma.user.delete({
                where: {
                    id: createdUserId,
                },
            });
        }
        throw error;
    }
};

/** Interface representing login credentials payload. */
interface ILoginUserPayload {
    email: string;
    password: string;
}

/**
 * Service to authenticate user login credentials.
 *
 * Workflow:
 * 1. Authenticates email and password using Better-Auth.
 * 2. Checks account status (throws AppError if BLOCKED or DELETED).
 * 3. Issues fresh JWT access and refresh tokens.
 *
 * @param payload - User login credentials (email, password).
 * @returns User auth details and JWT tokens.
 * @throws AppError - 400 Bad Request if account is blocked or deleted.
 */
const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    // Step 1: Authenticate credentials via Better-Auth
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });

    // Step 2: Validate account status flags
    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.BAD_REQUEST, "Account is blocked");
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.BAD_REQUEST, "Account is deleted");
    }

    // Step 3: Generate tokens
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken,
    };
};

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    medicalReports: true,
                    reviews: true,
                     prescriptions : true,
                    patientHealthData:true,
                    
                }
            },
            doctor: {
                include: {
                    specialties: true,
                    appointments:true,
                    reviews:true,
                    
                }
            },
            admin:true
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return isUserExists;
}



const getNewToken = async (refreshToken: string, sessionToken: string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
            
        },
        include :{
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.NOT_FOUND , "invalid session token")
    }


    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken , envVars.REFRESH_TOKEN_SECRET)

    if(!verifiedRefreshToken.success){
        throw new AppError(status.UNAUTHORIZED , "Invalid Refresh Token")
    }
   const data = verifiedRefreshToken.data as JwtPayload;

   const newAccessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const {token} = await prisma.session.update({
        where:{
            token : sessionToken
        },
        data : {
            token:sessionToken,
            expiresAt: new Date(Date.now() + 60*60*60*24*1000),
            updatedAt:new Date()
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken:token
    }
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken
};
