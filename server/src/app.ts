import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { todosRouter } from "./routes/todosRouter";
import { CustomError } from "./types/customErrorModel";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "dev"
        ? "http://localhost:5173"
        : "https://easy-todo-app.onrender.com",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <div>
      <p>Welcome to the To-Do-App server! 🚀</p>
      <p>You can perform the following actions:</p>
      <ul>
        <li>To retrieve all todos, send a GET request to '/todos'.</li>
        <li>To add a new todo, send a POST request to '/todos'.</li>
        <li>To delete a todo, send a DELETE request to '/todos/:id', replacing ':id' with the todo's unique identifier.</li>
        <li>To update a todo, send a PATCH request to '/todos/:id', replacing ':id' with the todo's unique identifier.</li>
      </ul>
      <p>Feel free to explore and manage your todos! 📝</p>
    </div>
  `);
});

app.use("/todos", todosRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({ error: { message: error.message } });
  }
);

export default app;
