import { email, string } from "better-auth";
import { Role, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
    name: string,
    email: string,
    password: string
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role: Role.PATIENT,
        }
    })
    if (!data.user) {
        throw new Error("Fialed to register patient");
    }

    // const patient = await prisma.$transaction(async (tx) => {

    // })


    return data

}

interface ILoginUserPayload {
    email: string,
    password: string,

}


const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })
   if(data.user.status === UserStatus.BLOCKED){
    throw new Error("Account is blocked");
   }
   if(data.user.isDeleted ||data.user.status === UserStatus.DELETED){
    throw new Error("Account is deleted");
   }

    return data.user
}


export const AuthService = {
    registerPatient,
    loginUser
}