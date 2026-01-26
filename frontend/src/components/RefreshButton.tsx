"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (confirm("Apakah Anda yakin ingin mengambil data terbaru dari sumber? Proses ini memakan waktu beberapa detik.")) {
      setLoading(true);
      try {
        // Panggil API dengan parameter refresh=true
        // Gunakan relative path /api yang akan di-proxy oleh Next.js atau Nginx
        await fetch("/api/projects?refresh=true");
        
        // Refresh halaman agar data baru muncul
        router.refresh();
      } catch (e) {
        console.error(e);
        alert("Gagal refresh data");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 lg:px-12 lg:py-6 rounded-xl text-base lg:text-xl font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 min-h-[64px] focus:ring-4 focus:ring-zinc-400 outline-none flex items-center gap-3"
    >
      <span className={loading ? "animate-spin text-2xl" : "text-2xl"}>{loading ? "⏳" : "🔄"}</span>
      {loading ? "Sedang Crawling & AI..." : "Refresh Data Sumber"}
    </button>
  );
}