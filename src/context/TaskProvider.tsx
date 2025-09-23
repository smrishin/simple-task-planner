"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo
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

export function TaskProvider({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<string>(getLocalDate());
  const [tasks, setTasks] = useState<Task[]>([]);

  const refreshTasks = async () => {
    const res = await fetch(`/api/tasks?date=${date}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    refreshTasks();
  }, [date]);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.deleted), [tasks]);
  const deletedTasks = useMemo(() => tasks.filter((t) => t.deleted), [tasks]);

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
