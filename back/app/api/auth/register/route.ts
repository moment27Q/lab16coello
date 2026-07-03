import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "LEADER", "COLLABORATOR"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email ya registrado" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "COLLABORATOR" },
    });

    const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    const res = Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    const response = new Response(res.body, res);
    response.headers.set(
      "Set-Cookie",
      `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
    );
    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues[0].message }, { status: 400 });
    }
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
