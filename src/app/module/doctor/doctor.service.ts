import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload, IUpdateDoctorSpecialtyPayload } from "./doctor.interface";

/**
 * Service to retrieve all doctors in the database.
 * Includes related user account details and specialty mapping details.
 *
 * @returns Array of doctor objects with nested user and specialties.
 */
export const getAllDoctors = async () => {
    return prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true,
                },
            },
        },
    });
};

/**
 * Service to fetch a single doctor by ID.
 *
 * @param id - The unique UUID of the doctor.
 * @returns The doctor record with nested relations.
 * @throws AppError - 400 Bad Request if no doctor is found with given ID.
 */
const getDoctorById = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError(status.BAD_REQUEST, "Doctor not found");
    }
    return result;
};

/**
 * Helper function to compute the diff of specialties to add or delete for a doctor.
 * Handles input payloads provided either as string array of IDs or objects with `shouldDelete` flags.
 *
 * @param tx - Active Prisma transaction client.
 * @param id - Doctor ID.
 * @param specialties - Array of specialty IDs or specialty update objects.
 * @returns Object containing `specialtyIdsToDelete` and `specialtyIdsToAdd`.
 */
const getSpecialtiesToUpdate = async (
    tx: any,
    id: string,
    specialties: (string | IUpdateDoctorSpecialtyPayload)[]
) => {
    const doctor = await tx.doctor.findUniqueOrThrow({
        where: { id },
    });
    const existingSpecialties = await tx.doctorSpecialty.findMany({
        where: { doctorId: doctor.id },
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
        .filter((s) => !s.shouldDelete)
        .map((s) => s.specialtyId);

    // Determine specialties that need to be removed from the join table
    const specialtyIdsToDelete = existingSpecialtyIds.filter(
        (eId: string) =>
            !activeInputIds.includes(eId) ||
            normalizedSpecialties.some((s) => s.specialtyId === eId && s.shouldDelete)
    );

    // Determine new specialties that need to be inserted into the join table
    const specialtyIdsToAdd = activeInputIds.filter(
        (eId: string) => !existingSpecialtyIds.includes(eId)
    );

    return {
        specialtyIdsToDelete,
        specialtyIdsToAdd,
    };
};

/**
 * Service to update doctor profile information and/or assigned specialties.
 * Uses a Prisma transaction to maintain consistency across tables.
 *
 * Workflow:
 * 1. Sanitizes input to prevent overwriting immutable email/userId fields.
 * 2. Validates uniqueness of registration number if provided.
 * 3. Synchronizes doctor name change with the underlying User table.
 * 4. Updates basic Doctor table record.
 * 5. Diff-updates specialty relations (deleting removed IDs, creating new IDs).
 * 6. Returns updated Doctor record with relations.
 *
 * @param id - Doctor ID.
 * @param payload - Partial doctor details and/or specialties array.
 * @returns Updated Doctor object.
 */
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    return await prisma.$transaction(async (tx) => {
        const { doctor, specialties } = payload;
        const doctorData = { ...doctor };

        // Prevent modification of email and userId via update payload
        delete (doctorData as any).email;
        delete (doctorData as any).userId;

        // Check if registrationNumber is unique before updating
        if (doctorData.registrationNumber) {
            const existingDoctorWithReg = await tx.doctor.findFirst({
                where: {
                    registrationNumber: doctorData.registrationNumber,
                    NOT: { id },
                },
            });

            if (existingDoctorWithReg) {
                throw new AppError(
                    status.BAD_REQUEST,
                    "Registration number is already in use by another doctor."
                );
            }
        }

        // Synchronize user's name if doctor's name changes
        if (doctorData.name) {
            const currentDoctor = await tx.doctor.findUniqueOrThrow({
                where: { id },
                select: { userId: true },
            });
            await tx.user.update({
                where: { id: currentDoctor.userId },
                data: { name: doctorData.name },
            });
        }

        // Step 1: Update doctor basic info
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: doctorData,
        });

        // Step 2: Update specialty relations if provided
        if (specialties) {
            const { specialtyIdsToDelete, specialtyIdsToAdd } = await getSpecialtiesToUpdate(
                tx,
                id,
                specialties as any
            );

            if (specialtyIdsToDelete.length > 0) {
                await tx.doctorSpecialty.deleteMany({
                    where: {
                        doctorId: updatedDoctor.id,
                        specialtyId: { in: specialtyIdsToDelete },
                    },
                });
            }

            if (specialtyIdsToAdd.length > 0) {
                await tx.doctorSpecialty.createMany({
                    data: specialtyIdsToAdd.map((specialtyId: string) => ({
                        doctorId: updatedDoctor.id,
                        specialtyId,
                    })),
                });
            }
        }

        // Step 3: Return updated doctor with full relations
        return await tx.doctor.findUnique({
            where: { id: updatedDoctor.id },
            include: {
                user: true,
                specialties: {
                    include: { specialty: true },
                },
            },
        });
    });
};

/**
 * Service to delete a doctor record by ID.
 *
 * @param id - Unique UUID of doctor to delete.
 * @returns Deleted Doctor object.
 */
const deleteDoctor = async (id: string) => {
    return prisma.doctor.delete({
        where: {
            id: id,
        },
    });
};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};