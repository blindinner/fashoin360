"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Color tokens from existing Fashion 360 CSS
const TOKENS = {
  ink: "#fafafa",      // --foreground
  accent: "#ff3d00",   // --accent-primary
  page: "#0a0a0a",     // --background
};

// Configuration
const CONFIG = {
  // Repeat phrase twice per coil for tighter packing
  text: "FASHION 360 • FASHION 360 • ",
  coils: 3,
  turns: 1.5,        // Total rotation across runway
  offset: -30,       // Starting offset so "FASHION" faces front
  spring: 1,
  runway: 1.7,       // Extra scroll distance (1.7 = 170vh total section height)
};

// Floating images for desktop hero
const FLOATING_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    position: { top: "8%", left: "5%" },
    size: { width: 180, height: 240 },
    delay: 0,
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    position: { top: "12%", right: "8%" },
    size: { width: 160, height: 200 },
    delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    position: { top: "5%", right: "25%" },
    size: { width: 140, height: 180 },
    delay: 1,
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
    position: { bottom: "35%", left: "3%" },
    size: { width: 120, height: 160 },
    delay: 1.5,
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
    position: { top: "25%", left: "12%" },
    size: { width: 100, height: 130 },
    delay: 2,
  },
  {
    src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80",
    position: { bottom: "30%", right: "5%" },
    size: { width: 150, height: 200 },
    delay: 0.8,
  },
];

interface GlyphData {
  char: string;
  s: number;         // Cumulative distance along ENTIRE string
  angle: number;     // θ = (s / W) * 360
  y: number;         // Rises continuously with s
  coilIndex: number;
  width: number;
}

export default function TypeHelix() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [glyphs, setGlyphs] = useState<GlyphData[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Layout values stored in refs to avoid stale closures
  const layoutRef = useRef({
    radius: 300,
    fontSize: 100,
    pitch: 120,
    totalHeight: 360,
    singleRepeatWidth: 1000,
  });

  // Animation state
  const stateRef = useRef({
    rotation: 0,
    compress: 0,
    spread: 0,
    twist: 0,
  });

  const springTweenRef = useRef<gsap.core.Tween | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  // Calculate glyph positions - TRUE HELIX
  const calculateGlyphs = useCallback(() => {
    const singleRepeat = CONFIG.text;
    const fullText = singleRepeat.repeat(CONFIG.coils);
    const charsPerRepeat = singleRepeat.length;

    // Font size - sized so helix fits in ~60% of viewport height
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Scale based on viewport, but keep it contained
    const fontSize = Math.min(vw * 0.07, vh * 0.12, 100);

    // Measure character widths
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a wide, heavy font
    ctx.font = `900 ${fontSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;

    // Measure each character in single repeat
    const charWidths: number[] = [];
    let singleRepeatWidth = 0;
    for (const char of singleRepeat) {
      const width = ctx.measureText(char).width;
      charWidths.push(width);
      singleRepeatWidth += width;
    }

    // W = width of one repeat (this equals one full revolution)
    const W = singleRepeatWidth;

    // Radius: circumference = W, so R = W / 2π
    const R = W / (2 * Math.PI);

    // Pitch: vertical rise per coil (1.15 × line height)
    // Ensures rows fit within viewport with margin
    const lineHeight = fontSize * 0.95;
    const pitch = lineHeight * 1.15;

    // Total height of helix
    const totalHeight = pitch * CONFIG.coils;

    // Store layout values
    layoutRef.current = {
      radius: R,
      fontSize,
      pitch,
      totalHeight,
      singleRepeatWidth: W,
    };

    // Generate glyphs - TRUE HELIX with continuous rise
    const allGlyphs: GlyphData[] = [];
    let cumulativeS = 0; // Cumulative distance along ENTIRE string

    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i];
      const charIndexInRepeat = i % charsPerRepeat;
      const coilIndex = Math.floor(i / charsPerRepeat);
      const charWidth = charWidths[charIndexInRepeat];

      // s = cumulative distance to CENTER of this glyph (continuous across all coils)
      const s = cumulativeS + charWidth / 2;

      // θ = angle around cylinder (s / W * 360, continues past 360° for each coil)
      const angle = (s / W) * 360;

      // y = rises continuously with s (this creates the helix slope)
      const y = (s / W) * pitch - totalHeight / 2;

      allGlyphs.push({
        char,
        s,
        angle,
        y,
        coilIndex,
        width: charWidth,
      });

      cumulativeS += charWidth;
    }

    setGlyphs(allGlyphs);
    setIsReady(true);
  }, []);

  // Initialize after fonts load
  useEffect(() => {
    document.fonts.ready.then(() => {
      calculateGlyphs();
    });

    window.addEventListener("resize", calculateGlyphs);
    return () => window.removeEventListener("resize", calculateGlyphs);
  }, [calculateGlyphs]);

  // Continuous rotation animation
  useEffect(() => {
    if (!isReady || !sectionRef.current || !objectRef.current) return;

    const state = stateRef.current;
    const layout = layoutRef.current;
    const object = objectRef.current;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Continuous rotation - smooth, infinite, opposite direction
    const rotationTween = gsap.to(state, {
      rotation: -360,
      duration: 18, // 18 seconds per full rotation
      repeat: -1,
      ease: "none",
    });

    // Per-frame update
    const updateGlyphs = () => {
      const elements = glyphRefs.current;
      if (!elements.length || !glyphs.length) return;

      const { radius, pitch, totalHeight, singleRepeatWidth } = layout;

      // Apply spring deformation to radius
      const R = radius * (1 + 0.15 * state.spread);

      // Object rotation (scroll + offset)
      const objectRotation = state.rotation + CONFIG.offset;

      elements.forEach((el, i) => {
        if (!el || !glyphs[i]) return;

        const glyph = glyphs[i];

        // Apply compression to Y
        const yCompressed = glyph.y * (1 - 0.35 * state.compress);

        // Apply twist (top coils rotate more than bottom)
        const heightNorm = (glyph.y + totalHeight / 2) / totalHeight; // 0 at bottom, 1 at top
        const twistOffset = state.twist * 40 * heightNorm;

        // Final local angle
        const localAngle = glyph.angle + twistOffset;

        // World angle for shading
        let worldAngle = (localAngle + objectRotation) % 360;
        if (worldAngle < 0) worldAngle += 360;
        if (worldAngle > 180) worldAngle = 360 - worldAngle; // Normalize to 0-180
        const worldAngleRad = (worldAngle * Math.PI) / 180;
        const facing = Math.cos(worldAngleRad); // 1 = front, 0 = side, -1 = back

        // Transform: position on cylinder surface
        el.style.transform = `
          rotateY(${localAngle}deg)
          translateZ(${R}px)
          translateY(${yCompressed}px)
        `;

        // Shading based on facing direction
        const isAccent = glyph.coilIndex === 1; // Middle coil
        const inkColor = isAccent ? TOKENS.accent : TOKENS.ink;

        if (facing > 0.1) {
          // FRONT-FACING: solid fill
          // Brightness and opacity based on facing (sides are dimmer)
          const opacity = 0.3 + 0.7 * facing;
          const brightness = 0.5 + 0.5 * facing;

          el.style.color = inkColor;
          el.style.opacity = String(opacity);
          el.style.webkitTextStroke = "0px transparent";
          el.style.filter = `brightness(${brightness})`;
        } else {
          // BACK-FACING: hollow outline (visible through cylinder)
          // Crisp strokes, 40-60% opacity
          const strokeOpacity = 0.4 + 0.2 * (1 + facing);

          el.style.color = "transparent";
          el.style.opacity = String(Math.max(0.25, strokeOpacity));
          el.style.webkitTextStroke = `1.5px ${inkColor}`;
          el.style.filter = "none";
        }
      });

      // Rotate entire helix object
      object.style.transform = `rotateY(${objectRotation}deg)`;
    };

    gsap.ticker.add(updateGlyphs);

    return () => {
      rotationTween.kill();
      gsap.ticker.remove(updateGlyphs);
    };
  }, [isReady, glyphs]);

  // Floating images animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const elements = floatingRefs.current.filter(Boolean);
    if (!elements.length) return;

    // Animate each floating image with a gentle drift
    const animations = elements.map((el, i) => {
      const img = FLOATING_IMAGES[i];
      if (!el || !img) return null;

      // Random drift parameters for each image
      const xDrift = 15 + Math.random() * 20;
      const yDrift = 10 + Math.random() * 15;
      const duration = 6 + Math.random() * 4;

      // Initial fade in
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: img.delay,
          ease: "power2.out",
        }
      );

      // Continuous floating animation
      return gsap.to(el, {
        x: `random(-${xDrift}, ${xDrift})`,
        y: `random(-${yDrift}, ${yDrift})`,
        rotation: `random(-3, 3)`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: img.delay,
      });
    });

    return () => {
      animations.forEach((anim) => anim?.kill());
    };
  }, []);

  const { fontSize } = layoutRef.current;

  return (
    <section
      ref={sectionRef}
      data-type-helix
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: TOKENS.page,
      }}
    >
      {/* Stage */}
      <div
        ref={stageRef}
        data-helix-stage
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Floating product images */}
        {FLOATING_IMAGES.map((img, i) => (
          <div
            key={i}
            ref={(el) => {
              floatingRefs.current[i] = el;
            }}
            className="absolute opacity-0"
            style={{
              ...img.position,
              width: `clamp(${img.size.width * 0.5}px, ${img.size.width * 0.15}vw, ${img.size.width}px)`,
              height: `clamp(${img.size.height * 0.5}px, ${img.size.height * 0.15}vw, ${img.size.height}px)`,
              zIndex: 2,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${img.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(30%) brightness(0.7)",
                opacity: 0.4,
              }}
            />
            {/* Subtle border accent */}
            <div
              className="absolute -inset-px pointer-events-none"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>
        ))}

        {/* Accessible source text */}
        <h2
          data-helix-source
          className={isReady ? "sr-only" : ""}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "4rem",
            fontWeight: 900,
            color: TOKENS.ink,
            textTransform: "uppercase",
          }}
        >
          Fashion 360
        </h2>

        {/* 3D Viewport */}
        {isReady && (
          <div
            data-helix-viewport
            aria-hidden="true"
            className="pb-[35vh] md:pb-0"
            style={{
              position: "absolute",
              inset: 0,
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
              overflow: "clip",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}
          >
            {/* Helix object - rotates as a whole */}
            <div
              ref={objectRef}
              data-helix-object
              style={{
                transformStyle: "preserve-3d",
                // No opacity or filter here - would flatten 3D
              }}
            >
              {glyphs.map((glyph, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    glyphRefs.current[i] = el;
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    fontSize: `${layoutRef.current.fontSize}px`,
                    fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 900,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    whiteSpace: "pre",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "visible",
                    // Center the glyph on its transform origin
                    marginLeft: `${-glyph.width / 2}px`,
                    marginTop: `${-layoutRef.current.fontSize / 2}px`,
                    willChange: "transform, opacity",
                  }}
                >
                  {glyph.char}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom tagline - outside 3D viewport */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 24px",
            background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 60%, transparent 100%)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: 1800,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
            }}
            className="md:grid-cols-[1fr_auto]"
          >
            <div>
              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  color: TOKENS.ink,
                  marginBottom: 16,
                  lineHeight: 1.1,
                }}
              >
                The New House for
                <br />
                <span style={{ color: TOKENS.accent }}>Israeli Fashion</span>
              </h3>
              <p
                style={{
                  maxWidth: 520,
                  color: "#a3a3a3",
                  fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
                  lineHeight: 1.7,
                }}
              >
                Discover the bold vision of Israel&apos;s most innovative designers.
                From Tel Aviv&apos;s streets to global runways, we curate collections
                that blend Mediterranean soul with cutting-edge design. This is where
                culture meets commerce, and every piece tells a story.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
              }}
            >
              <span
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: 11,
                  color: "#666",
                }}
              >
                Scroll to explore
              </span>
              <div style={{ width: 40, height: 1, backgroundColor: "#666" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
