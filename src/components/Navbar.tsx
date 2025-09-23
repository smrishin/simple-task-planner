"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      // redirect after server clears cookie
      window.location.href = "/";
    });
  };

  return (
    <nav className="flex items-center gap-6 p-4 bg-gray-800 shadow-md ">
      {/* Logo / Image (clickable link to /view) */}
      <Link href="/view" className="flex items-center gap-2">
        <Image
          src="/images/coder.png"
          alt="Logo"
          width={40}
          height={40}
          unoptimized
        />
      </Link>

      {/* Links */}
      <Link
        href="/view"
        className={`hover:text-indigo-400 ${
          pathname === "/view" ? "text-indigo-400 font-bold" : ""
        }`}
      >
        View
      </Link>
      <Link
        href="/edit"
        className={`hover:text-indigo-400 ${
          pathname === "/edit" ? "text-indigo-400 font-bold" : ""
        }`}
      >
        Edit
      </Link>

      <Link
        href="/deleted"
        className={`hover:text-indigo-400 ${
          pathname === "/deleted" ? "text-indigo-400 font-bold" : ""
        }`}
      >
        Deleted
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="ml-auto px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}
