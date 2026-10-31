"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { getAllProducts, formatPrice, type ProductWithDesigner } from "@/lib/utils";

function ProductCard({ data, index }: { data: ProductWithDesigner; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <Link
      ref={cardRef}
      href={`/product/${data.product.id}`}
      className={`group block flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-3 lg:mb-4">
        <img
          src={data.product.image}
          alt={data.product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${data.accentColor}30, transparent)`,
          }}
        />
      </div>
      <div className="space-y-1">
        <p
          className="text-[10px] lg:text-xs uppercase tracking-wider transition-colors"
          style={{ color: data.accentColor }}
        >
          {data.designer.name}
        </p>
        <h3 className="text-xs lg:text-sm font-medium text-white group-hover:text-opacity-80 transition-colors line-clamp-1">
          {data.product.name}
        </h3>
        <p className="text-xs lg:text-sm text-neutral-400">{formatPrice(data.product.price)}</p>
      </div>
    </Link>
  );
}

export default function ShopTeaser() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const featuredProducts = useMemo(() => {
    const allProducts = getAllProducts();
    const featured: ProductWithDesigner[] = [];
    const seenDesigners = new Set<number>();

    for (const product of allProducts) {
      if (!seenDesigners.has(product.designer.id) && featured.length < 12) {
        seenDesigners.add(product.designer.id);
        featured.push(product);
      }
    }

    return featured;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
    }
    return () => scrollEl?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 220 : 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-32 bg-[#0a0a0a] border-t border-white/5"
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div
          className={`px-4 lg:px-12 mb-6 lg:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 lg:gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p className="text-[10px] lg:text-xs uppercase tracking-[0.3em] text-[#ff3d00] mb-2 lg:mb-4">
              Curated Selection
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
              Shop the Collection
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Navigation Arrows - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                  canScrollLeft
                    ? "border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                    : "border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                  canScrollRight
                    ? "border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                    : "border-white/10 text-white/20 cursor-not-allowed"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* View All Link */}
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-xs lg:text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors"
            >
              View All
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className={`flex gap-3 lg:gap-6 overflow-x-auto scrollbar-hide px-4 lg:px-12 pb-4 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {featuredProducts.map((product, idx) => (
            <div
              key={product.product.id}
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard data={product} index={idx} />
            </div>
          ))}

          {/* View All Card */}
          <Link
            href="/shop"
            className={`flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] aspect-[3/4] flex flex-col items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-500 group ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              scrollSnapAlign: "start",
              transitionDelay: `${featuredProducts.length * 80}ms`,
            }}
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 group-hover:border-white/40 transition-all duration-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-xs lg:text-sm uppercase tracking-widest text-white mb-1 lg:mb-2">
              View All
            </p>
            <p className="text-[10px] lg:text-xs text-neutral-500">
              {getAllProducts().length} pieces
            </p>
          </Link>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="lg:hidden flex justify-center gap-3 mt-4 px-4">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 flex items-center justify-center border transition-all ${
              canScrollLeft
                ? "border-white/20 text-white"
                : "border-white/10 text-white/20"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 flex items-center justify-center border transition-all ${
              canScrollRight
                ? "border-white/20 text-white"
                : "border-white/10 text-white/20"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
