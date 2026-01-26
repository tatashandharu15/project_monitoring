import { fetchProjects } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectRunning from "@/components/ProjectRunning";
import ImageRunning from "@/components/ImageRunning";
import RefreshButton from "@/components/RefreshButton";
import ITAlert from "@/components/ITAlert";
import fs from "fs";
import path from "path";

type Project = {
  url: string;
  judul: string;
  lpse: string;
  satker: string;
  hps_value: number;
  category: string;
  matched_keywords?: string[];
  tahap?: string;
  ai_reason?: string;
};

export default async function DashboardPage() {
  const projects = (await fetchProjects()) as Project[];

  const recentProjects = projects.slice(0, 6);
  const runningProjects = projects.slice(0, 10);

  // Ambil list logo dari folder public/logos
  const logosDir = path.join(process.cwd(), "public/logos");
  let logoFiles: string[] = [];
  try {
    if (fs.existsSync(logosDir)) {
      logoFiles = fs.readdirSync(logosDir).filter(file => 
        /\.(png|jpe?g|svg|webp)$/i.test(file)
      );
    }
  } catch (e) {
    console.error("Error reading logos directory:", e);
  }

  return (
    <div className="h-screen max-h-screen flex flex-col p-4 lg:p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <ITAlert projects={recentProjects} />
      
      {/* Header with Running Logo - Fixed Height */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0 h-16 gap-4">
        <div className="flex-1 min-w-0 h-full relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
           <ImageRunning images={logoFiles} />
        </div>
        <div className="flex-shrink-0 transform scale-90">
          <RefreshButton />
        </div>
      </div>

      {/* Running Text - Compact */}
      <div className="flex-shrink-0 mb-4">
        <ProjectRunning projects={runningProjects} />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-0">
        {recentProjects.map((p) => (
          <ProjectCard 
            key={p.url} 
            project={p} 
            id={`project-${encodeURIComponent(p.url)}`}
          />
        ))}
      </div>
    </div>
  );
}
