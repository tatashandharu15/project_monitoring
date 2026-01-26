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
      className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all shadow hover:shadow-md flex items-center gap-2"
    >
      <span className={loading ? "animate-spin" : ""}>🔄</span>
      {loading ? "Sync..." : "Refresh"}
    </button>
  );
}