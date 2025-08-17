import { Router, Request, Response, NextFunction } from "express";
import {
	Diagnosis,
	Patient,
	PatientNonSensitive,
	NewPatientEntry,
} from "../types";
//import { toNewPatientEntry } from "../utils";
import { newEntrySchema } from "../utils";
import services from "../services/services";

const appRouter: Router = Router();

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		newEntrySchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

appRouter.get("/ping", (_req: Request, res: Response) => {
	console.log("someone pinged here");
	res.send("pong");
});

appRouter.get("/diagnoses", (_req: Request, res: Response<Diagnosis[]>) => {
	res.json(services.getAllDiagnosis());
});

appRouter.get(
	"/patients",
	(_req: Request, res: Response<PatientNonSensitive[]>) => {
		res.json(services.getAllPatients());
	}
);

appRouter.post(
	"/patients",
	newDiaryParser,
	(req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
		//const newPatientEntry = newEntrySchema.parse(req.body);
		const addedEntry = services.addPatient(req.body);
		res.json(addedEntry);
		/*catch (error: unknown) {
			let errorMessage = "Something went wrong.";
			if (error instanceof Error) {
				errorMessage += " Error: " + error.message;
				}
				res.status(400).send(errorMessage);
				}*/
	}
);