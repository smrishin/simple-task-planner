"use client";
import { FC } from "react";

export interface Task {
  id: string;
  start: string;
  end: string;
  task: string;
  description: string;
  done: boolean;
  deleted: boolean;
  // stagedDeleted is a temporary client-only flag used in the Edit page
  // to mark items that will be deleted when the user hits Save.
  stagedDeleted?: boolean;
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
    <div
      className={`flex flex-wrap gap-2 mb-2 p-3 rounded-lg shadow-md ${
        task.stagedDeleted
          ? "bg-red-800/20 border border-red-700/30"
          : "bg-gray-800"
      }`}
    >
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
      <div className="flex gap-2">
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
          className={`px-3 py-1 rounded transition-colors duration-200 ${
            task.stagedDeleted
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={onDelete}
        >
          {task.stagedDeleted ? "Undo" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
