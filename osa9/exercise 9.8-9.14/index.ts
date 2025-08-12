import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // Fixed import
import routes from "./controllers/routes";
import z from "zod";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Applied directly
const PORT = 3001;

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

app.use("/api/", routes);
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`Server running on : http://localhost:${PORT}`);
});
