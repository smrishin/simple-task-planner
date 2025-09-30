"use client";
import { useRouter } from "next/navigation";
import TaskRow, { Task } from "@/components/TaskRow";
import { FC, useState } from "react";

import DatePicker from "@/components/DatePicker";
import { useTasks } from "@/context/TaskProvider";
import { useToast } from "@/context/ToastProvider";

const EditPage: FC = () => {
  const { date, setDate, tasks, setTasks, activeTasks } = useTasks();
  const { showToast } = useToast();
  const router = useRouter();

  // Local draft state for new unsaved tasks
  const [draftTasks, setDraftTasks] = useState<Task[]>([]);

  const addTask = () => {
    setDraftTasks([
      ...draftTasks,
      {
        id: `${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,
        start: "",
        end: "",
        task: "",
        description: "",
        done: false,
        deleted: false
      }
    ]);
  };

  const updateTask = (
    identifier: number | string,
    updated: Task,
    isDraft = false
  ) => {
    if (isDraft) {
      const idx = draftTasks.findIndex((d) => d.id === identifier);
      if (idx === -1) return;
      const newDrafts = [...draftTasks];
      newDrafts[idx] = updated;
      setDraftTasks(newDrafts);
    } else {
      const idx = tasks.findIndex((t) => t.id === identifier);
      if (idx === -1) return;
      const newTasks = [...tasks];
      newTasks[idx] = updated;
      setTasks(newTasks);
    }
  };

  const deleteTask = (identifier: number | string, isDraft = false) => {
    if (isDraft) {
      const idx = draftTasks.findIndex((d) => d.id === identifier);
      if (idx === -1) return;
      const newDrafts = [...draftTasks];
      newDrafts.splice(idx, 1);
      setDraftTasks(newDrafts);
    } else {
      const idx = tasks.findIndex((t) => t.id === identifier);
      if (idx === -1) return;
      const newTasks = [...tasks];
      // Toggle a temporary stagedDeleted flag. Actual deletion is applied on Save.
      newTasks[idx] = {
        ...newTasks[idx],
        stagedDeleted: !newTasks[idx].stagedDeleted
      };
      setTasks(newTasks);
    }
  };

  const saveTasks = async () => {
    // When saving, convert any stagedDeleted flags into real deleted flags,
    // then merge with drafts and persist only valid tasks.
    // Preserve previously deleted items; only set deleted=true when stagedDeleted is true.
    const committed = tasks.map((t) => ({
      ...t,
      deleted: !!t.deleted || !!t.stagedDeleted,
      stagedDeleted: undefined
    }));
    const mergedTasks = [...committed, ...draftTasks];

    // Filter out tasks missing required fields (start or task)
    const validTasks = mergedTasks.filter((t) => {
      const hasStart = typeof t.start === "string" && t.start.trim() !== "";
      const hasTask = typeof t.task === "string" && t.task.trim() !== "";
      return hasStart && hasTask;
    });

    // Update context and clear drafts with only valid tasks
    setTasks(validTasks);
    setDraftTasks([]);

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, tasks: validTasks })
    });
    showToast("Tasks saved");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-2xl font-bold mb-4">Modify Tasks</h2>
        <button
          onClick={() => router.push("/deleted")}
          className="h-10 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
        >
          Show Deleted
        </button>
      </div>
      <div className="flex flex-col items-center gap-10">
        <div className="flex justify-between items-end w-full">
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
          {activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onChange={(t) => updateTask(task.id, t)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}

          {/* Draft tasks */}
          {draftTasks
            .slice()
            .sort((a, b) => {
              const toMinutes = (s: string) => {
                if (!s) return Number.POSITIVE_INFINITY;
                const [hh, mm] = s.split(":");
                const h = parseInt(hh || "", 10);
                const m = parseInt(mm || "", 10);
                if (Number.isNaN(h) || Number.isNaN(m))
                  return Number.POSITIVE_INFINITY;
                return h * 60 + m;
              };
              return toMinutes(a.start) - toMinutes(b.start);
            })
            .map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onChange={(t) => updateTask(task.id, t, true)}
                onDelete={() => deleteTask(task.id, true)}
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
