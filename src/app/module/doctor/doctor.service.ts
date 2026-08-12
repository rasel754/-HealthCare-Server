import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload, IUpdateDoctorSpecialtyPayload } from "./doctor.interface";

export const getAllDoctors = async () => {
    return prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        },
    });
};

const getDoctorById = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });
    if (!result) {
        throw new AppError(status.BAD_REQUEST, 'Doctor not found');
    }
    return result;
};

const getSpecialtiesToUpdate = async (
    tx: any,
    id: string,
    specialties: (string | IUpdateDoctorSpecialtyPayload)[]
) => {
    const doctor = await tx.doctor.findUniqueOrThrow({
        where: { id }
    });
    const existingSpecialties = await tx.doctorSpecialty.findMany({
        where: { doctorId: doctor.id }
    });
    const existingSpecialtyIds = existingSpecialties.map((es: any) => es.specialtyId);

    // Standardize input payload (handles both string array and object array)
    const normalizedSpecialties: IUpdateDoctorSpecialtyPayload[] = specialties.map((s) => {
        if (typeof s === "string") {
            return { specialtyId: s, shouldDelete: false };
        }
        return s;
    });

    const activeInputIds = normalizedSpecialties
        .filter(s => !s.shouldDelete)
        .map(s => s.specialtyId);

    const specialtyIdsToDelete = existingSpecialtyIds.filter(
        (eId: string) => !activeInputIds.includes(eId) || normalizedSpecialties.some(s => s.specialtyId === eId && s.shouldDelete)
    );

    const specialtyIdsToAdd = activeInputIds.filter(
        (eId: string) => !existingSpecialtyIds.includes(eId)
    );

    return {
        specialtyIdsToDelete,
        specialtyIdsToAdd
    };
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    return await prisma.$transaction(async (tx) => {
        const { doctor, specialties } = payload;
        const doctorData = { ...doctor };

        delete (doctorData as any).email;
        delete (doctorData as any).userId;

        // Check if registrationNumber is unique before updating
        if (doctorData.registrationNumber) {
            const existingDoctorWithReg = await tx.doctor.findFirst({
                where: {
                    registrationNumber: doctorData.registrationNumber,
                    NOT: { id }
                }
            });

            if (existingDoctorWithReg) {
                throw new AppError(status.BAD_REQUEST, 'Registration number is already in use by another doctor.');
            }
        }

        // Update user's name if doctor's name changes
        if (doctorData.name) {
            const currentDoctor = await tx.doctor.findUniqueOrThrow({
                where: { id },
                select: { userId: true }
            });
            await tx.user.update({
                where: { id: currentDoctor.userId },
                data: { name: doctorData.name }
            });
        }

        // 1. Update doctor basic info
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: doctorData
        });

        // 2. Update specialties
        if (specialties) {
            const { specialtyIdsToDelete, specialtyIdsToAdd } = await getSpecialtiesToUpdate(tx, id, specialties as any);

            if (specialtyIdsToDelete.length > 0) {
                await tx.doctorSpecialty.deleteMany({
                    where: {
                        doctorId: updatedDoctor.id,
                        specialtyId: { in: specialtyIdsToDelete }
                    }
                });
            }

            if (specialtyIdsToAdd.length > 0) {
                await tx.doctorSpecialty.createMany({
                    data: specialtyIdsToAdd.map((specialtyId: string) => ({
                        doctorId: updatedDoctor.id,
                        specialtyId
                    }))
                });
            }
        }

        // Return updated doctor with relations
        return await tx.doctor.findUnique({
            where: { id: updatedDoctor.id },
            include: {
                user: true,
                specialties: {
                    include: { specialty: true }
                }
            }
        });
    });
};

const deleteDoctor = async (id: string) => {
    return prisma.doctor.delete({
        where: {
            id: id
        }
    });
};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};