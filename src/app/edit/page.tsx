"use client";
import TaskRow, { Task } from "@/components/TaskRow";
import { FC, useState } from "react";

import DatePicker from "@/components/DatePicker";
import { useTasks } from "@/context/TaskProvider";
import { useToast } from "@/context/ToastProvider";

const EditPage: FC = () => {
  const { date, setDate, tasks, setTasks, activeTasks } = useTasks();
  const { showToast } = useToast();

  // Local draft state for new unsaved tasks
  const [draftTasks, setDraftTasks] = useState<Task[]>([]);

  const addTask = () => {
    setDraftTasks([
      ...draftTasks,
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

  const updateTask = (index: number, updated: Task, isDraft = false) => {
    if (isDraft) {
      const newDrafts = [...draftTasks];
      newDrafts[index] = updated;
      setDraftTasks(newDrafts);
    } else {
      const newTasks = [...tasks];
      newTasks[index] = updated;
      setTasks(newTasks);
    }
  };

  const deleteTask = (index: number, isDraft = false) => {
    if (isDraft) {
      const newDrafts = [...draftTasks];

      newDrafts.splice(index, 1);

      setDraftTasks(newDrafts);
    } else {
      const newTasks = [...tasks];
      newTasks[index].deleted = true;
      setTasks(newTasks);
    }
  };

  const saveTasks = async () => {
    const mergedTasks = [...tasks, ...draftTasks];
    setTasks(mergedTasks);
    setDraftTasks([]);

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, tasks: mergedTasks })
    });
    showToast("Tasks saved");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Modify Tasks</h2>
      <div className="flex flex-col items-center gap-10">
        <div className="flex justify-between w-full">
          <DatePicker date={date} onDateChange={setDate} />
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
            onClick={saveTasks}
          >
            Save
          </button>
        </div>
        <div className="w-full">
          {/* Existing tasks */}
          {activeTasks.map((task, idx) => (
            <TaskRow
              key={`existing-${idx}`}
              task={task}
              onChange={(t) => updateTask(idx, t)}
              onDelete={() => deleteTask(idx)}
            />
          ))}

          {/* Draft tasks */}
          {draftTasks.map((task, idx) => (
            <TaskRow
              key={`draft-${idx}`}
              task={task}
              onChange={(t) => updateTask(idx, t, true)}
              onDelete={() => deleteTask(idx, true)}
            />
          ))}
        </div>
        <button
          className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          onClick={addTask}
        >
          + Add Task
        </button>
      </div>
    </div>
  );
};

export default EditPage;
