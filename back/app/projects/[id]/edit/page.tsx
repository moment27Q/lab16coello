import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import EditProjectForm from "./EditProjectForm";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Editar Proyecto" };

export default async function EditProjectPage({ params }: Props) {
  const session = await requireSession();
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const canEdit = session.role === "ADMIN" || (session.role === "LEADER" && project.ownerId === session.id);
  if (!canEdit) redirect("/projects");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={session.name} userRole={session.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <Link href={`/projects/${id}`} className="text-xs text-slate-400 hover:text-violet-600 transition-colors">← Volver al proyecto</Link>
          <h1 className="text-xl font-semibold text-slate-800 mt-0.5">Editar proyecto</h1>
        </header>
        <main className="flex-1 px-8 py-7">
          <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-8">
            <EditProjectForm project={project} />
          </div>
        </main>
      </div>
    </div>
  );
}
