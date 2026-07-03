"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ userName, userRole }: { userName: string; userRole: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    LEADER: "bg-blue-100 text-blue-700",
    COLLABORATOR: "bg-green-100 text-green-700",
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    LEADER: "Líder",
    COLLABORATOR: "Colaborador",
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              ProjetFlow
            </Link>
            <div className="hidden sm:flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/projects" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                Proyectos
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[userRole] || "bg-gray-100 text-gray-700"}`}>
              {roleLabels[userRole] || userRole}
            </span>
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{userName}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">{userName}</div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
