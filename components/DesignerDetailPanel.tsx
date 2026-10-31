"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Designer, Product } from "@/lib/designers";
import { formatPrice } from "@/lib/utils";

interface DesignerDetailPanelProps {
  designer: Designer;
  accentColor: string;
  isOpen: boolean;
  onClose: () => void;
}

function ProductCard({ product, accentColor, delay }: { product: Product; accentColor: string; delay: number }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-2 lg:mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to top, ${accentColor}20, transparent)` }}
        />
        <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-2 bg-black/80 text-white text-xs uppercase tracking-widest">
            View
          </span>
        </div>
      </div>
      <div className="space-y-0.5 lg:space-y-1">
        <p className="text-[10px] lg:text-xs uppercase tracking-wider text-neutral-500">{product.category}</p>
        <h4 className="text-xs lg:text-sm font-medium text-white group-hover:text-opacity-80 transition-colors line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs lg:text-sm" style={{ color: accentColor }}>
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default function DesignerDetailPanel({
  designer,
  accentColor,
  isOpen,
  onClose,
}: DesignerDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);

  // Stagger content animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setContentVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Prevent wheel events from propagating
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    panel.addEventListener("wheel", handleWheel, { passive: false });
    return () => panel.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  // Touch drag to close (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only enable drag from the top area (header/handle)
    const touch = e.touches[0];
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Allow drag from top 80px of panel
    if (touch.clientY - rect.top < 80) {
      setIsDragging(true);
      setStartY(touch.clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = touch.clientY - startY;
    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff);
    }
  }, [isDragging, startY]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged more than 100px, close the panel
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  }, [isDragging, dragY, onClose]);

  const panelStyle = {
    transform: isDragging
      ? `translateY(${dragY}px)`
      : isOpen
        ? 'translateY(0)'
        : 'translateY(100%)',
    transition: isDragging ? 'none' : undefined,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${isOpen ? 0.6 - (dragY / 500) : 0})`,
          backdropFilter: isOpen ? `blur(${Math.max(0, 8 - dragY / 30)}px)` : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel - Mobile (bottom sheet style) */}
      <div
        ref={panelRef}
        className="md:hidden fixed inset-x-0 bottom-0 top-12 bg-[#0a0a0a] z-50 flex flex-col rounded-t-2xl overflow-hidden"
        style={panelStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 pt-3 pb-2 flex justify-center">
          <div
            className="w-10 h-1 rounded-full bg-white/30"
            style={{
              transform: isDragging ? 'scaleX(1.2)' : 'scaleX(1)',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pb-4 border-b border-white/10">
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {designer.category}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className={`p-5 transition-all duration-500 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Designer Info */}
            <div
              className="mb-6"
              style={{
                transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                transitionDelay: '100ms'
              }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {designer.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                {designer.established && <span>Est. {designer.established}</span>}
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
                <span>{designer.location}</span>
              </div>
            </div>

            {/* Bio */}
            <div
              className="mb-6"
              style={{
                transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: contentVisible ? 1 : 0,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                transitionDelay: '150ms'
              }}
            >
              <p className="text-sm text-neutral-300 leading-relaxed">{designer.bio}</p>
            </div>

            {/* Social Links */}
            <div
              className="flex flex-wrap gap-2 mb-6"
              style={{
                transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: contentVisible ? 1 : 0,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                transitionDelay: '200ms'
              }}
            >
              {designer.instagram && (
                <a
                  href={`https://instagram.com/${designer.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-sm text-neutral-300 active:bg-white/10 transition-colors rounded-full"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{designer.instagram}
                </a>
              )}
              {designer.website && (
                <a
                  href={designer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-sm text-neutral-300 active:bg-white/10 transition-colors rounded-full"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Website
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-6" />

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-white">Shop Collection</h3>
                <span className="text-xs text-neutral-500">{designer.products.length} items</span>
              </div>

              <div
                className="grid grid-cols-2 gap-3"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  transitionDelay: '300ms'
                }}
              >
                {designer.products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    accentColor={accentColor}
                    delay={350 + idx * 50}
                  />
                ))}
              </div>
            </div>

            {/* View All CTA */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/shop"
                className="block w-full py-4 text-center text-sm uppercase tracking-widest font-medium active:scale-[0.98] transition-transform"
                style={{ backgroundColor: accentColor, color: "#000" }}
              >
                View Full Collection
              </Link>
            </div>

            {/* Safe area padding */}
            <div className="h-8" />
          </div>
        </div>
      </div>

      {/* Panel - Desktop (slide from right) */}
      <div
        className={`hidden md:flex fixed inset-y-0 right-0 w-[600px] lg:w-[700px] bg-[#0a0a0a] z-50 flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {designer.category}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/40 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="p-8">
            {/* Designer Info */}
            <div className="mb-10">
              <h2 className="text-5xl font-display font-bold text-white mb-4">
                {designer.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-neutral-400">
                {designer.established && <span>Est. {designer.established}</span>}
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
                <span>{designer.location}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-10">
              <p className="text-neutral-300 leading-relaxed">{designer.bio}</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-10">
              {designer.instagram && (
                <a
                  href={`https://instagram.com/${designer.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{designer.instagram}
                </a>
              )}
              {designer.website && (
                <a
                  href={designer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Website
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-8" />

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Shop Collection</h3>
                <span className="text-sm text-neutral-500">{designer.products.length} items</span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {designer.products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    accentColor={accentColor}
                    delay={0}
                  />
                ))}
              </div>
            </div>

            {/* View All CTA */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <Link
                href="/shop"
                className="block w-full py-4 text-center text-sm uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accentColor, color: "#000" }}
              >
                View Full Collection
              </Link>
            </div>

            {/* Bottom padding */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </>
  );
}
