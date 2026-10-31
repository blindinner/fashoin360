"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const liveEvents = [
  {
    id: 1,
    designer: "Alon Livné",
    title: "Behind the Atelier",
    description: "Join Alon for an exclusive look at his latest bridal collection",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    status: "live",
    viewers: 1247,
    startTime: "Now",
  },
  {
    id: 2,
    designer: "Maskit",
    title: "Heritage Reimagined",
    description: "Exploring traditional Israeli textiles with modern techniques",
    thumbnail: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    status: "upcoming",
    viewers: 0,
    startTime: "Today, 8:00 PM",
  },
  {
    id: 3,
    designer: "Dorin Frankfurt",
    title: "Minimalist Masterclass",
    description: "Learn the art of understated elegance with Dorin",
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    status: "upcoming",
    viewers: 0,
    startTime: "Tomorrow, 6:00 PM",
  },
];

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600 rounded-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live</span>
    </div>
  );
}

function ViewerCount({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-white/80">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
      <span className="text-xs">{count.toLocaleString()} watching</span>
    </div>
  );
}

export default function LiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".live-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".live-grid",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-24 px-4 md:px-8 lg:px-24 bg-[#0a0a0a]">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-[#ff3d00] to-transparent" />

      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 lg:mb-4">
              <LiveBadge />
              <span className="text-[10px] lg:text-sm text-white/60 uppercase tracking-widest">
                Fashion 360 Live
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em]">
              Live with
              <br />
              <span className="text-[#ff3d00]">Designers</span>
            </h2>
          </div>
          <p className="max-w-md text-sm lg:text-base text-[#a3a3a3]">
            Join exclusive live sessions with Israel&apos;s top designers.
            Watch behind-the-scenes content, Q&As, and shop in real-time.
          </p>
        </div>

        {/* Live Grid */}
        <div className="live-grid grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Featured Live Stream */}
          <div
            className="live-card lg:col-span-2 lg:row-span-2 relative group cursor-pointer overflow-hidden bg-neutral-900 rounded-sm"
            onMouseEnter={() => setHoveredId(1)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full">
              {/* Video placeholder with animation */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${liveEvents[0].thumbnail})` }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${hoveredId === 1 ? 'scale-110' : ''}`}>
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-red-600 flex items-center justify-center">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <LiveBadge />
                  <ViewerCount count={liveEvents[0].viewers} />
                </div>
                <p className="text-xs lg:text-sm text-[#ff3d00] uppercase tracking-widest mb-1 lg:mb-2">
                  {liveEvents[0].designer}
                </p>
                <h3 className="font-display text-xl lg:text-3xl font-bold text-white mb-2">
                  {liveEvents[0].title}
                </h3>
                <p className="text-sm text-white/70 max-w-lg hidden lg:block">
                  {liveEvents[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming streams */}
          {liveEvents.slice(1).map((event) => (
            <div
              key={event.id}
              className="live-card relative group cursor-pointer overflow-hidden bg-neutral-900 rounded-sm"
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative aspect-[16/9]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${event.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Notify button */}
                <div className="absolute top-3 right-3">
                  <button className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors rounded-sm">
                    Notify Me
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span className="text-[10px] text-white/60 uppercase tracking-wider">
                      {event.startTime}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#00ff88] uppercase tracking-widest mb-1">
                    {event.designer}
                  </p>
                  <h3 className="font-display text-base lg:text-lg font-semibold text-white">
                    {event.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-[#ff3d00] text-black text-sm uppercase tracking-widest font-medium hover:bg-[#ff5722] transition-colors">
            View All Live Events
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white text-sm uppercase tracking-widest hover:border-white/40 transition-colors">
            Become a Host
          </button>
        </div>
      </div>
    </section>
  );
}
