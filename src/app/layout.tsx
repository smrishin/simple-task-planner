import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ToastProvider";
import NavBar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Simple task manager with Next.js + Redis"
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
          {!isLoginPage && <NavBar />}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
