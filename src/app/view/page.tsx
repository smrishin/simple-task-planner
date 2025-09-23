"use client";
import { FC } from "react";
import { useTasks } from "@/context/TaskProvider";
import { useToast } from "@/context/ToastProvider";
import DatePicker from "@/components/DatePicker";

const ViewPage: FC = () => {
  const { date, setDate, tasks, setTasks, activeTasks } = useTasks();
  const { showToast } = useToast();

  const toggleDone = async (id: string) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], done: !updated[idx].done };
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

      <div className="overflow-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeTasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No tasks for this date.
                </td>
              </tr>
            )}

            {activeTasks.map((t) => {
              const to12 = (time: string) => {
                if (!time) return "";
                // expect HH:MM
                const [hh, mm] = time.split(":");
                const h = parseInt(hh, 10);
                if (Number.isNaN(h) || Number.isNaN(parseInt(mm || "0", 10)))
                  return time;
                const suffix = h >= 12 ? "pm" : "am";
                const hour = ((h + 11) % 12) + 1; // convert 0->12,13->1 etc
                return `${hour}:${mm} ${suffix}`;
              };

              return (
                <tr
                  key={t.id}
                  className={
                    t.done ? "bg-green-900 odd:bg-green-800" : "odd:bg-gray-800"
                  }
                >
                  <td className="px-4 py-3 align-top font-medium">
                    {to12(t.start)}
                    {t.end ? (
                      <span className="text-sm text-gray-300">
                        {" "}
                        - {to12(t.end)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">{t.task}</td>
                  <td className="px-4 py-3 align-top text-gray-300">
                    {t.description}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {t.done ? (
                      <span className="inline-flex items-center gap-2 text-green-200">
                        ✔️ Done
                      </span>
                    ) : (
                      <span className="text-yellow-200">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      className={`px-3 py-1 rounded transition-colors duration-200 ${
                        t.done
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => toggleDone(t.id)}
                    >
                      {t.done ? "Undo" : "Done"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPage;
