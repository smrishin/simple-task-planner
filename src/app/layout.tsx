import "./globals.css";
import type { Metadata } from "next";
import { TaskProvider } from "@/context/TaskProvider";
import { ToastProvider } from "@/context/ToastProvider";
import NavBar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Nan Task Planner",
  description: "Rishi's Simple Task Planner"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const isLoginPage =
    typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ToastProvider>
          <TaskProvider>
            {!isLoginPage && <NavBar />}
            {children}
          </TaskProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
