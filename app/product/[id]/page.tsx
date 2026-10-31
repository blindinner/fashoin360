"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { findProductById, getRelatedProducts, formatPrice, type ProductWithDesigner } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL"];

function ImageGallery({
  images,
  productName,
  accentColor
}: {
  images: string[];
  productName: string;
  accentColor: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < images.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 h-full">
      {/* Thumbnails - Desktop only */}
      <div className="hidden lg:flex lg:flex-col gap-3 overflow-y-auto scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative flex-shrink-0 w-20 h-24 overflow-hidden transition-all duration-300 ${
              activeIndex === idx ? "" : "opacity-50 hover:opacity-80"
            }`}
            style={{
              boxShadow: activeIndex === idx ? `0 0 0 1px ${accentColor}` : "none"
            }}
          >
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1">
        {/* Main Image */}
        <div
          ref={imageRef}
          className="relative aspect-[3/4] lg:aspect-auto lg:h-full overflow-hidden bg-neutral-900 lg:cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[activeIndex]}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              transform: isZoomed ? "scale(1.5)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `linear-gradient(to top, ${accentColor}10, transparent 50%)`,
            }}
          />
        </div>

        {/* Mobile Image Indicators */}
        <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        {images.length > 1 && (
          <div className="lg:hidden absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

function SizeSelector({
  sizes,
  selected,
  onSelect,
  accentColor
}: {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
  accentColor: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 lg:gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`w-14 h-14 lg:w-12 lg:h-12 flex items-center justify-center text-sm font-medium transition-all duration-300 border ${
            selected === size
              ? "border-transparent text-black"
              : "border-white/20 text-white active:scale-95"
          }`}
          style={{
            backgroundColor: selected === size ? accentColor : "transparent",
          }}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

function RelatedProductCard({
  data,
  onNavigate
}: {
  data: ProductWithDesigner;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/product/${data.product.id}`}
      onClick={onNavigate}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-2 lg:mb-3">
        <img
          src={data.product.image}
          alt={data.product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${data.accentColor}25, transparent)`
          }}
        />
      </div>
      <div className="space-y-0.5 lg:space-y-1">
        <p className="text-[10px] lg:text-xs uppercase tracking-wider text-neutral-500">
          {data.product.category}
        </p>
        <h4 className="text-xs lg:text-sm font-medium text-white line-clamp-1">
          {data.product.name}
        </h4>
        <p className="text-xs lg:text-sm" style={{ color: data.accentColor }}>
          {formatPrice(data.product.price)}
        </p>
      </div>
    </Link>
  );
}

function ProductPageContent() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ProductWithDesigner | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDesigner[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const productId = parseInt(params.id as string);
    const productData = findProductById(productId);

    if (productData) {
      setData(productData);
      setRelatedProducts(getRelatedProducts(productId, 4));
      setSelectedSize(null);
      setIsLoaded(false);
      requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    }
  }, [params.id]);

  // Show sticky bar when main CTA is out of view (mobile only)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }

    return () => observer.disconnect();
  }, [data]);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    setIsAddingToBag(true);
    setTimeout(() => {
      setIsAddingToBag(false);
    }, 1500);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full" />
      </div>
    );
  }

  const { product, designer, accentColor } = data;

  const productImages = [
    product.image,
    product.image.replace("w=400", "w=800"),
    product.image.replace("q=80", "q=90"),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-14 lg:h-20">
            <button
              onClick={() => router.back()}
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
            </button>

            <Link
              href="/"
              className="font-display text-base lg:text-lg font-bold tracking-tight text-white"
            >
              FASHION 360
            </Link>

            <button className="relative p-2 -mr-2 text-neutral-400 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sticky Add to Bag */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a] border-t border-white/10 transition-transform duration-300 safe-area-pb ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{product.name}</p>
            <p className="text-sm" style={{ color: accentColor }}>{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={handleAddToBag}
            disabled={!selectedSize || isAddingToBag}
            className={`px-6 py-3 text-sm uppercase tracking-wider font-medium transition-all ${
              !selectedSize
                ? "bg-neutral-800 text-neutral-500"
                : "text-black"
            }`}
            style={{
              backgroundColor: selectedSize ? accentColor : undefined,
            }}
          >
            {selectedSize ? "Add" : "Select Size"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-14 lg:pt-24 pb-32 lg:pb-24">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-12">
          {/* Breadcrumb - Desktop only */}
          <div
            className={`hidden lg:flex items-center gap-2 text-xs text-neutral-500 mb-8 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">{designer.name}</Link>
            <span>/</span>
            <span className="text-neutral-300">{product.name}</span>
          </div>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Left: Images */}
            <div
              className={`transition-all duration-1000 delay-100 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
                <ImageGallery
                  images={productImages}
                  productName={product.name}
                  accentColor={accentColor}
                />
              </div>
            </div>

            {/* Right: Details */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="lg:max-w-lg">
                {/* Designer Tag */}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 mb-4 lg:mb-6 group"
                >
                  <span
                    className="text-xs uppercase tracking-[0.3em] transition-colors"
                    style={{ color: accentColor }}
                  >
                    {designer.name}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    style={{ color: accentColor }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Category */}
                <p className="text-xs lg:text-sm uppercase tracking-wider text-neutral-500 mb-1 lg:mb-2">
                  {product.category}
                </p>

                {/* Product Name */}
                <h1 className="font-display text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <p
                  className="text-xl lg:text-2xl xl:text-3xl font-light mb-6 lg:mb-10"
                  style={{ color: accentColor }}
                >
                  {formatPrice(product.price)}
                </p>

                {/* Description */}
                <div className="mb-6 lg:mb-10">
                  <p className="text-sm lg:text-base text-neutral-400 leading-relaxed">
                    Crafted with meticulous attention to detail, this piece embodies the signature
                    aesthetic of {designer.name}. {designer.category === "Haute Couture" || designer.category === "Bridal Couture"
                      ? "Each garment is made-to-order, ensuring a perfect fit and unparalleled quality."
                      : "Designed for those who appreciate both form and function in their wardrobe."
                    }
                  </p>
                </div>

                {/* Size Selection */}
                <div className="mb-6 lg:mb-10">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <span className="text-sm uppercase tracking-wider text-white">Select Size</span>
                    <button className="text-xs text-neutral-500 hover:text-white underline underline-offset-4 transition-colors">
                      Size Guide
                    </button>
                  </div>
                  <SizeSelector
                    sizes={SIZES}
                    selected={selectedSize}
                    onSelect={setSelectedSize}
                    accentColor={accentColor}
                  />
                </div>

                {/* Add to Bag - This is observed for sticky bar */}
                <button
                  ref={addToCartRef}
                  onClick={handleAddToBag}
                  disabled={!selectedSize || isAddingToBag}
                  className={`w-full py-4 px-8 text-sm uppercase tracking-widest font-medium transition-all duration-500 relative overflow-hidden ${
                    !selectedSize
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "text-black active:scale-[0.98]"
                  }`}
                  style={{
                    backgroundColor: selectedSize ? accentColor : undefined,
                  }}
                >
                  <span className={`transition-opacity duration-300 ${isAddingToBag ? "opacity-0" : "opacity-100"}`}>
                    {selectedSize ? "Add to Bag" : "Select a Size"}
                  </span>
                  {isAddingToBag && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <button className="w-full mt-3 lg:mt-4 py-4 px-8 border border-white/20 text-sm uppercase tracking-widest font-medium text-white hover:border-white/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Add to Wishlist
                </button>

                {/* Details Accordion */}
                <div className="mt-8 lg:mt-12 border-t border-white/10">
                  {[
                    {
                      title: "Product Details",
                      content: `Premium ${product.category.toLowerCase()} piece from ${designer.name}'s latest collection. This design showcases the brand's commitment to exceptional craftsmanship and innovative silhouettes.`
                    },
                    {
                      title: "Materials & Care",
                      content: "Crafted from the finest materials. Dry clean only. Store in a cool, dry place away from direct sunlight."
                    },
                    {
                      title: "Shipping & Returns",
                      content: "Complimentary shipping on all orders. Returns accepted within 14 days of delivery. Items must be unworn with original tags attached."
                    },
                  ].map((section, idx) => (
                    <details key={idx} className="group border-b border-white/10">
                      <summary className="flex items-center justify-between py-4 lg:py-5 cursor-pointer list-none">
                        <span className="text-sm uppercase tracking-wider text-white">
                          {section.title}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-neutral-500 transition-transform group-open:rotate-180"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </summary>
                      <div className="pb-4 lg:pb-5 text-sm text-neutral-400 leading-relaxed">
                        {section.content}
                      </div>
                    </details>
                  ))}
                </div>

                {/* Designer Attribution */}
                <div className="mt-8 lg:mt-12 p-4 lg:p-6 bg-neutral-900/50 border border-white/5">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-base lg:text-lg font-display font-bold flex-shrink-0"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      {designer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-0.5 lg:mb-1">{designer.name}</h3>
                      <p className="text-[10px] lg:text-xs text-neutral-500 uppercase tracking-wider mb-1 lg:mb-2">
                        {designer.category} {designer.established && `· Est. ${designer.established}`}
                      </p>
                      <p className="text-xs lg:text-sm text-neutral-400 line-clamp-2">
                        {designer.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section
              className={`mt-16 lg:mt-32 transition-all duration-1000 delay-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="font-display text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                  More from {designer.name}
                </h2>
                <Link
                  href="/shop"
                  className="text-xs lg:text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  View All
                  <svg
                    width="16"
                    height="16"
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
                {relatedProducts.map((item) => (
                  <RelatedProductCard
                    key={item.product.id}
                    data={item}
                    onNavigate={() => {
                      setIsLoaded(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer - Desktop only */}
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/10 border-t-white/80 animate-spin rounded-full" />
        <p className="text-sm text-neutral-500 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductPageContent />
    </Suspense>
  );
}
