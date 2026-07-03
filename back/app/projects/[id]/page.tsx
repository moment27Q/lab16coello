import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import StatusBadge from "@/app/components/StatusBadge";
import ProjectDetail from "./ProjectDetail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  return {
    title: project?.name || "Proyecto",
    description: project?.description || "Detalle del proyecto y sus tareas.",
  };
}

export default async function ProjectPage({ params }: Props) {
  const session = await requireSession();
  const { id } = await params;

  const [project, users] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        tasks: {
          include: { assignee: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true, role: true }, orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  const done = project.tasks.filter((t) => t.status === "DONE").length;
  const pct = project.tasks.length > 0 ? Math.round((done / project.tasks.length) * 100) : 0;

  const canEdit = session.role === "ADMIN" || (session.role === "LEADER" && project.ownerId === session.id);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={session.name} userRole={session.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <Link href="/projects" className="text-xs text-slate-400 hover:text-violet-600 transition-colors">← Proyectos</Link>
            <div className="flex items-center gap-3 mt-0.5">
              <h1 className="text-xl font-semibold text-slate-800">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
          </div>
          {canEdit && (
            <Link href={`/projects/${id}/edit`}
              className="text-sm text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              Editar
            </Link>
          )}
        </header>

        <main className="flex-1 px-8 py-7">
          {/* Project info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-start gap-6 flex-wrap">
              {project.description && (
                <p className="text-sm text-slate-500 flex-1">{project.description}</p>
              )}
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Responsable</p>
                  <p className="font-medium text-slate-700">{project.owner.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tareas</p>
                  <p className="font-medium text-slate-700">{project.tasks.length} · {done} listas</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Avance</p>
                  <p className="font-medium text-slate-700">{pct}%</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-violet-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          <ProjectDetail project={project} users={users} session={session} />
        </main>
      </div>
    </div>
  );
}
