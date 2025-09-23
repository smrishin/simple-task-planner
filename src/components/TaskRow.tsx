"use client";
import { FC } from "react";

export interface Task {
  start: string;
  end: string;
  task: string;
  description: string;
  done: boolean;
  deleted: boolean;
}

interface TaskRowProps {
  task: Task;
  onChange: (updated: Task) => void;
  onDelete: () => void;
}

const TaskRow: FC<TaskRowProps> = ({ task, onChange, onDelete }) => {
  if (task.deleted) return null;

  const handleChange = (field: keyof Task, value: string | boolean) => {
    onChange({ ...task, [field]: value });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-gray-800 p-3 rounded-lg shadow-md">
      <input
        type="time"
        className="bg-gray-700 text-white p-2 rounded"
        value={task.start}
        onChange={(e) => handleChange("start", e.target.value)}
      />
      <input
        type="time"
        className="bg-gray-700 text-white p-2 rounded"
        value={task.end}
        onChange={(e) => handleChange("end", e.target.value)}
      />
      <input
        type="text"
        placeholder="Task"
        className="bg-gray-700 text-white p-2 rounded flex-1"
        value={task.task}
        onChange={(e) => handleChange("task", e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        className="bg-gray-700 text-white p-2 rounded flex-1"
        value={task.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <button
        className={`px-3 py-1 rounded transition-colors duration-200 ${
          task.done
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={() => handleChange("done", !task.done)}
      >
        {task.done ? "Undo" : "Done"}
      </button>
      <button
        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors duration-200"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default TaskRow;
