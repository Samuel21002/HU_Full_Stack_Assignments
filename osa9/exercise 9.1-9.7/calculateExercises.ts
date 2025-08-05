interface Result {
	number_of_days: number;
	number_of_training_days: number;
	original_target_value: number;
	calculated_average_time: number;
	target_was_reached: boolean;
	rating_of_hours: number; // rating between the numbers 1-3 that tells how well the hours are met
	rating_description: string; //a text value explaining the rating, you can come up with the explanations
}

interface Rating {
	rating_of_hours: number;
	rating_description: string;
}

const ratingHours = (totalhours: number, targetValue: number): Rating => {
	const ratio = totalhours / targetValue;

	let rating: number;
	let description: string;

	if (ratio >= 1) {
		rating = 3;
		description = "Target met or exceeded.";
	} else if (ratio >= 0.5) {
		rating = 2;
		description = "At least half of the target achieved.";
	} else {
		rating = 1;
		description = "Less than half of the target achieved.";
	}

	return {
		rating_of_hours: rating,
		rating_description: description,
	};
};

const ratingHoursWebapp = (totalhours: number, targetValue: number): Rating => {
	const ratio = totalhours / targetValue;

	let rating: number;
	let description: string;

	if (ratio >= 1) {
		rating = 3;
		description = "Good";
	} else if (ratio >= 0.5) {
		rating = 2;
		description = "Not too bad";
	} else {
		rating = 1;
		description = "Bad";
	}

	return {
		rating_of_hours: rating,
		rating_description: description,
	};
};

const calculateExercises = (hours: number[]) => {
	const targetValue: number = hours[0];
	const exerciseHours = hours.slice(1);
	const totalHours: number = exerciseHours.reduce(
		(hour, initValue) => hour + initValue,
		0
	);
	const rating: Rating = ratingHours(totalHours, targetValue);

	const result: Result = {
		number_of_days: exerciseHours.length,
		number_of_training_days: exerciseHours.filter((h) => h > 0).length,
		original_target_value: targetValue,
		calculated_average_time: totalHours / exerciseHours.length,
		target_was_reached: totalHours >= targetValue,
		rating_of_hours: rating.rating_of_hours,
		rating_description: rating.rating_description,
	};
	return result;
};

export const calculateExercisesWebapp = (
	daily_exercises: number[],
	target: number
) => {
	const totalHours: number = daily_exercises.reduce(
		(hour, initValue) => hour + initValue,
		0
	);
	const rating: Rating = ratingHoursWebapp(totalHours, target);

	const result : object = {
		periodLength: daily_exercises.length,
		trainingDays: daily_exercises.filter((h) => h > 0).length,
		success : totalHours >= target,
		rating: rating.rating_of_hours,
		ratingDescription: rating.rating_description,
		target: target,
		average: totalHours / daily_exercises.length,
	};
	return result;
};

const validateArguments = (args: string[]) => {
	if (args.length <= 1) throw new Error("Not enough arguments");
	if (args.length > 8) throw new Error("Too many arguments");

	const numbers = args.map((arg) => Number(arg));
	if (!numbers.some(isNaN)) {
		return numbers;
	} else {
		throw new Error("Provided values were not numbers!");
	}
};

if (require.main === module) {
	try {
		const exercise_days: number[] = validateArguments(process.argv.slice(2));
		console.log(calculateExercises(exercise_days));
	} catch (error: unknown) {
		let errorMessage: string = "";
		if (error instanceof Error) {
			errorMessage += " Error: " + error.message;
		}
		console.log(errorMessage);
	}
}
