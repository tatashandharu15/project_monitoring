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
    <div className="w-full overflow-hidden relative z-0 h-full flex items-center">
      {/* Masking gradients yang sesuai dengan background halaman */}
      <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll gap-8 w-max items-center">
        {displayImages.map((img, i) => (
          <div 
            key={`${img}-${i}`} 
            className="relative h-10 w-24 flex-shrink-0 transition-all duration-500 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
          >
            <Image 
              src={`/logos/${img}`} 
              alt="Logo" 
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
