export default function StatusBadge({
  category,
}: {
  category: string;
}) {
  const color =
    category === "IT"
      ? "bg-green-600"
      : category === "REVIEW"
      ? "bg-yellow-500"
      : "bg-gray-500";

  const label = 
    category === "NON_IT" || category === "NON-IT" 
      ? "Non IT" 
      : category;

  return (
    <span className={`px-2 py-1 lg:px-3 lg:py-1.5 text-white rounded text-xs lg:text-sm font-bold ${color}`}>
      {label}
    </span>
  );
}
