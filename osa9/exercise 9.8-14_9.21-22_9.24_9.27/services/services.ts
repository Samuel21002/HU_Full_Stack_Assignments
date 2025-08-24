import {
	Diagnosis,
	Patient,
	ISODateString,
	NewPatientEntry,
	Entry,
} from "../types";
import diagnosisData from "../data/diagnoses";
import patientData from "../data/patients";
import { v1 as uuid } from "uuid";
import { toNewEntryObject } from "../utils";

const getAllDiagnosis = (): Diagnosis[] => {
	return diagnosisData;
};
const getAllPatients = (): Patient[] => {
	return patientData.map(
		({ id, name, dateOfBirth, gender, occupation, ssn, entries }) => ({
			id,
			name,
			dateOfBirth,
			gender,
			occupation,
			ssn,
			entries,
		})
	);
};
const addPatient = (patient: NewPatientEntry): Patient => {
	const newPatient = {
		id: uuid(),
		entries: [],
		...patient,
		dateOfBirth: patient.dateOfBirth as ISODateString,
	};
	patientData.push(newPatient);
	return newPatient;
};
const getPatient = (id: string): Patient | undefined => {
	return patientData.find((p) => p.id === id);
};

const addEntry = (
	patientId: string,
	object: unknown
): Entry | undefined => {
	// Validate and parse the entry using Zod
	const validatedEntry = toNewEntryObject(object);

	const patient = getPatient(patientId);
	if (!patient) {
		throw new Error("Patient not found");
	}

	const newEntry: Entry = {
		id: uuid(),
		...validatedEntry,
		diagnosisCodes: validatedEntry.diagnosisCodes || [],
	} as Entry;

	patient.entries.push(newEntry);
	return newEntry;
};

export default {
	getAllDiagnosis,
	getAllPatients,
	addPatient,
	getPatient,
	addEntry,
};
