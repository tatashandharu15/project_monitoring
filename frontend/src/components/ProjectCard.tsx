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
      className={`group flex flex-col h-full rounded-lg border p-3 shadow-sm hover:shadow-md transition-all duration-300 ${
      isIT 
        ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" 
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <Badge category={project.category} />
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {project.lpse}
        </span>
      </div>
      
      <h3 
        className="font-bold text-sm leading-tight mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        dangerouslySetInnerHTML={{
          __html: project.category === 'IT' ? highlight(project.judul, project.matched_keywords) : project.judul,
        }}
      />

      <div className="mt-auto space-y-2">
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400">HPS</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Rp {project.hps_value.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400">Satker</span>
            <span className="truncate max-w-[150px] font-medium" title={project.satker}>
              {project.satker}
            </span>
          </div>
        </div>

        {showAnalysis && project.ai_reason && (
          <div className={`p-2 text-[10px] rounded border ${
            (project.ai_reason.toLowerCase().includes("error") || 
             project.ai_reason.toLowerCase().includes("limit") ||
             project.ai_reason.toLowerCase().includes("disabled"))
              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800"
          }`}>
            <strong className="block mb-0.5 opacity-75">AI:</strong> 
            <span className="leading-tight line-clamp-2">{project.ai_reason}</span>
          </div>
        )}
        
        <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 rounded text-[10px]">
            {project.tahap || "-"}
          </span>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow hover:scale-105 text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 outline-none"
          >
            Detail LPSE 
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}