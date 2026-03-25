"use client";

import Image from "next/image";
import { useState } from "react";

export function HomeHeroMedia({
  imageUrl,
  imageAlt,
}: {
  imageUrl: string | null;
  imageAlt: string;
}) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="absolute inset-0">
      {imageUrl ? (
        <Image
          alt={imageAlt}
          className={`object-cover transition duration-700 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
          fill
          priority
          sizes="100vw"
          src={imageUrl}
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_22%),linear-gradient(90deg,#0f5a5a_0%,#1e8b88_32%,#9be2df_50%,#146969_72%,#0f4a4a_100%)]" />
      )}

      <video
        aria-hidden="true"
        autoPlay
        className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        loop
        muted
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        playsInline
        preload="auto"
      >
        <source src="/api/assets/hero-video" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,20,0.28)_0%,rgba(9,19,19,0.12)_26%,rgba(7,15,15,0.36)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.22),transparent_24%)]" />
    </div>
  );
}
