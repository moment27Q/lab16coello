import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      tasks: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  if (session.role === "COLLABORATOR") {
    return Response.json({ error: "Sin permisos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, status } = schema.parse(body);

    const project = await prisma.project.create({
      data: { name, description, status: status || "ACTIVE", ownerId: session.id },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
        tasks: true,
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0].message }, { status: 400 });
    }
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
