"use client";

import { useEffect, useState } from "react";

export default function ITAlert({ projects }: { projects: any[] }) {
  const [visible, setVisible] = useState(false);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    // Filter proyek IT
    const itProjects = projects.filter((p) => p.category === "IT");
    
    if (itProjects.length > 0) {
      // Ambil yang paling baru (asumsi index 0 paling baru)
      const newestIT = itProjects[0];
      
      // Cek apakah sudah pernah dilihat sebelumnya
      const lastSeen = localStorage.getItem("lastAckITProject");
      
      if (lastSeen !== newestIT.url) {
        setProject(newestIT);
        setVisible(true);
      }
    }
  }, [projects]);

  const handleClose = () => {
    if (project) {
      localStorage.setItem("lastAckITProject", project.url);
    }
    setVisible(false);
  };

  const handleDetail = () => {
    if (project) {
      // Tandai sudah dilihat
      localStorage.setItem("lastAckITProject", project.url);
      setVisible(false);
      
      // Scroll ke elemen card
      // Kita perlu pastikan ProjectCard memiliki ID yang sesuai.
      // Di ProjectCard kita akan gunakan btoa(url) sebagai ID atau similar.
      // Mari kita gunakan encodeURIComponent(project.url) sebagai ID.
      const elementId = `project-${encodeURIComponent(project.url)}`;
      const element = document.getElementById(elementId);
      
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Tambahkan highlight effect sementara
        element.classList.add("ring-4", "ring-green-500", "ring-opacity-50");
        setTimeout(() => {
          element.classList.remove("ring-4", "ring-green-500", "ring-opacity-50");
        }, 3000);
      } else {
        // Fallback jika elemen tidak ditemukan (misal di halaman lain), buka link
        window.open(project.url, "_blank");
      }
    }
  };

  if (!visible || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-gray-700 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-green-600 dark:text-green-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            IT Project Detected!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            Ditemukan proyek baru kategori IT:<br/>
            <span className="font-bold text-gray-800 dark:text-gray-100 mt-1 block text-base">
              {project.judul}
            </span>
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:ring-4 focus:ring-gray-400 outline-none"
            >
              Close
            </button>
            <button
              onClick={handleDetail}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] focus:ring-4 focus:ring-green-400 outline-none"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
