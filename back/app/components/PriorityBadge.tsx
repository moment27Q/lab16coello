const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-500",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_STYLES[priority] || "bg-gray-100 text-gray-500"}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}
