const calculateBMI = (weight: number, height: number): string => {
  const BMI: number = weight / Math.pow(height / 100, 2);
  if (BMI > 30) {
    return "You are obese";
  } else if (BMI > 25) {
    return "You are overweight";
  } else if (BMI < 18.5) {
    return "You are underweight";
  } else {
    return "Normal Range";
  }
};

const parseArguments = (args: string[]): { weight: number; height: number } => {
  if (args.length < 2) throw new Error("Not enough arguments");
  if (args.length > 2) throw new Error("Too many arguments");

  const weight = Number(args[0]);
  const height = Number(args[1]);

  if (!isNaN(weight) && !isNaN(height)) {
    return { weight, height };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

if (require.main === module) {
  try {
    const { weight, height } = parseArguments(process.argv.slice(2));
    console.log(calculateBMI(weight, height));
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}

export { calculateBMI, parseArguments };