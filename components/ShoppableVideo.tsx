"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Product } from "@/lib/designers";
import { formatPrice } from "@/lib/utils";

interface ShoppableVideoProps {
  product: Product;
  relatedProducts: Product[];
  accentColor: string;
}

// Mock hotspots for products in the video
const videoHotspots = [
  { id: 1, x: 35, y: 45, timestamp: 2 },
  { id: 2, x: 65, y: 55, timestamp: 5 },
  { id: 3, x: 50, y: 70, timestamp: 8 },
];

export default function ShoppableVideo({ product, relatedProducts, accentColor }: ShoppableVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProducts, setShowProducts] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);

  // Simulate video progress
  const handlePlay = () => {
    setIsPlaying(true);
    // Simulate video progress for demo
    const interval = setInterval(() => {
      setCurrentTime((t) => {
        if (t >= 10) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return t + 0.1;
      });
    }, 100);
  };

  const productsToShow = [product, ...relatedProducts.slice(0, 2)];

  return (
    <div className="bg-neutral-900 rounded-sm overflow-hidden">
      {/* Video Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-white/60">Shoppable Video</span>
        </div>
        <button
          onClick={() => setShowProducts(!showProducts)}
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          {showProducts ? "Hide" : "Show"} Products
        </button>
      </div>

      {/* Video Container */}
      <div className="relative aspect-[9/16] sm:aspect-video bg-black">
        {/* Mock video background - using product image */}
        <div
          ref={videoRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${product.image})`,
            filter: isPlaying ? "none" : "brightness(0.7)",
          }}
        />

        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Play button */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </button>
        )}

        {/* Hotspots */}
        {showProducts && videoHotspots.map((hotspot, idx) => {
          const hotspotProduct = productsToShow[idx];
          if (!hotspotProduct) return null;

          const isActive = activeHotspot === hotspot.id || (isPlaying && Math.abs(currentTime - hotspot.timestamp) < 1);

          return (
            <div
              key={hotspot.id}
              className={`absolute transition-all duration-300 ${isActive ? "scale-110 z-20" : "z-10"}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              {/* Hotspot pulse */}
              <div className="relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${isActive ? "" : "animate-pulse"}`}
                  style={{ backgroundColor: accentColor }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="black">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>

                {/* Product card popup */}
                {isActive && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 animate-fade-up">
                    <Link href={`/product/${hotspotProduct.id}`} className="block">
                      <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-sm overflow-hidden">
                        <div className="aspect-square">
                          <img
                            src={hotspotProduct.image}
                            alt={hotspotProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
                            {hotspotProduct.category}
                          </p>
                          <p className="text-sm text-white font-medium line-clamp-1 mb-1">
                            {hotspotProduct.name}
                          </p>
                          <p className="text-sm" style={{ color: accentColor }}>
                            {formatPrice(hotspotProduct.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${(currentTime / 10) * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>

        {/* Video controls overlay */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => setIsPlaying(false)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Tap products to shop</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products strip */}
      {showProducts && (
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Featured in this video</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {productsToShow.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="flex-shrink-0 w-24 group"
              >
                <div className="aspect-square rounded-sm overflow-hidden mb-2 bg-neutral-800">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[10px] text-white/60 line-clamp-1">{p.name}</p>
                <p className="text-xs" style={{ color: accentColor }}>{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
