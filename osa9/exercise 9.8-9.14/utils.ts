//import { ISODateString } from "./types";
import { NewPatientEntry, Gender } from "./types";
import { z } from "zod";
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


export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
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

export const newEntrySchema = z.object({
    name: z.string(),
	dateOfBirth: z.iso.date(),
    ssn: z.string(),
	gender: z.enum(Gender),
	occupation: z.string(),
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
	return newEntrySchema.parse(object);
};
