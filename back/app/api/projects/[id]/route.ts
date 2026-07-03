import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]).optional(),
});

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) return Response.json({ error: "Proyecto no encontrado" }, { status: 404 });
  return Response.json({ project });
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return Response.json({ error: "Proyecto no encontrado" }, { status: 404 });

  if (session.role === "COLLABORATOR") {
    return Response.json({ error: "Sin permisos" }, { status: 403 });
  }
  if (session.role === "LEADER" && project.ownerId !== session.id) {
    return Response.json({ error: "Sin permisos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const updated = await prisma.project.update({
      where: { id },
      data,
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        tasks: true,
      },
    });
    return Response.json({ project: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0].message }, { status: 400 });
    }
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/projects/[id]">) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  if (session.role !== "ADMIN") {
    return Response.json({ error: "Solo administradores pueden eliminar proyectos" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.project.delete({ where: { id } });
  return Response.json({ ok: true });
}
