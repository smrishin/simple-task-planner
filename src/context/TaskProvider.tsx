"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback
} from "react";
import { Task } from "@/components/TaskRow";

interface TaskContextType {
  date: string;
  setDate: (date: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  refreshTasks: () => Promise<void>;
  activeTasks: Task[];
  deletedTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getLocalDate = () => new Date().toLocaleDateString("en-CA");

// Simple unique id generator: timestamp + random.
const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const ensureIds = (tasks: Task[]) =>
  tasks.map((t) => ({ ...t, id: t.id ?? genId() }));

export function TaskProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<string>(getLocalDate());
  const [tasks, setTasks] = useState<Task[]>([]);

  const refreshTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?date=${date}`);
    const data = await res.json();
    setTasks(ensureIds(Array.isArray(data) ? data : []));
  }, [date]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const minutesFrom = (time: string) => {
    if (!time || typeof time !== "string") return Number.POSITIVE_INFINITY;
    const parts = time.split(":");
    const h = parseInt(parts[0] ?? "", 10);
    const m = parseInt(parts[1] ?? "", 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return Number.POSITIVE_INFINITY;
    return h * 60 + m;
  };

  const compareByStart = (a: Task, b: Task) => {
    const am = minutesFrom(a.start);
    const bm = minutesFrom(b.start);
    return am - bm;
  };

  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.deleted).slice().sort(compareByStart),
    [tasks]
  );

  const deletedTasks = useMemo(
    () => tasks.filter((t) => t.deleted).slice().sort(compareByStart),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        date,
        setDate,
        tasks,
        setTasks,
        refreshTasks,
        activeTasks,
        deletedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
};
