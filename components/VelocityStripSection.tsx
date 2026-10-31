"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import VelocityStrip from "./VelocityStrip";

export default function VelocityStripSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Check if section is in view and should be active
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Activate when section is mostly visible
          if (entry.intersectionRatio > 0.8) {
            setIsActive(true);
            setHasEntered(true);
            // Stop Lenis scrolling when strip is active
            document.documentElement.classList.add("lenis-stopped");
          } else if (hasEntered && entry.intersectionRatio < 0.3) {
            setIsActive(false);
            document.documentElement.classList.remove("lenis-stopped");
          }
        });
      },
      {
        threshold: [0, 0.3, 0.5, 0.8, 1],
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [hasEntered]);

  // Handle escape from strip mode to continue scrolling
  const handleEscape = useCallback(() => {
    setIsActive(false);
    document.documentElement.classList.remove("lenis-stopped");

    // Scroll to next section
    const section = sectionRef.current;
    if (section) {
      const nextSection = section.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "100vh" }}
    >
      {/* Section header */}
      <div
        className={`absolute top-8 left-8 z-20 transition-opacity duration-500 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-[#a3a3a3] mb-2">
          Featured Collection
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight">
          Explore
        </h2>
      </div>

      {/* VelocityStrip container */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isActive ? "opacity-100 pointer-events-auto" : "opacity-70 pointer-events-none"
        }`}
      >
        <VelocityStrip onEscape={handleEscape} isActive={isActive} />
      </div>

      {/* Scroll hint when not active */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-xs uppercase tracking-widest text-[#a3a3a3]">
          Scroll to enter
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#a3a3a3] to-transparent" />
      </div>

      {/* Exit hint when active */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={handleEscape}
          className="text-xs uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors"
        >
          Press ESC to continue
        </button>
      </div>
    </section>
  );
}
