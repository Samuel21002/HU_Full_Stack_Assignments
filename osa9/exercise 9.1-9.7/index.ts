import express from "express";
import { calculateBMI, parseArguments } from "./bmiCalculator";
import { calculateExercisesWebapp } from "./calculateExercises";
const app = express();

app.use(express.json());
app.get("/hello", (_req, res) => {
	res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
	const args = [req.query.weight, req.query.height] as string[];
	 
	const parsedNumbers = parseArguments(args) as {
		weight: number;
		height: number;
	};

	try {
		res.send({
			...parsedNumbers,
			bmi: calculateBMI(
				Number(parsedNumbers.weight),
				Number(parsedNumbers.height)
			),
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.send({ error: "malformatted parameters" });
		}
	}
});

app.post("/exercise", (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { daily_exercises, target } = req.body;

	if (!daily_exercises || !target) {
		return res.status(400).send({ error: "parameters missing" });
	}

	if (
		!Array.isArray(daily_exercises) ||
		!daily_exercises.every((n) => typeof n === "number") ||
		typeof target !== "number"
	) {
		return res.status(400).send({ error: "malformatted parameters" });
	}

	try {
		const result = calculateExercisesWebapp(daily_exercises, target);
		return res.send(result);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(500).send({ error: error.message });
		}
		return res.status(500).send({ error: "An unexpected error occurred" });
	}
});

const PORT = 3003;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
