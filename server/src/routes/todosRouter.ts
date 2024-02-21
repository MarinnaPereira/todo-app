import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import { v4 } from "uuid";
import { TodoModel } from "../../../client/src/types/todoModels";

const todosRouter = Router();

const validateUUID = (req: Request, res: Response, next: NextFunction) => {
  const validUuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!validUuid.test(req.params.id as string)) {
    return res.status(500).json({
      error: {
        message: "Id is not a valid UUID",
      },
    });
  }
  next();
};

const getAllTodos = (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = JSON.parse(fs.readFileSync("todos.json", "utf8"));
    res.json({ message: "All todos", todos });
  } catch (error) {
    next(error);
  }
};

const addTodo = (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = JSON.parse(fs.readFileSync("todos.json", "utf8"));
    const todo = {
      text: req.body.text,
      isDone: false,
      uuid: v4(),
    };
    todos.push(todo);
    fs.writeFileSync("todos.json", JSON.stringify(todos));
    res.status(201).json({ message: "Todo added successfully", todo });
  } catch (error) {
    next(error);
  }
};

const clearTodoList = (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos: TodoModel[] = [];
    fs.writeFileSync("todos.json", JSON.stringify(todos));
    res.json({ message: "Todo list cleared successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const todos = JSON.parse(fs.readFileSync("todos.json", "utf8"));
    const updatedTodosArray = todos.filter(
      (todo: { uuid: string }) => todo.uuid !== req.params.id
    );
    if (updatedTodosArray.length === todos.length) {
      throw new Error(`Id: '${id}' not found`);
    }
    fs.writeFileSync("todos.json", JSON.stringify(updatedTodosArray));
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { body } = req;
  try {
    if (!body.text && body.isDone === undefined) {
      throw new Error(
        `Request body requires properties of either 'text' or 'isDone'`
      );
    }
    const todos = JSON.parse(fs.readFileSync("todos.json", "utf8"));
    let foundId = false;
    const updatedTodos = todos.map((todo: { uuid: string }) => {
      if (todo.uuid === id) {
        foundId = true;
        return { ...todo, ...body };
      } else {
        return todo;
      }
    });
    if (!foundId) {
      throw new Error(`Id: '${id}' not found`);
    }
    fs.writeFileSync("todos.json", JSON.stringify(updatedTodos));
    res.json({ message: "Todos updated successfully", todos: updatedTodos });
  } catch (error) {
    next(error);
  }
};

todosRouter.route("/").get(getAllTodos).post(addTodo).patch(clearTodoList);
todosRouter
  .route("/:id")
  .delete(validateUUID, deleteTodo)
  .patch(validateUUID, updateTodo);

export { todosRouter };
