import { FormEvent, useRef } from "react";
import { PiPlus } from "react-icons/pi";

interface TodoFormProps {
  addTask: (text: string) => void;
}

export const TodoForm = ({ addTask }: TodoFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current!.value.trim()) {
      addTask(inputRef.current!.value);
      inputRef.current!.value = "";
    } else {
      alert("You should enter a to-do.");
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative mb-6 ">
      <input
        type="text"
        ref={inputRef}
        className="w-[100%] py-[0.58rem] px-4 text-sm text-center rounded-xl md:text-left outline-violet-200 bg-[#ffffffe8]"
        placeholder="Enter to-do"
      />
      <button
        type="submit"
        title="add"
        className="absolute inset-y-0 right-0 bg-violet-500 text-white px-[0.7rem] text-xl rounded-r-xl hover:bg-violet-400 transition-all ease-in-out duration-300"
      >
        <PiPlus />
      </button>
    </form>
  );
};
