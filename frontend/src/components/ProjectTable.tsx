import Badge from "./StatusBadge";

function highlight(text: string, keywords: string[]) {
  let result = text;

  keywords.forEach((kw) => {
    const regex = new RegExp(`(${kw})`, "gi");
    result = result.replace(
      regex,
      `<mark class="bg-yellow-200">$1</mark>`
    );
  });

  return result;
}

type Project = {
  url: string;
  judul: string;
  lpse: string;
  satker: string;
  hps_value: number;
  category: string;
  matched_keywords?: string[];
};

export default function ProjectTable({
  projects,
}: {
  projects: Project[];
}) {
  // 🔹 Dedup by URL
  const unique = Array.from(
    new Map(projects.map((p) => [p.url, p])).values()
  );

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Judul</th>
          <th className="p-2">LPSE</th>
          <th className="p-2">Satker</th>
          <th className="p-2">HPS</th>
          <th className="p-2">Kategori</th>
        </tr>
      </thead>
      <tbody>
        {unique.map((p) => (
          <tr key={p.url} className="border-t">
            <td
              className="p-2"
              dangerouslySetInnerHTML={{
                __html: highlight(p.judul, p.matched_keywords ?? []),
              }}
            />
            <td className="p-2">{p.lpse}</td>
            <td className="p-2">{p.satker}</td>
            <td className="p-2">
              Rp {p.hps_value.toLocaleString("id-ID")}
            </td>
            <td className="p-2">
              <Badge category={p.category} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
