import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateSuperAdminPayload } from "./superAdmin.interface";

const getAllSuperAdmins = async () => {
    return prisma.superAdmin.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
        },
    });
};

const getSuperAdminById = async (id: string) => {
    const superAdmin = await prisma.superAdmin.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
            },
        },
    });

    if (!superAdmin) {
        throw new AppError(status.NOT_FOUND, "Super Admin not found");
    }

    return superAdmin;
};

const updateSuperAdmin = async (id: string, payload: IUpdateSuperAdminPayload) => {
    const existingSuperAdmin = await prisma.superAdmin.findUnique({
        where: { id, isDeleted: false },
    });

    if (!existingSuperAdmin) {
        throw new AppError(status.NOT_FOUND, "Super Admin not found");
    }

    return prisma.$transaction(async (tx) => {
        if (payload.name) {
            await tx.user.update({
                where: { id: existingSuperAdmin.userId },
                data: { name: payload.name },
            });
        }

        const updatedSuperAdmin = await tx.superAdmin.update({
            where: { id },
            data: payload,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });

        return updatedSuperAdmin;
    });
};

const softDeleteSuperAdmin = async (id: string) => {
    const superAdmin = await prisma.superAdmin.findUnique({
        where: { id },
    });

    if (!superAdmin) {
        throw new AppError(status.NOT_FOUND, "Super Admin not found");
    }

    if (superAdmin.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Super Admin is already deleted");
    }

    return prisma.superAdmin.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};

export const SuperAdminService = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    softDeleteSuperAdmin,
};
