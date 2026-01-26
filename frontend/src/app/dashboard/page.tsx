import { fetchProjects } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectRunning from "@/components/ProjectRunning";
import ImageRunning from "@/components/ImageRunning";
import RefreshButton from "@/components/RefreshButton";
import ITAlert from "@/components/ITAlert";
import fs from "fs";
import path from "path";

export default async function DashboardPage() {
  const projects = await fetchProjects();

  // Ambil 6 proyek terbaru agar grid rapi (2x3 atau 3x2)
  const recentProjects = projects.slice(0, 6);
  // Ambil 10 proyek untuk running ticker
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
      
      {/* Header Compact - Fixed Height */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0 h-16">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Pengadaan</h1>
        <div className="transform scale-75 origin-right">
          <RefreshButton />
        </div>
      </div>

      {/* Running Text - Compact */}
      <div className="flex-shrink-0 mb-4">
        <ProjectRunning projects={runningProjects} />
      </div>

      {/* Main Grid - Auto Height to Fill */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {recentProjects.map((p: any) => (
          <ProjectCard 
            key={p.url} 
            project={p} 
            id={`project-${encodeURIComponent(p.url)}`}
          />
        ))}
      </div>

      {/* Footer / Image Ticker - Compact */}
      <div className="flex-shrink-0 h-16 lg:h-20 mt-auto">
        <ImageRunning images={logoFiles} />
      </div>
    </div>
  );
}
