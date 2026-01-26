"use client";

import Badge from "./StatusBadge";

export default function ProjectRunning({ projects }: { projects: any[] }) {
  // Gandakan array agar looping seamless
  const runningProjects = [...projects, ...projects];

  return (
    <div className="w-full overflow-hidden mb-8 py-2 relative group">
      {/* Masking gradients untuk efek fade di kiri/kanan */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll gap-4 w-max">
        {runningProjects.map((p, i) => {
          const isIT = p.category === "IT";
          return (
            <div key={`${p.url}-${i}`} className="w-[450px] flex-shrink-0">
               <div className={`border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-24 ${
                 isIT 
                   ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" 
                   : "bg-white dark:bg-gray-800 dark:border-gray-700"
               }`}>
                  <div className="flex justify-between items-center mb-1">
                      <Badge category={p.category} />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {p.lpse}
                    </span>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1 mb-1" title={p.judul}>
                    {p.judul}
                </h4>
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50 pt-1 mt-auto">
                    <span className="truncate max-w-[200px]" title={p.satker}>{p.satker}</span>
                    <span className="font-bold text-gray-900 dark:text-gray-200">Rp {p.hps_value.toLocaleString("id-ID")}</span>
                </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
