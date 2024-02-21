import { TodoModel } from "./todoModels";

export interface TodosResModel {
  message: string;
  todos: TodoModel[];
}

export interface TodoResModel {
  message: string;
  todo: TodoModel;
}
