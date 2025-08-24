import { Router, Request, Response, NextFunction } from "express";
import {
	Diagnosis,
	Patient,
	NewPatientEntry,
	NonSensitivePatient,
} from "../types";
import { newPatientEntrySchema } from "../utils";
import services from "../services/services";

const appRouter: Router = Router();

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		newPatientEntrySchema.parse(req.body);
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
	(_req: Request, res: Response<NonSensitivePatient[]>) => {
		res.json(services.getAllPatients());
	}
);

appRouter.get("/patients/:id", (_req: Request, res: Response<Patient>) => {
	const id: string = _req.params.id;
	res.json(services.getPatient(id));
});

appRouter.post("/patients/:id/entries", (req: Request, res: Response): void => {
	try {
		const id: string = req.params.id;
		const entry = services.addEntry(id, req.body);

		if (!entry) {
			res.status(404).json({ error: "Patient not found" });
			return;
		}

		res.status(201).json(entry);
	} catch (error: unknown) {
		let errorMessage = "Something went wrong.";
		if (error instanceof Error) {
			errorMessage += " Error: " + error.message;
		}
		res.status(400).json({ error: errorMessage });
	}
});

appRouter.post(
	"/patients",
	newDiaryParser,
	(req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
		const addedEntry = services.addPatient(req.body);
		res.json(addedEntry);
	}
);

export default appRouter;
