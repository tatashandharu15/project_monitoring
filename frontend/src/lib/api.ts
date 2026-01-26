const API_BASE = process.env.API_URL || "http://127.0.0.1:8000/api";

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
  return res.json();
}

export async function fetchProjects(category?: string, refresh: boolean = false) {
  let url = `${API_BASE}/projects?`;
  
  if (category) {
    url += `category=${category}&`;
  }
  
  if (refresh) {
    url += `refresh=true&`;
  }

  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}
