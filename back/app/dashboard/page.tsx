import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import StatusBadge from "@/app/components/StatusBadge";
import PriorityBadge from "@/app/components/PriorityBadge";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Vista general de tus proyectos y tareas.",
};

const PRIORITY_DOT: Record<string, string> = {
  LOW: "bg-slate-300",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-orange-500",
  URGENT: "bg-rose-500",
};

export default async function DashboardPage() {
  const session = await requireSession();

  const [projects, myTasks, userCount, totalTasks, doneTasks] = await Promise.all([
    prisma.project.findMany({
      include: { tasks: { select: { status: true } }, owner: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.task.findMany({
      where: { assigneeId: session.id },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "DONE" } }),
  ]);

  const totalProjects = await prisma.project.count();
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const today = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={session.name} userRole={session.role} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 capitalize">{today}</p>
            <h1 className="text-xl font-semibold text-slate-800 mt-0.5">
              Hola, <span className="text-violet-600">{session.name.split(" ")[0]}</span>
            </h1>
          </div>
          {session.role !== "COLLABORATOR" && (
            <Link href="/projects/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              Nuevo proyecto
            </Link>
          )}
        </header>

        <main className="flex-1 px-8 py-7 space-y-7">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Proyectos activos", value: totalProjects, border: "border-l-violet-500",
                icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg> },
              { label: "Tareas totales", value: totalTasks, border: "border-l-sky-500",
                icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
              { label: "Miembros del equipo", value: userCount, border: "border-l-emerald-500",
                icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M19 7c0 2.2-1.8 4-4 4M21 21v-2a4 4 0 00-3-3.87"/></svg> },
              { label: "Completado", value: `${progress}%`, border: "border-l-amber-500",
                extra: (
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                ),
                icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
            ].map((s) => (
              <div key={s.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${s.border} px-5 py-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-400">{s.icon}</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                {s.extra}
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-5 gap-6">

            {/* Projects list */}
            <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Proyectos recientes</h2>
                <Link href="/projects" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                  Ver todos →
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {projects.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    No hay proyectos todavía
                  </div>
                ) : (
                  projects.map((p) => {
                    const done = p.tasks.filter((t) => t.status === "DONE").length;
                    const pct = p.tasks.length > 0 ? Math.round((done / p.tasks.length) * 100) : 0;
                    return (
                      <Link key={p.id} href={`/projects/${p.id}`}
                        className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 group-hover:text-violet-600 truncate transition-colors">{p.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-slate-100 rounded-full h-1">
                              <div className="bg-violet-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 flex-shrink-0">{pct}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-slate-400">{p.tasks.length} tareas</span>
                          <StatusBadge status={p.status} />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* My tasks */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Mis tareas</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {myTasks.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    No tenés tareas asignadas
                  </div>
                ) : (
                  myTasks.map((t) => (
                    <div key={t.id} className="flex items-start gap-3 px-6 py-3.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRIORITY_DOT[t.priority] || "bg-slate-300"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 font-medium truncate">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.project.name}</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
