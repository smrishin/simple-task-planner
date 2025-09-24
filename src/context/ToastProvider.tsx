"use client";
import { createContext, useContext, useState, ReactNode, FC } from "react";

interface ToastContextType {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className="
      fixed bottom-4 right-4 
      bg-gray-800 text-white px-4 py-2 rounded shadow-lg 
      max-w-[90%] sm:max-w-sm 
      sm:right-4 sm:left-auto
      left-1/2 -translate-x-1/2 sm:translate-x-0
    "
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
