import { Prisma } from "../../../generated/prisma/client";

export const patientSearchableFields = ['name', 'email', 'contactNumber', 'address'];

export const patientFilterableFields = [
    'email',
    'contactNumber',
    'isDeleted',
    'patientHealthData.gender',
    'patientHealthData.bloodGroup',
    'patientHealthData.maritalStatus',
    'user.status',
    'user.role'
];

export const patientIncludeConfig: Prisma.PatientInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
        }
    },
    patientHealthData: true,
    medicalReports: true,
    appointments: {
        include: {
            doctor: true,
            schedule: true,
        }
    },
    prescriptions: true,
    reviews: true,
};
