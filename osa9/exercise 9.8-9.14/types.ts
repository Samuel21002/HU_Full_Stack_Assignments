import { z } from 'zod';
import { newEntrySchema } from './utils';

export type ISODateString = `${number}-${number}-${number}`;
export type PatientNonSensitive = Omit<Patient, "ssn">;
// export type NewPatientEntry = Omit<Patient, "id">;
export type NewPatientEntry = z.infer<typeof newEntrySchema>; 

export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other",
}
export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}
export interface Patient {
	id: string;
	name: string;
	dateOfBirth: ISODateString;
	ssn: string;
	gender: Gender;
	occupation: string;
}
