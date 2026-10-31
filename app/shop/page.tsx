"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  getAllProducts,
  getAllCategories,
  getAllDesignerNames,
  formatPrice,
  type ProductWithDesigner,
} from "@/lib/utils";

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const PRICE_RANGES = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $2,500", min: 1000, max: 2500 },
  { label: "$2,500 - $5,000", min: 2500, max: 5000 },
  { label: "$5,000+", min: 5000, max: Infinity },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 py-4 lg:py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left min-h-[44px]"
      >
        <span className="text-sm uppercase tracking-wider text-white font-medium">
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-neutral-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[400px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-3 py-2 lg:py-1.5 cursor-pointer group w-full text-left min-h-[44px] lg:min-h-0"
    >
      <div
        className={`w-5 h-5 lg:w-4 lg:h-4 border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
          checked
            ? "bg-white border-white"
            : "border-white/30 group-hover:border-white/50"
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <span
        className={`text-sm transition-colors flex-1 ${
          checked ? "text-white" : "text-neutral-400 group-hover:text-neutral-300"
        }`}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-neutral-600">{count}</span>
      )}
    </button>
  );
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function ProductCard({ data }: { data: ProductWithDesigner }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Link
      href={`/product/${data.product.id}`}
      className={`group block transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
            background: `linear-gradient(to top, ${data.accentColor}25, transparent)`,
          }}
        />
        {/* Quick view - hidden on mobile for cleaner look */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-5 py-2.5 bg-black/80 text-white text-xs uppercase tracking-widest">
            View Product
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <p
          className="text-[10px] lg:text-xs uppercase tracking-wider transition-colors"
          style={{ color: data.accentColor }}
        >
          {data.designer.name}
        </p>
        <h3 className="text-xs lg:text-sm font-medium text-white group-hover:text-opacity-80 transition-colors line-clamp-2 lg:line-clamp-1">
          {data.product.name}
        </h3>
        <p className="text-xs lg:text-sm text-neutral-400">{formatPrice(data.product.price)}</p>
      </div>
    </Link>
  );
}

function MobileSortSheet({
  isOpen,
  onClose,
  sortBy,
  onSort,
}: {
  isOpen: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSort: (sort: SortOption) => void;
}) {
  const options: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name", label: "Name" },
  ];

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 transition-transform duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Sort By</h3>
            <button onClick={onClose} className="p-2 -mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSort(option.value);
                  onClose();
                }}
                className={`w-full text-left py-4 px-4 text-sm transition-colors ${
                  sortBy === option.value
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {/* Safe area padding for notch devices */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const allProducts = useMemo(() => getAllProducts(), []);
  const allCategories = useMemo(() => getAllCategories(), []);
  const allDesigners = useMemo(() => getAllDesignerNames(), []);

  const [selectedDesigners, setSelectedDesigners] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Lock body scroll when filter is open
  useEffect(() => {
    if (isFilterOpen || isSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, isSortOpen]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleDesigner = (designer: string) => {
    const newSet = new Set(selectedDesigners);
    if (newSet.has(designer)) {
      newSet.delete(designer);
    } else {
      newSet.add(designer);
    }
    setSelectedDesigners(newSet);
  };

  const toggleCategory = (category: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setSelectedCategories(newSet);
  };

  const togglePriceRange = (index: number) => {
    const newSet = new Set(selectedPriceRanges);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedPriceRanges(newSet);
  };

  const clearAllFilters = () => {
    setSelectedDesigners(new Set());
    setSelectedCategories(new Set());
    setSelectedPriceRanges(new Set());
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (selectedDesigners.size > 0) {
      filtered = filtered.filter((p) => selectedDesigners.has(p.designer.name));
    }

    if (selectedCategories.size > 0) {
      filtered = filtered.filter((p) => selectedCategories.has(p.product.category));
    }

    if (selectedPriceRanges.size > 0) {
      filtered = filtered.filter((p) => {
        return Array.from(selectedPriceRanges).some((idx) => {
          const range = PRICE_RANGES[idx];
          return p.product.price >= range.min && p.product.price < range.max;
        });
      });
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.product.price - b.product.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.product.price - a.product.price);
        break;
      case "name":
        filtered.sort((a, b) => a.product.name.localeCompare(b.product.name));
        break;
      case "newest":
      default:
        break;
    }

    return filtered;
  }, [allProducts, selectedDesigners, selectedCategories, selectedPriceRanges, sortBy]);

  const activeFilterCount =
    selectedDesigners.size + selectedCategories.size + selectedPriceRanges.size;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      counts[p.product.category] = (counts[p.product.category] || 0) + 1;
    }
    return counts;
  }, [allProducts]);

  const designerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      counts[p.designer.name] = (counts[p.designer.name] || 0) + 1;
    }
    return counts;
  }, [allProducts]);

  const FilterContent = () => (
    <>
      <FilterSection title="Designers" defaultOpen={false}>
        <div className="space-y-0 max-h-64 overflow-y-auto scrollbar-hide -mx-1 px-1">
          {allDesigners.map((designer) => (
            <Checkbox
              key={designer}
              checked={selectedDesigners.has(designer)}
              onChange={() => toggleDesigner(designer)}
              label={designer}
              count={designerCounts[designer]}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-0 max-h-64 overflow-y-auto scrollbar-hide -mx-1 px-1">
          {allCategories.map((category) => (
            <Checkbox
              key={category}
              checked={selectedCategories.has(category)}
              onChange={() => toggleCategory(category)}
              label={category}
              count={categoryCounts[category]}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-0 -mx-1 px-1">
          {PRICE_RANGES.map((range, idx) => (
            <Checkbox
              key={idx}
              checked={selectedPriceRanges.has(idx)}
              onChange={() => togglePriceRange(idx)}
              label={range.label}
            />
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-14 lg:h-20">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group p-2 -ml-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="transition-transform group-hover:-translate-x-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>

            <Link
              href="/"
              className="font-display text-base lg:text-lg font-bold tracking-tight text-white"
            >
              FASHION 360
            </Link>

            <button className="relative p-2 -mr-2 text-neutral-400 hover:text-white transition-colors">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a] border-t border-white/10 safe-area-pb">
        <div className="flex">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider text-white border-r border-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            Filter
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsSortOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M6 12h12M9 18h6" />
            </svg>
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-full max-w-[85vw] sm:max-w-sm bg-[#0a0a0a] transition-transform duration-500 flex flex-col ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <h2 className="text-lg font-medium text-white">Filters</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-10 h-10 flex items-center justify-center -mr-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4">
            <FilterContent />
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 space-y-3 safe-area-pb">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full py-3 border border-white/20 text-sm uppercase tracking-wider text-white hover:bg-white/5 transition-colors"
              >
                Clear All ({activeFilterCount})
              </button>
            )}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-3 bg-white text-black text-sm uppercase tracking-wider font-medium"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Sheet */}
      <MobileSortSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      {/* Main Content */}
      <main className="pt-16 lg:pt-28 pb-24 lg:pb-12">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
          {/* Header */}
          <div
            className={`mb-6 lg:mb-10 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="font-display text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 lg:mb-4">
              Shop All
            </h1>
            <p className="text-sm lg:text-base text-neutral-400">
              {filteredProducts.length} pieces from Israel's finest designers
            </p>
          </div>

          {/* Active Filters (Mobile) */}
          {activeFilterCount > 0 && (
            <div className="lg:hidden mb-4 flex flex-wrap gap-2">
              {Array.from(selectedDesigners).map((d) => (
                <ActiveFilterChip key={d} label={d} onRemove={() => toggleDesigner(d)} />
              ))}
              {Array.from(selectedCategories).map((c) => (
                <ActiveFilterChip key={c} label={c} onRemove={() => toggleCategory(c)} />
              ))}
              {Array.from(selectedPriceRanges).map((idx) => (
                <ActiveFilterChip
                  key={idx}
                  label={PRICE_RANGES[idx].label}
                  onRemove={() => togglePriceRange(idx)}
                />
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-500 underline underline-offset-4 py-1.5"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-12">
            {/* Desktop Sidebar */}
            <aside
              className={`hidden lg:block w-64 flex-shrink-0 transition-all duration-700 delay-100 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm uppercase tracking-wider text-neutral-500">
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Sort Bar - Desktop */}
              <div
                className={`hidden lg:flex items-center justify-between mb-8 pb-6 border-b border-white/10 transition-all duration-700 delay-200 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <p className="text-sm text-neutral-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                </p>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-neutral-500">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-white text-sm border border-white/20 px-3 py-2 focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    <option value="newest" className="bg-[#0a0a0a]">Newest</option>
                    <option value="price-asc" className="bg-[#0a0a0a]">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#0a0a0a]">Price: High to Low</option>
                    <option value="name" className="bg-[#0a0a0a]">Name</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
                  {filteredProducts.map((item, idx) => (
                    <div
                      key={item.product.id}
                      style={{ transitionDelay: `${Math.min(idx * 50, 500)}ms` }}
                    >
                      <ProductCard data={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-neutral-500 mb-4">No products match your filters</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-white underline underline-offset-4 hover:text-neutral-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Desktop Only */}
      <footer className="hidden lg:block border-t border-white/10 py-8">
        <div className="max-w-[1800px] mx-auto px-12">
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <p>Fashion 360. The New Home of Israeli Fashion.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
