"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "https://picsum.photos/seed/caterers-fallback/800/600";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  priority,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  const [loaded, setLoaded] = useState(false);

  const props = {
    src: imgSrc || FALLBACK,
    alt,
    className: `${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`,
    onError: () => setImgSrc(FALLBACK),
    onLoad: () => setLoaded(true),
    sizes,
    priority,
  };

  if (fill) {
    return (
      <div className="relative h-full w-full bg-stone-100">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-stone-200" />}
        <Image {...props} fill />
      </div>
    );
  }

  return (
    <div className="relative inline-block bg-stone-100" style={{ width, height }}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-stone-200" />}
      <Image {...props} width={width!} height={height!} />
    </div>
  );
}
