import { TodoModel } from "../types/todoModels";
import { TodosResModel, TodoResModel } from "../types/resModel";

// const baseURL: string = "http://localhost:4000";
const baseURL: string = "https://easy-todo-app-server.onrender.com";

export const getTodos = async (): Promise<TodosResModel> => {
  try {
    const response = await fetch(`${baseURL}/todos`);
    const data: TodosResModel = await response.json();
    return data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const addTodo = async (text: string): Promise<TodoResModel> => {
  try {
    const response = await fetch(`${baseURL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data: TodoResModel = await response.json();
    return data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteTodo = async (task: TodoModel): Promise<void> => {
  try {
    await fetch(`${baseURL}/todos/${task.uuid}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const checkTodo = async (task: TodoModel): Promise<void> => {
  try {
    await fetch(`${baseURL}/todos/${task.uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isDone: !task.isDone }),
    });
    console.log(task);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const editTodo = async (
  task: TodoModel,
  updatedText: string
): Promise<void> => {
  try {
    await fetch(`${baseURL}/todos/${task.uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: updatedText }),
    });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const clearTodoList = async (): Promise<void> => {
  try {
    await fetch(`${baseURL}/todos`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    throw new Error(error as string);
  }
};
