import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload } from "./admin.interface";

const getAllAdmins = async () => {
    return prisma.admin.findMany({
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

const getAdminById = async (id: string) => {
    const admin = await prisma.admin.findUnique({
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

    if (!admin) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
    const existingAdmin = await prisma.admin.findUnique({
        where: { id, isDeleted: false },
    });

    if (!existingAdmin) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    return prisma.$transaction(async (tx) => {
        if (payload.name) {
            await tx.user.update({
                where: { id: existingAdmin.userId },
                data: { name: payload.name },
            });
        }

        const updatedAdmin = await tx.admin.update({
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

        return updatedAdmin;
    });
};

const softDeleteAdmin = async (id: string) => {
    const admin = await prisma.admin.findUnique({
        where: { id },
    });

    if (!admin) {
        throw new AppError(status.NOT_FOUND, "Admin not found");
    }

    if (admin.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Admin is already deleted");
    }

    return prisma.admin.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};

export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin,
};
