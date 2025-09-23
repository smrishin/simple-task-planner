"use client";
import { useState, useEffect, FC } from "react";
import Link from "next/link";
import TaskRow, { Task } from "@/components/TaskRow";
import { useToast } from "@/components/ToastProvider";

const EditPage: FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState<string>(today);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/tasks?date=${date}`)
      .then((res) => res.json())
      .then(setTasks);
  }, [date]);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        start: "",
        end: "",
        task: "",
        description: "",
        done: false,
        deleted: false
      }
    ]);
  };

  const updateTask = (index: number, updated: Task) => {
    const newTasks = [...tasks];
    newTasks[index] = updated;
    setTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].deleted = true;
    setTasks(newTasks);
  };

  const saveTasks = async () => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, tasks })
    });
    showToast("Tasks saved");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Edit Tasks</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="bg-gray-700 text-white p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
          onClick={saveTasks}
        >
          Save
        </button>
      </div>
      {tasks.map((task, idx) => (
        <TaskRow
          key={idx}
          task={task}
          onChange={(t) => updateTask(idx, t)}
          onDelete={() => deleteTask(idx)}
        />
      ))}
      <button
        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        onClick={addTask}
      >
        + Add Task
      </button>
    </div>
  );
};

export default EditPage;
