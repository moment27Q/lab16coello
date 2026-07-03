import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import StatusBadge from "@/app/components/StatusBadge";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Listado de todos los proyectos activos y archivados.",
};

export default async function ProjectsPage() {
  const session = await requireSession();

  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { id: true, name: true } },
      tasks: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const canCreate = session.role !== "COLLABORATOR";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={session.name} userRole={session.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">{projects.length} proyecto{projects.length !== 1 ? "s" : ""}</p>
            <h1 className="text-xl font-semibold text-slate-800 mt-0.5">Proyectos</h1>
          </div>
          {canCreate && (
            <Link href="/projects/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              Nuevo proyecto
            </Link>
          )}
        </header>

        <main className="flex-1 px-8 py-7">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200">
              <svg width="40" height="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3">
                <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
              </svg>
              <p className="text-slate-400 text-sm">No hay proyectos todavía</p>
              {canCreate && (
                <Link href="/projects/new" className="mt-3 text-violet-600 text-sm font-medium hover:underline">
                  Crear el primero
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {projects.map((p) => {
                const done = p.tasks.filter((t) => t.status === "DONE").length;
                const pct = p.tasks.length > 0 ? Math.round((done / p.tasks.length) * 100) : 0;
                return (
                  <Link key={p.id} href={`/projects/${p.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                        <svg width="16" height="16" fill="none" stroke="#7c3aed" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                        </svg>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-1 mb-1">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{p.description}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>{p.tasks.length} tareas</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-violet-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-3">— {p.owner.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
