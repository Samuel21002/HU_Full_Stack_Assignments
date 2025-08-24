
import { z } from "zod";
import { newPatientEntrySchema } from "./utils";

export type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
export type NewPatientEntry = z.infer<typeof newPatientEntrySchema>;
export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
export type PatientFormValues = Omit<Patient, "id" | "entries">;
export type EntryFormValues = Omit<Entry, "id">;

export enum EntryTypeOptions {
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck"
}

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
	ssn: string;
	occupation: string;
	gender: Gender;
	dateOfBirth: ISODateString;
	entries: Entry[];
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

interface BaseEntry {
  id: string;
  date: ISODateString;
  description: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: ISODateString;
    criteria: string;
  };
}
interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: ISODateString;
    endDate: ISODateString;
  };
}

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, 'id'>;