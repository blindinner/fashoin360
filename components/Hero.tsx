"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(titleRef.current, {
        y: 200,
        opacity: 0,
        duration: 1.4,
        delay: 0.2,
      })
        .from(
          subtitleRef.current,
          {
            y: 60,
            opacity: 0,
            duration: 1,
          },
          "-=0.8"
        )
        .from(
          lineRef.current,
          {
            scaleX: 0,
            duration: 1.2,
            ease: "power3.inOut",
          },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      {/* Accent circle */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#ff3d00] opacity-5 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00ff88] opacity-5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto w-full">
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="font-display text-[clamp(3rem,15vw,14rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase"
          >
            Fashion
            <br />
            <span className="text-[#ff3d00]">360</span>
          </h1>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <p
            ref={subtitleRef}
            className="max-w-md text-lg md:text-xl text-[#a3a3a3] font-light leading-relaxed"
          >
            The new home of Israeli fashion.
            <br />
            Where culture meets commerce.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#a3a3a3] uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="w-12 h-[1px] bg-[#a3a3a3]" />
          </div>
        </div>

        <div
          ref={lineRef}
          className="mt-12 h-[1px] bg-gradient-to-r from-[#ff3d00] via-[#a3a3a3] to-transparent origin-left"
        />
      </div>
    </section>
  );
}
