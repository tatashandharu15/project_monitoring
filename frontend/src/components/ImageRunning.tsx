"use client";

import Image from "next/image";

export default function ImageRunning({ images }: { images: string[] }) {
  // Jika tidak ada gambar, sembunyikan section agar rapi
  if (!images || images.length === 0) {
    return null;
  }

  // Gandakan array agar looping seamless
  let displayImages = [...images];
  while (displayImages.length < 15) {
    displayImages = [...displayImages, ...images];
  }

  return (
    <div className="w-full overflow-hidden mt-10 mb-6 relative z-0">
      {/* Masking gradients yang sesuai dengan background halaman */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll gap-16 w-max items-center py-2">
        {displayImages.map((img, i) => (
          <div 
            key={`${img}-${i}`} 
            className="relative h-12 w-32 flex-shrink-0 transition-all duration-500 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
          >
            <Image 
              src={`/logos/${img}`} 
              alt="Logo" 
              fill
              className="object-contain"
              sizes="128px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
