"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/app/components/StatusBadge";
import PriorityBadge from "@/app/components/PriorityBadge";
import type { JWTPayload } from "@/lib/auth";

type User = { id: string; name: string; role: string };
type Task = {
  id: string; title: string; description: string | null; status: string; priority: string;
  dueDate: Date | null; assignee: { id: string; name: string } | null;
};
type Project = { id: string; ownerId: string; tasks: Task[] };

export default function ProjectDetail({
  project, users, session,
}: { project: Project; users: User[]; session: JWTPayload }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "", assigneeId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const canManage = session.role === "ADMIN" || session.role === "LEADER";

  function resetForm() {
    setForm({ title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "", assigneeId: "" });
    setShowForm(false);
    setEditTask(null);
    setError("");
  }

  function openEdit(task: Task) {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      assigneeId: task.assignee?.id || "",
    });
    setEditTask(task);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { ...form, projectId: project.id, assigneeId: form.assigneeId || undefined, dueDate: form.dueDate || undefined };
      const url = editTask ? `/api/tasks/${editTask.id}` : "/api/tasks";
      const method = editTask ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); return; }
      resetForm();
      router.refresh();
    } catch { setError("Error de conexión"); } finally { setLoading(false); }
  }

  async function deleteTask(id: string) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteProject() {
    if (!confirm("¿Eliminar este proyecto y todas sus tareas?")) return;
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/projects");
    router.refresh();
  }

  const filtered = filterStatus === "ALL" ? project.tasks : project.tasks.filter((t) => t.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Tareas</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos</option>
            <option value="TODO">Por hacer</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="REVIEW">En revisión</option>
            <option value="DONE">Listo</option>
          </select>
          <button
            onClick={() => { setShowForm(!showForm); setEditTask(null); }}
            className="inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            + Tarea
          </button>
          {session.role === "ADMIN" && (
            <button onClick={deleteProject} className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition">
              Eliminar proyecto
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">{editTask ? "Editar tarea" : "Nueva tarea"}</h3>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required minLength={2} placeholder="Nombre de la tarea"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Detalles de la tarea..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                  <option value="TODO">Por hacer</option>
                  <option value="IN_PROGRESS">En progreso</option>
                  <option value="REVIEW">En revisión</option>
                  <option value="DONE">Listo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
                <select value={form.assigneeId} onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                  <option value="">Sin asignar</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm}
                className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition">
                {loading ? "Guardando..." : editTask ? "Actualizar" : "Crear tarea"}
              </button>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-gray-400 text-sm">No hay tareas {filterStatus !== "ALL" ? "con este estado" : "en este proyecto"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-gray-800">{task.title}</span>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    {task.assignee && <span>Asignado: {task.assignee.name}</span>}
                    {task.dueDate && <span>Vence: {new Date(task.dueDate).toLocaleDateString("es-AR")}</span>}
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(task)}
                      className="text-xs text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition">
                      Editar
                    </button>
                    <button onClick={() => deleteTask(task.id)}
                      className="text-xs text-red-500 border border-red-100 px-2.5 py-1 rounded-lg hover:bg-red-50 transition">
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
