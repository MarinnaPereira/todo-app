import { useState, useEffect } from "react";
import { Todo } from "./components/Todo";
import { TodoModel } from "./types/todoModels";
import { TodosResModel, TodoResModel } from "./types/resModel.ts";
import { TodoForm } from "./components/TodoForm";
import { PiEraserBold } from "react-icons/pi";
import {
  getTodos,
  addTodo,
  checkTodo,
  editTodo,
  deleteTodo,
  clearTodoList,
} from "./api/api.ts";

const initialTasks: TodoModel[] = [];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    const fetchTodos = async () => {
      const data: TodosResModel = await getTodos();
      setTasks(data.todos);
    };
    fetchTodos();
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const data: TodoResModel = await addTodo(text);
      console.log("Data returned from addTodo:", data);
      if (data.todo) {
        setTasks([...tasks, data.todo]);
      } else {
        throw new Error("Todo data is undefined");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (task: TodoModel) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (shouldDelete) {
      try {
        await deleteTodo(task);
        const filteredTasks = tasks.filter((todo) => todo.uuid !== task.uuid);
        setTasks(filteredTasks);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCheck = async (task: TodoModel) => {
    try {
      await checkTodo(task);
      setTasks((prev) =>
        prev.map((todo) =>
          todo.uuid === task.uuid ? { ...todo, isDone: !todo.isDone } : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (task: TodoModel, updatedText: string) => {
    try {
      await editTodo(task, updatedText);
      setTasks((prev) =>
        prev.map((todo) =>
          todo.uuid === task.uuid ? { ...todo, text: updatedText } : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearList = async () => {
    const shouldClear = window.confirm(
      "Are you sure you want to clear your to-do list?"
    );
    if (shouldClear) {
      try {
        await clearTodoList();
        setTasks([]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <main className="bg-violet-100 min-h-screen flex justify-center py-20 text-slate-600">
      <div className="flex-col border-4 border-violet-50 p-7 rounded-xl max-w-xs sm:max-w-[470px] md:w-[470px] h-fit">
        <div className="grid md:gap-16 items-center mb-5">
          <h1 className="text-right col-start-2 text-violet-600 font-medium text-2xl">
            To-Do List
          </h1>
          <button
            onClick={handleClearList}
            title="clear list"
            className="col-start-3 justify-self-end p-[0.54rem] text-2xl rounded-xl text-violet-600 hover:bg-violet-200 transition-all ease-in-out duration-300"
          >
            <PiEraserBold />
          </button>
        </div>
        <TodoForm addTask={handleAdd} />
        {tasks.length > 0 &&
          tasks.map((task) => {
            return (
              <Todo
                key={task.uuid}
                task={task}
                deleteTask={handleDelete}
                checkTask={handleCheck}
                editTask={handleEdit}
              />
            );
          })}
      </div>
    </main>
  );
}

export default App;
