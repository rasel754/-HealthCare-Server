import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

/**
 * Service to create a new medical specialty in the database.
 *
 * @param payload - Specialty object details (title, icon, etc.).
 * @returns The newly created Specialty record.
 */
const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
    const specilaty = await prisma.specialty.create({
        data: payload,
    });

    return specilaty;
};

/**
 * Service to fetch all medical specialties from the database.
 *
 * @returns Array of all Specialty records.
 */
const getAllSpecialty = async (): Promise<Specialty[]> => {
    const specialties = await prisma.specialty.findMany();
    return specialties;
};

/**
 * Service to delete a medical specialty by ID.
 *
 * @param id - Unique UUID of the specialty to delete.
 * @returns Deleted Specialty record.
 */
const deleteSpecialty = async (id: string): Promise<Specialty> => {
    const specialty = await prisma.specialty.delete({
        where: {
            id,
        },
    });
    return specialty;
};

/**
 * Service to update a medical specialty record by ID.
 *
 * @param id - Unique UUID of the specialty.
 * @param payload - Partial specialty data to update.
 * @returns Updated Specialty record.
 */
const updateSpecialty = async (id: string, payload: Partial<Specialty>): Promise<Specialty> => {
    const specialty = await prisma.specialty.update({
        where: {
            id,
        },
        data: payload,
    });
    return specialty;
};

export const SpecialtyService = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty,
};