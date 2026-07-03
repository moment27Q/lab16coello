const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  COMPLETED: "Completado",
  ON_HOLD: "En espera",
  CANCELLED: "Cancelado",
  TODO: "Por hacer",
  IN_PROGRESS: "En progreso",
  REVIEW: "En revisión",
  DONE: "Listo",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
