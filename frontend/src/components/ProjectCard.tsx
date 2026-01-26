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

export default function ProjectCard({ project, showAnalysis = true, id }: { project: any, showAnalysis?: boolean, id?: string }) {
  const isIT = project.category === "IT";
  
  return (
    <div 
      id={id}
      className={`group flex flex-col h-full rounded-xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${
      isIT 
        ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" 
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <Badge category={project.category} />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {project.lpse}
        </span>
      </div>
      
      <h3 
        className="font-bold text-lg leading-tight mb-4 text-gray-900 dark:text-white line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        dangerouslySetInnerHTML={{
          __html: project.category === 'IT' ? highlight(project.judul, project.matched_keywords) : project.judul,
        }}
      />

      <div className="mt-auto space-y-3">
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400">HPS</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Rp {project.hps_value.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400">Satker</span>
            <span className="truncate max-w-[150px] md:max-w-[200px] font-medium" title={project.satker}>
              {project.satker}
            </span>
          </div>
        </div>

        {showAnalysis && project.ai_reason && (
          <div className={`p-3 text-xs rounded-lg border ${
            (project.ai_reason.toLowerCase().includes("error") || 
             project.ai_reason.toLowerCase().includes("limit") ||
             project.ai_reason.toLowerCase().includes("disabled"))
              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800"
          }`}>
            <strong className="block mb-1 opacity-75">AI Analysis:</strong> 
            <span className="leading-relaxed">{project.ai_reason}</span>
          </div>
        )}
        
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-gray-400 font-medium px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded">
            {project.tahap || "-"}
          </span>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            Detail LPSE 
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}