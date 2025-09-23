import "./globals.css";
import type { Metadata } from "next";
import { TaskProvider } from "@/context/TaskProvider";
import { ToastProvider } from "@/context/ToastProvider";
import NavBar from "@/components/Navbar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Nan Task Planner",
  description: "Rishi's Simple Task Planner"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // read cookie server-side
  // cookies() is a dynamic API and should be awaited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookieStore = (await cookies()) as any;
  const access = cookieStore?.get("access")?.value || "";

  const showNav = access === "granted";

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ToastProvider>
          <TaskProvider>
            {showNav && <NavBar />}
            {children}

            <footer className="py-4 border-t border-gray-700 text-sm text-gray-300 px-6">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                  © {new Date().getFullYear()} Hrishikesh Reddy Tolmamdi
                </div>
                <div>
                  <a href="mailto:smrishin@gmail.com" className="underline">
                    smrishin@gmail.com
                  </a>
                  <span className="mx-2">•</span>
                  <a
                    href="https://github.com/smrishin/simple-task-planner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    GitHub Repo
                  </a>
                </div>
              </div>
            </footer>
          </TaskProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
