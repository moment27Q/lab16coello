"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", status: "ACTIVE" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al crear"); return; }
      router.push(`/projects/${data.project.id}`);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Nombre del proyecto *</label>
        <input
          type="text" name="name" value={form.name} onChange={handleChange}
          required minLength={2} placeholder="Ej: Rediseño de sitio web"
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Descripción</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          rows={4} placeholder="Describe el objetivo del proyecto..."
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">Estado inicial</label>
        <select
          name="status" value={form.status} onChange={handleChange}
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition bg-white"
        >
          <option value="ACTIVE">Activo</option>
          <option value="ON_HOLD">En espera</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-violet-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-60 transition">
          {loading ? "Creando..." : "Crear proyecto"}
        </button>
      </div>
    </form>
  );
}
