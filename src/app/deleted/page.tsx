"use client";
import { FC } from "react";
import { useTasks } from "@/context/TaskProvider";
import { useToast } from "@/context/ToastProvider";
import DatePicker from "@/components/DatePicker";

const DeletedPage: FC = () => {
  const { date, setDate, tasks, setTasks, deletedTasks } = useTasks();
  const { showToast } = useToast();

  const undeleteTask = async (id: string) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], deleted: false };
    setTasks(updated);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, tasks: updated })
    });
    showToast("Task restored");
  };

  const to12 = (time: string) => {
    if (!time) return "";
    const [hh, mm] = time.split(":");
    const h = parseInt(hh, 10);
    if (Number.isNaN(h) || Number.isNaN(parseInt(mm || "0", 10))) return time;
    const suffix = h >= 12 ? "pm" : "am";
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${mm} ${suffix}`;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Deleted Tasks</h2>
      <div className="mb-4 flex gap-2">
        <DatePicker date={date} onDateChange={setDate} />
      </div>
      <ul className="space-y-2">
        {deletedTasks.map((t) => (
          <li
            key={t.id}
            className={`bg-red-800 p-3 rounded-lg shadow-md flex justify-between items-center`}
          >
            <div>
              <b>
                {to12(t.start)} - {to12(t.end)}
              </b>
              : {t.task} ({t.description})
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 transition-colors duration-200`}
                onClick={() => undeleteTask(t.id)}
              >
                Undelete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeletedPage;
