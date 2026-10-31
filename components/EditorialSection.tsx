"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    id: 1,
    title: "The New Wave of Israeli Designers",
    excerpt: "How a new generation is reshaping the local fashion scene",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
  },
  {
    id: 2,
    title: "Sustainability in Fashion",
    excerpt: "Local brands leading the eco-conscious movement",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
  },
  {
    id: 3,
    title: "Tel Aviv Street Style",
    excerpt: "Capturing the unique aesthetic of the city",
    category: "Street",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
];

export default function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only run animations on desktop
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".article-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".articles-grid",
          start: "top 80%",
        },
      });

      gsap.from(".editorial-title", {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".editorial-title",
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-32 px-4 md:px-8 lg:px-24 bg-[#0f0f0f]">
      {/* Big text background - hidden on mobile for performance */}
      <div className="hidden lg:block absolute top-1/2 left-0 -translate-y-1/2 font-display text-[20vw] font-bold text-white/[0.02] whitespace-nowrap pointer-events-none">
        STORIES
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-16 gap-4 lg:gap-0">
          <div>
            <span className="text-[10px] lg:text-sm text-[#00ff88] uppercase tracking-widest mb-2 lg:mb-4 block">
              Editorial
            </span>
            <h2 className="editorial-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-[-0.03em]">
              Stories &<br />
              <span className="text-[#a3a3a3]">Culture</span>
            </h2>
          </div>

          <p className="max-w-md text-sm lg:text-base text-[#a3a3a3]">
            Dive into the narratives behind the designs. Interviews, editorials,
            and cultural explorations.
          </p>
        </div>

        {/* Articles grid */}
        <div className="articles-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="article-card group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden mb-4 lg:mb-6">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

                {/* Category badge */}
                <span className="absolute top-3 left-3 lg:top-4 lg:left-4 px-2 lg:px-3 py-1 bg-white/10 backdrop-blur-sm text-[10px] lg:text-xs uppercase tracking-widest">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold mb-1 lg:mb-2 group-hover:text-[#00ff88] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-[#a3a3a3] line-clamp-2">{article.excerpt}</p>

              {/* Read more */}
              <div className="mt-3 lg:mt-4 flex items-center gap-2 text-xs lg:text-sm uppercase tracking-widest text-[#a3a3a3] group-hover:text-white transition-colors">
                Read More
                <span className="w-4 h-[1px] bg-current group-hover:w-8 transition-all" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
