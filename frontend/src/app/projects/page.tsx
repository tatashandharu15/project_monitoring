import { fetchProjects } from "@/lib/api";
import CategoryFilter from "@/components/CategoryFilter";
import ProjectTable from "@/components/ProjectTable";
import RefreshButton from "@/components/RefreshButton";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const projects = await fetchProjects(category);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Proyek Pengadaan</h1>
        <RefreshButton />
      </div>

      <CategoryFilter active={category} />

      <ProjectTable projects={projects} />
    </div>
  );
}
