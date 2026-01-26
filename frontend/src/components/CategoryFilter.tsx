import Link from "next/link";

const categories = ["ALL", "IT", "REVIEW", "NON_IT"];

export default function CategoryFilter({
  active,
}: {
  active?: string;
}) {
  return (
    <div className="flex gap-2 mb-4">
      {categories.map((cat) => {
        const isActive =
          (cat === "ALL" && !active) || cat === active;

        const href =
          cat === "ALL" ? "/projects" : `/projects?category=${cat}`;

        return (
          <Link
            key={cat}
            href={href}
            className={`px-3 py-1 rounded border text-sm ${
              isActive
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
