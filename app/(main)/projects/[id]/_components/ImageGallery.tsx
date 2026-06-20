"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
        <ImageOff size={32} className="text-gray-300" />
      </div>
    );
  }

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div>
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ height: 320 }}>
        <img
          src={images[active]}
          alt={`${alt} 레퍼런스 ${active + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0"
              style={{ borderColor: i === active ? "#b26efd" : "transparent" }}
            >
              <img src={src} alt={`썸네일 ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
