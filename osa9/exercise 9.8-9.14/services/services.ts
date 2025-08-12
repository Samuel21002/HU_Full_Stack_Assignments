import { Diagnosis, Patient, PatientNonSensitive, ISODateString, NewPatientEntry } from "../types";
import diagnosisData from "../data/diagnoses";
import patientData from "../data/patients";
import { v1 as uuid } from "uuid";

const getAllDiagnosis = (): Diagnosis[] => {
	return diagnosisData;
};
const getAllPatients = (): PatientNonSensitive[] => {
	return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};
const addPatient = (patient: NewPatientEntry): Patient => {
	const newPatient = {
		id: uuid(),
		...patient,
		dateOfBirth: patient.dateOfBirth as ISODateString,
	};
	patientData.push(newPatient);
	return newPatient;
};

export default {
	getAllDiagnosis,
	getAllPatients,
	addPatient
};
