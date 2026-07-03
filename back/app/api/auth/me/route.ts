import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
  return Response.json({ user });
}

export async function DELETE() {
  const response = Response.json({ ok: true });
  const res = new Response(response.body, response);
  res.headers.set("Set-Cookie", "auth-token=; HttpOnly; Path=/; Max-Age=0");
  return res;
}
