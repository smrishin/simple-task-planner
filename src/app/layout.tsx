import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Simple task manager with Next.js + Redis"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
