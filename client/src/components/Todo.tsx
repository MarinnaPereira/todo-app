import { TodoModel } from "../types/todoModels";
import { useState } from "react";
import {
  PiCheckSquareOffset,
  PiCheckSquare,
  PiPencilSimple,
  PiTrash,
} from "react-icons/pi";

interface TodoProps {
  task: TodoModel;
  deleteTask: (task: TodoModel) => void;
  checkTask: (task: TodoModel) => void;
  editTask: (task: TodoModel, updatedText: string) => void;
}

export const Todo = ({ task, deleteTask, checkTask, editTask }: TodoProps) => {
  const { text, isDone } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(text);

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (!updatedText.trim()) {
        alert("You should enter a valid to-do.");
        setUpdatedText(text);
        return;
      }
      editTask(task, updatedText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditToggle();
    }
  };

  return (
    <div className="flex flex-col items-center md:flex-row mb-3 py-2 px-3 border border-violet-200 rounded-xl gap-2 md:gap-5">
      <div className="w-full overflow-auto text-center md:text-left">
        {isEditing ? (
          <input
            type="text"
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEditToggle}
            autoFocus
            className="bg-violet-200 rounded-lg outline-none px-1 md:px-2 py-1 w-full text-sm text-center md:text-left"
          />
        ) : (
          <p
            onClick={handleEditToggle}
            className={`w-full my-1 px-1 text-sm ${
              isDone ? "line-through text-violet-300" : ""
            }`}
          >
            {text}
          </p>
        )}
      </div>
      <div className="flex gap-4 text-violet-600 pb-1 md:pb-0">
        <button onClick={() => checkTask(task)}>
          {task.isDone ? (
            <PiCheckSquare
              title="uncheck"
              className="rounded-xl text-3xl p-[0.3rem] bg-violet-50 hover:bg-violet-200 transition-all ease-in-out duration-300"
            />
          ) : (
            <PiCheckSquareOffset
              title="check"
              className="rounded-xl text-3xl p-[0.3rem] bg-violet-50 hover:bg-violet-200 transition-all ease-in-out duration-300"
            />
          )}
        </button>
        <button title="edit" onClick={handleEditToggle}>
          <PiPencilSimple className="rounded-xl text-3xl p-[0.3rem] bg-violet-50 hover:bg-violet-200 transition-all ease-in-out duration-300" />
        </button>
        <button title="delete" onClick={() => deleteTask(task)}>
          <PiTrash className="rounded-xl text-3xl p-[0.3rem] bg-violet-50 hover:bg-violet-200 transition-all ease-in-out duration-300" />
        </button>
      </div>
    </div>
  );
};
