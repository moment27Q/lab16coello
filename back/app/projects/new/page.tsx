import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";

export const metadata: Metadata = {
  title: "Nuevo Proyecto",
  description: "Creá un nuevo proyecto para tu equipo.",
};

export default async function NewProjectPage() {
  const session = await requireSession();
  if (session.role === "COLLABORATOR") redirect("/projects");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={session.name} userRole={session.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <Link href="/projects" className="text-xs text-slate-400 hover:text-violet-600 transition-colors">← Proyectos</Link>
          <h1 className="text-xl font-semibold text-slate-800 mt-0.5">Nuevo proyecto</h1>
        </header>
        <main className="flex-1 px-8 py-7">
          <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-8">
            <NewProjectForm />
          </div>
        </main>
      </div>
    </div>
  );
}
