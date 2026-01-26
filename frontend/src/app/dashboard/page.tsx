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
    <div className="p-8">
      <ITAlert projects={recentProjects} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Pengadaan</h1>
      </div>

      <ProjectRunning projects={runningProjects} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentProjects.map((p: any) => (
          <ProjectCard 
            key={p.url} 
            project={p} 
            id={`project-${encodeURIComponent(p.url)}`}
          />
        ))}
      </div>

      <ImageRunning images={logoFiles} />

      <div className="flex justify-center mt-8">
        <RefreshButton />
      </div>
    </div>
  );
}
