import "./globals.css";
import type { Metadata } from "next";
import { TaskProvider } from "@/context/TaskProvider";
import { ToastProvider } from "@/context/ToastProvider";
import NavBar from "@/components/Navbar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Nan Task Planner",
  description: "Rishi's Simple Task Planner",
  icons: {
    icon: "/favicon.ico"
  }
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
      <head>
        {/* explicit favicon links for better browser compatibility */}
        <link rel="icon" href="/favicon.ico" />
        {/* web app manifest for add-to-home-screen on Android/Chrome */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* iOS / Safari: use app-icon.png (place a PNG in public/) for reliable home-screen icon */}
        <link rel="apple-touch-icon" href="/app-icon.png" />
        {/* PNG favicons as fallbacks (helpful on some hosts/browsers) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/app-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/app-icon.png"
        />
      </head>
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
