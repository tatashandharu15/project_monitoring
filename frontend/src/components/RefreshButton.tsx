"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Stats = {
  total: number;
  it: number;
  non_it: number;
  review: number;
};

export default function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const [lastStats, setLastStats] = useState<Stats | null>(null);
  const router = useRouter();

  const handleRefresh = async () => {
    const ok = confirm(
      "Apakah Anda yakin ingin mengambil data terbaru dari sumber? Proses ini memakan waktu 1-2 menit tergantung respon server sumber."
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stats?refresh=true", { cache: "no-store" });
      if (!res.ok) {
        let errorMsg = `Server error: ${res.status} ${res.statusText}`;
        try {
          const text = await res.text();
          try {
            const errorBody = JSON.parse(text);
            if (errorBody.detail) {
              errorMsg += `\nDetail: ${errorBody.detail}`;
            } else {
               errorMsg += `\nBody: ${text.substring(0, 200)}`;
            }
          } catch {
             errorMsg += `\nRaw Body: ${text.substring(0, 200)}`;
          }
        } catch (e) {
          errorMsg += "\n(Could not read response body)";
        }
        throw new Error(errorMsg);
      }
      const stats = (await res.json()) as Stats;
      setLastStats(stats);
      router.refresh();
    } catch (e: any) {
      console.error(e);
      alert(`Gagal refresh data:\n${e.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const stats = (await res.json()) as Stats;
        if (!cancelled) {
          setLastStats(stats);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadInitialStats();

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/stats?refresh=true", {
          cache: "no-store",
        });
        const stats = (await res.json()) as Stats;

        if (!cancelled) {
          if (
            !lastStats ||
            stats.total !== lastStats.total ||
            stats.it !== lastStats.it ||
            stats.non_it !== lastStats.non_it ||
            stats.review !== lastStats.review
          ) {
            setLastStats(stats);
            router.refresh();
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router, lastStats]);

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
