"use client";
import { useState, useEffect, FC } from "react";
import { Task } from "@/components/TaskRow";
import { useToast } from "@/components/ToastProvider";
import DatePicker from "@/components/DatePicker";

const ViewPage: FC = () => {
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-US")
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/tasks?date=${date}`)
      .then((res) => res.json())
      .then(setTasks);
  }, [date]);

  const toggleDone = async (index: number) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, tasks: updated })
    });
    showToast("Task updated");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">View Tasks</h2>
      <div className="mb-4 flex gap-2">
        <DatePicker date={date} onDateChange={setDate} />
      </div>
      <ul className="space-y-2">
        {tasks.map((t, idx) => (
          <li
            key={idx}
            className="bg-gray-800 p-3 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <b>
                {t.start} - {t.end}
              </b>
              : {t.task} ({t.description})
            </div>
            <div className="flex items-center gap-2">
              {t.done && <span className="text-green-400">✔️</span>}
              <button
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  t.done
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => toggleDone(idx)}
              >
                {t.done ? "Undo" : "Done"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewPage;
