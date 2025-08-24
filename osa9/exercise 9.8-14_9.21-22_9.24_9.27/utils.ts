//import { ISODateString } from "./types";
import { NewPatientEntry, Gender, HealthCheckRating, EntryWithoutId, ISODateString, Diagnosis } from "./types";
import { z } from "zod";

// OLD EXERCISE
/*
// String validation
const isString = (text: unknown): text is string => {
	return typeof text === "string";
};

const parseStringField = (string: unknown): string => {
	if (!string || !isString(string)) {
		throw new Error("Incorrect or missing string");
	}
	return string;
};

// Date validation
// This function checks if the date is in the format YYYY-MM-DD
const isISODateString = (date: string): date is ISODateString => {
	// Matches YYYY-MM-DD
	return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const parseDateField = (date: unknown): ISODateString => {
	if (!date || !isString(date) || !isISODateString(date)) {
		throw new Error("Incorrect or missing date: " + date);
	}
	return date;
};


// Gender validation
const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGenderField = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect gender: ' + gender);
  }
  return gender;
};


export const toNewPatientObject = (object: unknown): NewPatientEntry => {
	if (!object || typeof object !== "object") {
		throw new Error("Incorrect or missing data");
	}
	if (
		"name" in object &&
		"dateOfBirth" in object &&
		"ssn" in object &&
		"gender" in object &&
		"occupation" in object
	) {
		const newEntry: NewPatientEntry = {
			name: parseStringField(object.name),
			dateOfBirth: parseDateField(object.dateOfBirth),
			ssn: parseStringField(object.ssn),
			gender: parseGenderField(object.gender),
			occupation: parseStringField(object.occupation),
		};
		return newEntry;
	}
	throw new Error("Incorrect data: some fields are missing");
};*/

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

export const newPatientEntrySchema = z.object({
    name: z.string(),
	dateOfBirth: z.iso.date(),
    ssn: z.string(),
	gender: z.enum(Gender),
	occupation: z.string(),
});

export const toNewPatientObject = (object: unknown): NewPatientEntry => {
	return newPatientEntrySchema.parse(object);
};

const baseEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date missing or not in YYYY-MM-DD format").transform((val) => val as ISODateString),
  description: z.string().min(1, "Description is required"),
  specialist: z.string().min(1, "Specialist is required"),
  diagnosisCodes: z.preprocess(
    (val) => {
      // If val is already an array, return it directly
      if (Array.isArray(val)) {
        return val as string[];
      }
      // Otherwise, use parseDiagnosisCodes with the entire object containing diagnosisCodes
      return parseDiagnosisCodes({ diagnosisCodes: val });
    },
    z.array(z.string())
  ).optional(),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date missing or not in YYYY-MM-DD format").transform((val) => val as ISODateString),
    criteria: z.string().min(1, "Discharge criteria is required"),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1, "Employer name is required"),
  sickLeave: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date missing or not in YYYY-MM-DD format").transform((val) => val as ISODateString),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date missing or not in YYYY-MM-DD format").transform((val) => val as ISODateString),
  }).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const newEntrySchema = z.discriminatedUnion("type", [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);

export const toNewEntryObject = (object: unknown): EntryWithoutId => {
  return newEntrySchema.parse(object);
};