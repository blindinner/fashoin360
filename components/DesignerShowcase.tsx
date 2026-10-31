"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Color schemes for each designer
const colorSchemes = [
  { bg: "#faf8f5", text: "#c9a227", accent: "#1a1a1a" }, // Gold
  { bg: "#f5f0eb", text: "#8b4513", accent: "#2d1810" }, // Brown
  { bg: "#f8f5f5", text: "#c41e3a", accent: "#1a1a1a" }, // Red
  { bg: "#f5f8f5", text: "#228b22", accent: "#0a1a0a" }, // Green
  { bg: "#f5f5f8", text: "#4169e1", accent: "#0a0a1a" }, // Blue
  { bg: "#faf5f8", text: "#db7093", accent: "#1a0a10" }, // Pink
  { bg: "#f8f8f5", text: "#b8860b", accent: "#1a1a0a" }, // Dark Gold
  { bg: "#f5f8f8", text: "#20b2aa", accent: "#0a1a1a" }, // Teal
  { bg: "#f8f5f0", text: "#cd853f", accent: "#1a150a" }, // Peru
  { bg: "#f0f5f8", text: "#4682b4", accent: "#0a101a" }, // Steel Blue
  { bg: "#f8f0f5", text: "#9932cc", accent: "#100a1a" }, // Purple
  { bg: "#fff8f0", text: "#ff6347", accent: "#1a0a05" }, // Tomato
  { bg: "#f0fff0", text: "#3cb371", accent: "#051a0a" }, // Sea Green
  { bg: "#f8f5fa", text: "#6a5acd", accent: "#0a0a1a" }, // Slate Blue
  { bg: "#faf0f5", text: "#c71585", accent: "#1a0510" }, // Medium Violet
  { bg: "#f5faf8", text: "#2e8b57", accent: "#0a1a10" }, // Sea Green
];

// Placeholder designers - will be dynamic later
const designers = [
  {
    id: 1,
    name: "Alon Livné",
    category: "Haute Couture",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: 2,
    name: "Maskit",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  },
  {
    id: 3,
    name: "Shahar Avnet",
    category: "Avant-Garde",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  },
  {
    id: 4,
    name: "Dorin Frankfurt",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  },
  {
    id: 5,
    name: "Yvel",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
  },
  {
    id: 6,
    name: "Razili",
    category: "Ready-to-Wear",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
  },
  {
    id: 7,
    name: "Sasson Kedem",
    category: "Bridal",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  },
  {
    id: 8,
    name: "Comme Il Faut",
    category: "Dance",
    image: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&q=80",
  },
  {
    id: 9,
    name: "Ronen Chen",
    category: "Womenswear",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
  },
  {
    id: 10,
    name: "Gideon Oberson",
    category: "Swimwear",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
  },
  {
    id: 11,
    name: "Hed Mayner",
    category: "Menswear",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  },
  {
    id: 12,
    name: "Inbal Dror",
    category: "Bridal Couture",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  },
  {
    id: 13,
    name: "Maya Negri",
    category: "Sustainable",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
  },
  {
    id: 14,
    name: "Liat Brandel",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
  },
  {
    id: 15,
    name: "Nili Lotan",
    category: "Luxury Basics",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    id: 16,
    name: "Dodo Bar Or",
    category: "Resort",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  },
];

export default function DesignerShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const expandedImageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentColors, setCurrentColors] = useState(colorSchemes[0]);

  // Get color scheme for designer
  const getColors = (index: number) => colorSchemes[index % colorSchemes.length];

  // Handle strip click - expand to full view
  const handleStripClick = useCallback((index: number) => {
    if (isAnimating) return;

    if (expandedIndex === index) {
      closeExpandedView();
    } else if (expandedIndex !== null) {
      switchDesigner(index);
    } else {
      openExpandedView(index);
    }
  }, [expandedIndex, isAnimating]);

  const openExpandedView = (index: number) => {
    setIsAnimating(true);
    setExpandedIndex(index);
    setCurrentColors(getColors(index));

    // Lock body scroll
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.fromTo(
      expandedViewRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    )
      .fromTo(
        expandedImageRef.current,
        { scale: 1.3, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".expanded-letter",
        { y: 200, opacity: 0, rotateX: 45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power4.out"
        },
        "-=0.6"
      )
      .fromTo(
        ".expanded-ui",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
        "-=0.3"
      );
  };

  const closeExpandedView = () => {
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setExpandedIndex(null);
        setIsAnimating(false);
        document.body.style.overflow = "";
      },
    });

    tl.to(".expanded-letter", {
      y: -100,
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.in",
    })
      .to(
        expandedImageRef.current,
        { scale: 0.9, opacity: 0, y: -30, duration: 0.5, ease: "power2.in" },
        "-=0.3"
      )
      .to(
        expandedViewRef.current,
        { opacity: 0, scale: 0.98, duration: 0.4, ease: "power2.in" },
        "-=0.3"
      );
  };

  const switchDesigner = (newIndex: number) => {
    if (isAnimating || newIndex === expandedIndex) return;

    setIsAnimating(true);
    const direction = newIndex > (expandedIndex ?? 0) ? 1 : -1;
    const newColors = getColors(newIndex);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Animate out current content
    tl.to(".expanded-letter", {
      x: -150 * direction,
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power3.in",
    })
      .to(
        expandedImageRef.current,
        {
          x: -100 * direction,
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power3.in"
        },
        "-=0.3"
      )
      // Change colors smoothly
      .to(
        expandedViewRef.current,
        {
          backgroundColor: newColors.bg,
          duration: 0.5,
          ease: "power2.inOut",
          onStart: () => {
            setExpandedIndex(newIndex);
            setCurrentColors(newColors);
          }
        },
        "-=0.2"
      )
      // Animate in new content
      .fromTo(
        expandedImageRef.current,
        { x: 100 * direction, opacity: 0, scale: 1.1 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".expanded-letter",
        { x: 150 * direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.02,
          ease: "power3.out"
        },
        "-=0.4"
      );
  };

  // Navigate to prev/next designer
  const navigateDesigner = (direction: "prev" | "next") => {
    if (expandedIndex === null || isAnimating) return;

    const newIndex =
      direction === "next"
        ? (expandedIndex + 1) % designers.length
        : (expandedIndex - 1 + designers.length) % designers.length;

    switchDesigner(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;

      if (e.key === "Escape") {
        closeExpandedView();
      } else if (e.key === "ArrowLeft") {
        navigateDesigner("prev");
      } else if (e.key === "ArrowRight") {
        navigateDesigner("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedIndex, isAnimating]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".designer-strip", {
        scaleY: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".strips-container",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentDesigner = expandedIndex !== null ? designers[expandedIndex] : null;
  const prevDesigner = expandedIndex !== null ? designers[(expandedIndex - 1 + designers.length) % designers.length] : null;
  const nextDesigner = expandedIndex !== null ? designers[(expandedIndex + 1) % designers.length] : null;

  // Split name into individual letters for animation
  const getLetters = (name: string) => {
    return name.toUpperCase().split("").map((char, i) => ({
      char,
      isSpace: char === " ",
      key: i,
    }));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a]"
    >
      {/* Normal view - strips */}
      <div className={`transition-opacity duration-500 ${expandedIndex !== null ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        {/* Section header */}
        <div className="pt-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1800px] mx-auto mb-16">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[#ff3d00] text-sm uppercase tracking-widest mb-4 block">
                  Featured
                </span>
                <h2
                  ref={titleRef}
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em]"
                >
                  Designers
                </h2>
              </div>

              <a
                href="/designers"
                className="hidden md:flex items-center gap-3 text-sm uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors group"
              >
                View All
                <span className="w-8 h-[1px] bg-current transform group-hover:w-12 transition-all" />
              </a>
            </div>
          </div>
        </div>

        {/* Strips container with lens effect */}
        <div className="strips-container relative h-[60vh] md:h-[70vh] mx-6 md:mx-12 lg:mx-24">
          {/* Lens mask container */}
          <div
            className="relative h-full overflow-hidden"
            style={{
              borderRadius: "50% / 10%",
            }}
          >
            {/* Scrollable inner */}
            <div className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide">
              <div className="flex h-full gap-[3px] min-w-max px-4">
                {designers.map((designer, index) => (
                  <div
                    key={designer.id}
                    className="designer-strip relative h-full w-20 md:w-28 lg:w-32 flex-shrink-0 overflow-hidden cursor-pointer group"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => handleStripClick(index)}
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                        activeIndex === index ? "scale-110 grayscale-0" : "scale-100 grayscale"
                      }`}
                      style={{ backgroundImage: `url(${designer.image})` }}
                    />
                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                      activeIndex === index ? "bg-black/20" : "bg-black/50"
                    }`} />

                {/* Strip content */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
                  activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  <span className="text-[#ff3d00] text-[10px] uppercase tracking-widest block mb-1">
                    {designer.category}
                  </span>
                  <h3 className="font-display text-sm font-semibold whitespace-nowrap">
                    {designer.name}
                  </h3>
                </div>

                {/* Index */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 font-display text-2xl font-bold text-white/10">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-center mt-8">
          <span className="text-white/40 text-sm tracking-widest">
            {activeIndex !== null
              ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(designers.length).padStart(2, "0")}`
              : `${String(designers.length).padStart(2, "0")} Designers`}
          </span>
        </div>
      </div>

      {/* Expanded view - Aristide Benoist style */}
      {expandedIndex !== null && (
        <div
          ref={expandedViewRef}
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ backgroundColor: currentColors.bg }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
            {/* Back to home button */}
            <button
              onClick={closeExpandedView}
              className="expanded-ui flex items-center gap-3 group"
              style={{ color: currentColors.accent }}
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm uppercase tracking-widest font-medium">Back</span>
            </button>

            {/* Counter with progress */}
            <div className="expanded-ui flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: currentColors.accent }}>
                {String(expandedIndex + 1).padStart(2, "0")}
              </span>
              <div className="w-16 h-[2px] relative overflow-hidden" style={{ backgroundColor: `${currentColors.accent}20` }}>
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                  style={{
                    width: `${((expandedIndex + 1) / designers.length) * 100}%`,
                    backgroundColor: currentColors.accent
                  }}
                />
              </div>
              <span className="text-sm" style={{ color: `${currentColors.accent}60` }}>
                {String(designers.length).padStart(2, "0")}
              </span>

              {/* Tick marks */}
              <div className="hidden md:flex gap-[2px] ml-4">
                {designers.map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] h-4 transition-all duration-300"
                    style={{
                      backgroundColor: i <= expandedIndex ? currentColors.text : `${currentColors.accent}20`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* About button */}
            <a
              href="/about"
              className="expanded-ui text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
              style={{ color: currentColors.accent }}
            >
              About
            </a>
          </div>

          {/* Main content */}
          <div className="relative h-full flex items-center justify-center">
            {/* Large typography - THE BIG NAME */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden px-4">
              <div className="flex flex-wrap justify-center items-center max-w-[95vw]">
                {currentDesigner && getLetters(currentDesigner.name).map(({ char, isSpace, key }) => (
                  <span
                    key={key}
                    className={`expanded-letter font-display font-black leading-none tracking-[-0.02em] ${
                      isSpace ? "w-[0.3em]" : ""
                    }`}
                    style={{
                      color: currentColors.text,
                      fontSize: "clamp(4rem, 15vw, 12rem)",
                    }}
                  >
                    {isSpace ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            </div>

            {/* Left side strip - previous designer */}
            <div
              className="absolute left-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-30 cursor-pointer group"
              onClick={() => navigateDesigner("prev")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${prevDesigner?.image})` }}
              />
              <div
                className="absolute inset-0 transition-all duration-500 group-hover:opacity-40"
                style={{ backgroundColor: currentColors.bg, opacity: 0.85 }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke={currentColors.accent}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              {/* Prev designer name hint */}
              <div
                className="absolute bottom-8 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: currentColors.accent }}
              >
                <span className="text-[10px] uppercase tracking-widest block">Prev</span>
                <span className="text-xs font-medium truncate block">{prevDesigner?.name}</span>
              </div>
            </div>

            {/* Right side strip - next designer */}
            <div
              className="absolute right-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-30 cursor-pointer group"
              onClick={() => navigateDesigner("next")}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${nextDesigner?.image})` }}
              />
              <div
                className="absolute inset-0 transition-all duration-500 group-hover:opacity-40"
                style={{ backgroundColor: currentColors.bg, opacity: 0.85 }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-8 h-8 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke={currentColors.accent}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {/* Next designer name hint */}
              <div
                className="absolute bottom-8 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-right"
                style={{ color: currentColors.accent }}
              >
                <span className="text-[10px] uppercase tracking-widest block">Next</span>
                <span className="text-xs font-medium truncate block">{nextDesigner?.name}</span>
              </div>
            </div>

            {/* Center image */}
            <div
              ref={expandedImageRef}
              className="relative w-[55vw] md:w-[45vw] lg:w-[38vw] aspect-[3/4] z-20 shadow-2xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${currentDesigner?.image})` }}
              />
            </div>
          </div>

          {/* Bottom UI */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 py-8">
            <div className="flex items-end justify-between">
              {/* Left info */}
              <div className="expanded-ui">
                <span
                  className="text-xs uppercase tracking-widest block mb-1"
                  style={{ color: `${currentColors.accent}80` }}
                >
                  {currentDesigner?.category}
                </span>
                <span
                  className="text-xs"
                  style={{ color: `${currentColors.accent}50` }}
                >
                  Israeli Fashion · Est. 2024
                </span>
              </div>

              {/* Center - Explore button */}
              <div className="expanded-ui flex flex-col items-center">
                <button
                  className="text-sm uppercase tracking-widest pb-1 hover:opacity-60 transition-opacity"
                  style={{
                    color: currentColors.accent,
                    borderBottom: `1px solid ${currentColors.accent}`
                  }}
                >
                  Explore
                </button>
                <div
                  className="w-[1px] h-10 mt-4"
                  style={{ backgroundColor: `${currentColors.accent}30` }}
                />
                <span
                  className="text-lg mt-2"
                  style={{ color: `${currentColors.accent}50` }}
                >
                  +
                </span>
              </div>

              {/* Right - Social links */}
              <div className="expanded-ui text-right">
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest block hover:opacity-100 transition-opacity"
                  style={{ color: `${currentColors.accent}70` }}
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest block mt-1 hover:opacity-100 transition-opacity"
                  style={{ color: `${currentColors.accent}70` }}
                >
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
