"use client";

import SafeImage from "./SafeImage";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  collapsible?: boolean;
}

export default function ImageGallery({
  images,
  title = "Gallery",
  collapsible = true,
}: ImageGalleryProps) {
  const [expanded, setExpanded] = useState(!collapsible);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (images.length === 0) return null;

  const visible = expanded ? images : images.slice(0, 3);

  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        {collapsible && images.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-amber-700 transition-colors hover:text-amber-900"
          >
            {expanded ? "Show less" : `Show all (${images.length})`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setLightbox(src)}
            className="interactive relative aspect-video overflow-hidden rounded-xl border border-stone-100"
          >
            <SafeImage src={src} alt={`${title} ${i + 1}`} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width:768px) 50vw,200px" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative h-[70vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <SafeImage src={lightbox} alt="Expanded view" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}
