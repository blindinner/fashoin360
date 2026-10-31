"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { designers, colorSchemes, getDesignerColors } from "@/lib/designers";
import DesignerDetailPanel from "./DesignerDetailPanel";

// Design dimensions for scaling
const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 900;

// Strip mode panel dimensions (design scale) - DESKTOP
const STRIP_PANEL_W = 100;
const STRIP_PANEL_H = 370;
const STRIP_GAP = 20;

// Strip mode panel dimensions - MOBILE (as percentage of viewport)
const MOBILE_PANEL_W_PERCENT = 0.65; // 65% of viewport width
const MOBILE_PANEL_H_PERCENT = 0.55; // 55% of viewport height
const MOBILE_GAP_PERCENT = 0.04; // 4% gap

// Project mode dimensions (design scale)
const PROJECT_W = 650;
const PROJECT_H = 520;

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

// Vertex shader with bulge effect
const vertexShader = `
  uniform float uBend;
  uniform float uRotate;
  uniform float uRadius;

  varying vec2 vUv;
  varying float vBulge;

  float easeInOutQuad(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
  }

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    float dist = abs(worldPos.x);
    float z = 0.0;
    if (dist < uRadius) {
      float normalizedDist = dist / uRadius;
      z = (uRadius - easeInOutQuad(normalizedDist) * uRadius) * uBend;
    }
    float angle = -0.4 * uRotate;
    mat3 rotY = mat3(cos(angle), 0.0, sin(angle), 0.0, 1.0, 0.0, -sin(angle), 0.0, cos(angle));
    vec3 rotatedPos = rotY * position;
    vec4 rotatedWorldPos = modelMatrix * vec4(rotatedPos, 1.0);
    rotatedWorldPos.z += z;
    vBulge = min(z * 0.005, 0.8);
    gl_Position = projectionMatrix * viewMatrix * rotatedWorldPos;
  }
`;

// Fragment shader - greyscale by default, color on hover/velocity
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uScale;
  uniform float uHover;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vBulge;

  void main() {
    vec2 coverUv = (vUv - 0.5) * uScale + 0.5;
    vec4 texColor = texture2D(uTexture, coverUv);

    // Calculate greyscale
    float grey = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 greyColor = vec3(grey);

    // Color amount = hover + velocity bulge
    float colorAmount = clamp(uHover + vBulge, 0.0, 1.0);

    // Mix: greyscale when colorAmount=0, full color when colorAmount=1
    vec3 finalColor = mix(greyColor, texColor.rgb, colorAmount);

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

// Helpers
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const damp = (a: number, b: number, t: number, dt: number) => lerp(a, b, 1 - Math.pow(1 - t, dt));
const getCoverScale = (pw: number, ph: number, ia: number): [number, number] => {
  const pa = pw / ph;
  return ia > pa ? [pa / ia, 1] : [1, ia / pa];
};
const hexToRgb = (hex: string): [number, number, number] => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255] : [0, 0, 0];
};

type Mode = "strip" | "project";

interface PanelData {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  index: number;
  imageAspect: number;
  baseX: number;
  // Animated values
  x: number; y: number; w: number; h: number;
  hover: number; opacity: number;
  // Targets
  targetX: number; targetY: number; targetW: number; targetH: number;
  targetHover: number; targetOpacity: number;
}

export default function DesignerShowcaseWebGL() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const panelsRef = useRef<PanelData[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>("strip");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Scroll state
  const scrollRef = useRef({ targ: 0, curr: 0, lag: 0, latency: 0, bend: 0, rotate: 0, max: 0, velocity: 0 });
  const dragRef = useRef({ active: false, startX: 0, startTarg: 0, movedDistance: 0, lastX: 0, lastTime: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  // Background color (animated)
  const bgColorRef = useRef({ r: 0, g: 0, b: 0 });
  const bgTargetRef = useRef({ r: 0, g: 0, b: 0 });

  // Viewport
  const viewportRef = useRef({ width: 0, height: 0 });
  const isMobileRef = useRef(false);

  // Detail panel state
  const [showDetail, setShowDetail] = useState(false);

  const getRatio = () => Math.min(viewportRef.current.width / DESIGN_WIDTH, viewportRef.current.height / DESIGN_HEIGHT);

  // Get panel dimensions based on device
  const getPanelDimensions = () => {
    const vw = viewportRef.current.width;
    const vh = viewportRef.current.height;

    if (isMobileRef.current) {
      return {
        panelW: vw * MOBILE_PANEL_W_PERCENT,
        panelH: vh * MOBILE_PANEL_H_PERCENT,
        gap: vw * MOBILE_GAP_PERCENT,
      };
    } else {
      const ratio = getRatio();
      return {
        panelW: STRIP_PANEL_W * ratio,
        panelH: STRIP_PANEL_H * ratio,
        gap: STRIP_GAP * ratio,
      };
    }
  };
  const getColors = (index: number) => getDesignerColors(index);

  // Initialize WebGL
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const rect = container.getBoundingClientRect();

    viewportRef.current = { width: rect.width, height: rect.height };
    isMobileRef.current = rect.width < MOBILE_BREAKPOINT;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // Lower pixel ratio on mobile for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileRef.current ? 1.5 : 2));
    renderer.setSize(rect.width, rect.height);
    renderer.setClearColor(0x000000, 1);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const fov = 45;
    const camera = new THREE.PerspectiveCamera(fov, rect.width / rect.height, 1, 2000);
    const cameraZ = rect.height / 2 / Math.tan((fov * Math.PI) / 180 / 2);
    camera.position.set(0, 0, cameraZ);
    cameraRef.current = camera;

    // Create panels
    const textureLoader = new THREE.TextureLoader();
    const { panelW, panelH, gap } = getPanelDimensions();
    const startX = rect.width / 2 - panelW / 2;

    scrollRef.current.max = (designers.length - 1) * (panelW + gap);

    const panels: PanelData[] = [];
    designers.forEach((designer, i) => {
      const geometry = new THREE.PlaneGeometry(1, 1, 20, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: null },
          uScale: { value: new THREE.Vector2(1, 1) },
          uHover: { value: 0 },
          uOpacity: { value: 1 },
          uBend: { value: 0 },
          uRotate: { value: 0 },
          uRadius: { value: 400 },
        },
        transparent: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const panelData: PanelData = {
        mesh, material, index: i, imageAspect: 1,
        baseX: startX + i * (panelW + gap),
        x: startX + i * (panelW + gap), y: 0, w: panelW, h: panelH,
        hover: 0, opacity: 1,
        targetX: startX + i * (panelW + gap), targetY: 0, targetW: panelW, targetH: panelH,
        targetHover: 0, targetOpacity: 1,
      };

      textureLoader.load(designer.image, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        panelData.imageAspect = tex.image.width / tex.image.height;
        material.uniforms.uTexture.value = tex;
      });

      panels.push(panelData);
    });

    panelsRef.current = panels;

    // Resize handler
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      viewportRef.current = { width: newRect.width, height: newRect.height };
      isMobileRef.current = newRect.width < MOBILE_BREAKPOINT;
      renderer.setSize(newRect.width, newRect.height);
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      const newCameraZ = newRect.height / 2 / Math.tan((fov * Math.PI) / 180 / 2);
      camera.position.z = newCameraZ;

      // Update panel dimensions on resize
      const { panelW, panelH, gap } = getPanelDimensions();
      const startX = newRect.width / 2 - panelW / 2;
      scrollRef.current.max = (designers.length - 1) * (panelW + gap);

      panelsRef.current.forEach((p, i) => {
        p.baseX = startX + i * (panelW + gap);
        p.targetW = panelW;
        p.targetH = panelH;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      panels.forEach((p) => { p.mesh.geometry.dispose(); p.material.dispose(); });
    };
  }, []);

  // Update layout based on mode
  const updateLayout = useCallback(() => {
    const panels = panelsRef.current;
    if (!panels.length) return;

    const vw = viewportRef.current.width;
    const vh = viewportRef.current.height;
    const ratio = getRatio();
    const isMobile = isMobileRef.current;

    if (mode === "strip") {
      const { panelW, panelH, gap } = getPanelDimensions();
      const startX = vw / 2 - panelW / 2;

      scrollRef.current.max = (designers.length - 1) * (panelW + gap);

      panels.forEach((p, i) => {
        p.baseX = startX + i * (panelW + gap);
        p.targetW = panelW;
        p.targetH = panelH;
        p.targetY = 0;
        p.targetOpacity = 1;
      });

      // Background to black
      bgTargetRef.current = { r: 0, g: 0, b: 0 };

    } else if (mode === "project" && selectedIndex !== null) {
      const projectW = PROJECT_W * ratio;
      const projectH = PROJECT_H * ratio;
      const panelW = STRIP_PANEL_W * ratio * 2.5;
      const panelH = PROJECT_H * ratio * 0.9;

      // Background to designer's color
      const [bgColor] = getColors(selectedIndex);
      const [r, g, b] = hexToRgb(bgColor);
      bgTargetRef.current = { r, g, b };

      // Selected panel - large, centered, offset right
      const selected = panels[selectedIndex];
      const offsetX = vw * 0.08;
      selected.targetW = projectW;
      selected.targetH = projectH;
      selected.targetX = vw / 2 - projectW / 2 + offsetX;
      selected.targetY = 0;
      selected.targetHover = 0;
      selected.targetOpacity = 1;

      // Layout other panels
      panels.forEach((p, i) => {
        if (i === selectedIndex) return;

        const dist = i - selectedIndex;

        if (dist === 1) {
          p.targetW = panelW;
          p.targetH = panelH;
          p.targetX = vw - panelW * 0.5;
          p.targetY = vh * 0.05;
          p.targetHover = 0;
          p.targetOpacity = 0.9;
        } else if (dist === -1) {
          p.targetW = panelW;
          p.targetH = panelH;
          p.targetX = -panelW * 0.5;
          p.targetY = -vh * 0.05;
          p.targetHover = 0;
          p.targetOpacity = 0.9;
        } else {
          p.targetW = panelW;
          p.targetH = panelH;
          p.targetX = dist > 0 ? vw + 200 : -panelW - 200;
          p.targetY = 0;
          p.targetOpacity = 0;
        }
      });
    }
  }, [mode, selectedIndex]);

  useEffect(() => {
    updateLayout();
  }, [mode, selectedIndex, updateLayout]);

  // Handle click to enter project mode or navigate
  const handlePanelClick = useCallback((index: number) => {
    if (mode === "strip" && dragRef.current.movedDistance < 10) {
      setSelectedIndex(index);
      setMode("project");
    } else if (mode === "project") {
      // In project mode, clicking a side panel navigates to it
      setSelectedIndex(index);
    }
  }, [mode]);

  // Handle back to strip
  const handleBackToStrip = useCallback(() => {
    if (mode === "project") {
      setShowDetail(false);
      setMode("strip");
      const { panelW, gap } = getPanelDimensions();
      if (selectedIndex !== null) {
        scrollRef.current.targ = selectedIndex * (panelW + gap);
        scrollRef.current.curr = scrollRef.current.targ;
      }
      setSelectedIndex(null);
    }
  }, [mode, selectedIndex]);

  // Animation loop
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const dt = Math.min(delta / 16.67, 3);

      const panels = panelsRef.current;
      const scroll = scrollRef.current;
      const vw = viewportRef.current.width;
      const vh = viewportRef.current.height;
      const ratio = getRatio();

      // Animate background color
      bgColorRef.current.r = damp(bgColorRef.current.r, bgTargetRef.current.r, 0.05, dt);
      bgColorRef.current.g = damp(bgColorRef.current.g, bgTargetRef.current.g, 0.05, dt);
      bgColorRef.current.b = damp(bgColorRef.current.b, bgTargetRef.current.b, 0.05, dt);
      rendererRef.current!.setClearColor(
        new THREE.Color(bgColorRef.current.r, bgColorRef.current.g, bgColorRef.current.b),
        1
      );

      if (mode === "strip") {
        // Apply velocity decay for momentum scrolling
        if (Math.abs(scroll.velocity) > 0.1) {
          scroll.targ += scroll.velocity * dt;
          scroll.targ = Math.max(0, Math.min(scroll.max, scroll.targ));
          scroll.velocity *= 0.95; // Decay
        } else {
          scroll.velocity = 0;
        }

        // Update scroll with damping - faster on mobile for snappier feel
        const scrollDamp = isMobileRef.current ? 0.15 : 0.08;
        scroll.curr = damp(scroll.curr, scroll.targ, scrollDamp, dt);
        scroll.lag = damp(scroll.lag, scroll.targ, 0.05, dt);
        scroll.latency = scroll.targ - scroll.lag;

        if (isActive) {
          // Reduce bend effect on mobile for smoother feel
          const bendFactor = isMobileRef.current ? 800 : 400;
          scroll.bend = Math.min(Math.abs(scroll.latency) / bendFactor, 1);
          scroll.rotate = Math.min(Math.max(scroll.latency / 1000, -1), 1);
        } else {
          scroll.bend = damp(scroll.bend, 0, 0.1, dt);
          scroll.rotate = damp(scroll.rotate, 0, 0.1, dt);
        }

        // Update current index
        const { panelW, gap } = getPanelDimensions();
        const newIndex = Math.round(scroll.curr / (panelW + gap));
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < designers.length) {
          setCurrentIndex(newIndex);
        }

        // Update strip panels
        const panelDamp = isMobileRef.current ? 0.2 : 0.08;
        panels.forEach((p) => {
          p.targetX = p.baseX - scroll.curr;

          // Set hover target based on hoveredIndex
          p.targetHover = p.index === hoveredIndex ? 1 : 0;

          // Animate to targets - faster on mobile
          p.x = damp(p.x, p.targetX, panelDamp, dt);
          p.y = damp(p.y, p.targetY, panelDamp, dt);
          p.w = damp(p.w, p.targetW, panelDamp, dt);
          p.h = damp(p.h, p.targetH, panelDamp, dt);
          p.hover = damp(p.hover, p.targetHover, 0.1, dt);
          p.opacity = damp(p.opacity, p.targetOpacity, panelDamp, dt);

          // Update mesh
          p.mesh.scale.set(p.w, p.h, 1);
          p.mesh.position.set(p.x - vw / 2 + p.w / 2, -p.y, 0);

          // Update material
          const [sx, sy] = getCoverScale(p.w, p.h, p.imageAspect);
          p.material.uniforms.uScale.value.set(sx, sy);
          p.material.uniforms.uHover.value = p.hover;
          p.material.uniforms.uOpacity.value = p.opacity;
          p.material.uniforms.uBend.value = scroll.bend;
          p.material.uniforms.uRotate.value = scroll.rotate;
        });
      } else {
        // Project mode - animate to fixed positions
        panels.forEach((p, i) => {
          p.x = damp(p.x, p.targetX, 0.06, dt);
          p.y = damp(p.y, p.targetY, 0.06, dt);
          p.w = damp(p.w, p.targetW, 0.06, dt);
          p.h = damp(p.h, p.targetH, 0.06, dt);
          p.hover = damp(p.hover, p.targetHover, 0.06, dt);
          p.opacity = damp(p.opacity, p.targetOpacity, 0.06, dt);

          // Update mesh
          p.mesh.scale.set(p.w, p.h, 1);
          p.mesh.position.set(p.x - vw / 2 + p.w / 2, -p.y, i === selectedIndex ? 10 : 0);

          // Update material
          const [sx, sy] = getCoverScale(p.w, p.h, p.imageAspect);
          p.material.uniforms.uScale.value.set(sx, sy);
          p.material.uniforms.uHover.value = p.hover;
          p.material.uniforms.uOpacity.value = p.opacity;
          p.material.uniforms.uBend.value = 0;
          p.material.uniforms.uRotate.value = 0;
        });
      }

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, selectedIndex, currentIndex, isActive, hoveredIndex]);

  // Intersection observer - only track visibility, don't block scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio > 0.3;
        setIsActive(active);
        // Don't add lenis-stopped - let users always scroll vertically
      },
      { threshold: [0.3] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Find panel at coordinates
  const findPanelAtPosition = useCallback((clientX: number, clientY: number): number | null => {
    const container = canvasContainerRef.current;
    if (!container) return null;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const vh = viewportRef.current.height;

    const panels = panelsRef.current;
    for (const p of panels) {
      if (p.opacity < 0.1) continue; // Skip hidden panels

      const left = p.x;
      const right = p.x + p.w;
      const top = vh / 2 - p.h / 2 + p.y;
      const bottom = vh / 2 + p.h / 2 + p.y;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return p.index;
      }
    }
    return null;
  }, []);

  // Pointer handlers
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Track touch state separately for better mobile handling
    const touchState = {
      startX: 0, startY: 0, startTime: 0,
      lastX: 0, lastTime: 0,
      isHorizontalSwipe: false,
      velocityX: 0,
      samples: [] as { x: number; t: number }[]
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isActive || showDetail) return;

      // Only handle horizontal scrolling, let vertical scroll pass through
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (mode === "strip") {
          const scroll = scrollRef.current;
          scroll.targ = Math.max(0, Math.min(scroll.max, scroll.targ + e.deltaX));
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive || showDetail) return;
      const touch = e.touches[0];
      const now = Date.now();

      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
      touchState.startTime = now;
      touchState.lastX = touch.clientX;
      touchState.lastTime = now;
      touchState.isHorizontalSwipe = false;
      touchState.velocityX = 0;
      touchState.samples = [{ x: touch.clientX, t: now }];

      // Stop any ongoing momentum
      scrollRef.current.velocity = 0;
      dragRef.current.startTarg = scrollRef.current.curr; // Use current position, not target
      dragRef.current.movedDistance = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || showDetail) return;
      const touch = e.touches[0];
      const now = Date.now();
      const dx = touch.clientX - touchState.startX;
      const dy = touch.clientY - touchState.startY;

      // Determine if this is a horizontal swipe (only once per gesture)
      if (!touchState.isHorizontalSwipe && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        touchState.isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
      }

      if (touchState.isHorizontalSwipe && mode === "strip") {
        e.preventDefault();
        dragRef.current.movedDistance = Math.abs(dx);

        // Track velocity samples (keep last 5)
        touchState.samples.push({ x: touch.clientX, t: now });
        if (touchState.samples.length > 5) touchState.samples.shift();

        // Direct 1:1 tracking for responsive feel
        const scroll = scrollRef.current;
        scroll.targ = Math.max(0, Math.min(scroll.max, dragRef.current.startTarg - dx));
        scroll.curr = scroll.targ; // Immediate response while dragging

        touchState.lastX = touch.clientX;
        touchState.lastTime = now;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isActive || showDetail) return;

      const touch = e.changedTouches[0];
      const elapsed = Date.now() - touchState.startTime;

      // Quick tap detection
      if (dragRef.current.movedDistance < 15 && elapsed < 300) {
        const clicked = findPanelAtPosition(touch.clientX, touch.clientY);
        if (clicked !== null) {
          handlePanelClick(clicked);
        }
        touchState.isHorizontalSwipe = false;
        return;
      }

      // Calculate velocity from recent samples for smooth momentum
      if (touchState.isHorizontalSwipe && mode === "strip" && touchState.samples.length >= 2) {
        const recent = touchState.samples.slice(-3);
        const first = recent[0];
        const last = recent[recent.length - 1];
        const dt = last.t - first.t;

        if (dt > 0 && dt < 200) {
          const velocity = (first.x - last.x) / dt; // pixels per ms
          const scroll = scrollRef.current;

          // Apply momentum
          scroll.velocity = velocity * 15; // Scale for smooth deceleration

          // Snap to nearest panel after momentum settles
          const { panelW, gap } = getPanelDimensions();
          const panelSize = panelW + gap;
          const projectedPosition = scroll.targ + velocity * 200;
          const nearestIndex = Math.round(projectedPosition / panelSize);
          const clampedIndex = Math.max(0, Math.min(designers.length - 1, nearestIndex));

          // Set target to snap position
          setTimeout(() => {
            scroll.targ = clampedIndex * panelSize;
          }, 150);
        }
      }

      touchState.isHorizontalSwipe = false;
      touchState.samples = [];
    };

    // Desktop pointer handlers
    const handlePointerDown = (e: PointerEvent) => {
      if (!isActive || e.pointerType === "touch") return;
      dragRef.current.active = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startTarg = scrollRef.current.targ;
      dragRef.current.movedDistance = 0;
      container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Update hovered panel
      if (!dragRef.current.active) {
        const hovered = findPanelAtPosition(e.clientX, e.clientY);
        setHoveredIndex(hovered);

        // Update cursor style in project mode for clickable side panels
        if (mode === "project" && hovered !== null && hovered !== selectedIndex) {
          container.style.cursor = "pointer";
        } else {
          container.style.cursor = dragRef.current.active ? "grabbing" : "grab";
        }
      }

      if (!dragRef.current.active) return;

      const dx = e.clientX - dragRef.current.startX;
      dragRef.current.movedDistance = Math.abs(dx);

      if (mode === "strip") {
        const scroll = scrollRef.current;
        scroll.targ = Math.max(0, Math.min(scroll.max, dragRef.current.startTarg - dx));
      } else if (mode === "project" && dragRef.current.movedDistance > 30) {
        // Return to strip on drag
        setMode("strip");
        const { panelW, gap } = getPanelDimensions();
        const scroll = scrollRef.current;

        if (selectedIndex !== null) {
          scroll.curr = selectedIndex * (panelW + gap);
          scroll.targ = Math.max(0, Math.min(scroll.max, scroll.curr - dx));
        }
        setSelectedIndex(null);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (dragRef.current.active && dragRef.current.movedDistance < 10) {
        // It was a click
        const clicked = findPanelAtPosition(e.clientX, e.clientY);
        if (clicked !== null) {
          handlePanelClick(clicked);
        }
      }

      dragRef.current.active = false;
      container.releasePointerCapture(e.pointerId);
    };

    const handlePointerLeave = () => {
      setHoveredIndex(null);
      dragRef.current.active = false;
    };

    // Touch events for mobile
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Pointer events for desktop
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isActive, mode, selectedIndex, showDetail, handlePanelClick, handleBackToStrip, findPanelAtPosition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      if (mode === "strip") {
        const scroll = scrollRef.current;
        const { panelW, gap } = getPanelDimensions();
        const step = panelW + gap;

        if (e.key === "ArrowRight") {
          scroll.targ = Math.min(scroll.max, scroll.targ + step);
        } else if (e.key === "ArrowLeft") {
          scroll.targ = Math.max(0, scroll.targ - step);
        } else if (e.key === "Enter") {
          handlePanelClick(currentIndex);
        }
      } else {
        if (e.key === "Escape" || e.key === "Backspace") {
          handleBackToStrip();
        } else if (e.key === "ArrowRight" && selectedIndex !== null && selectedIndex < designers.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        } else if (e.key === "ArrowLeft" && selectedIndex !== null && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, selectedIndex, currentIndex, isActive, handlePanelClick, handleBackToStrip]);

  const currentDesigner = selectedIndex !== null ? designers[selectedIndex] : designers[currentIndex];
  const [, textColor] = selectedIndex !== null ? getColors(selectedIndex) : ["#0a0a0a", "#c5a227"];
  const nameLines = currentDesigner.name.toUpperCase().split(" ");

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* WebGL Canvas */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        style={{ touchAction: "pan-y" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Strip Mode UI */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${mode === "strip" ? "opacity-100" : "opacity-0"}`}>
        {/* Header */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex items-start justify-between">
          <div>
            <span className="text-[#ff3d00] text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2 block">Featured</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white">Designers</h2>
          </div>
          <a href="/designers" className="pointer-events-auto hidden md:flex items-center gap-3 text-xs uppercase tracking-widest text-[#a3a3a3] hover:text-white transition-colors group">
            View All
            <span className="w-6 h-[1px] bg-current transform group-hover:w-10 transition-all" />
          </a>
        </div>

        {/* Tick bar - positioned below header on mobile */}
        <div className="absolute top-20 md:top-8 left-1/2 -translate-x-1/2 flex gap-[2px]">
          {designers.map((_, i) => (
            <div
              key={i}
              className="w-[2px] h-2 md:h-3 transition-all duration-300"
              style={{
                backgroundColor: i === currentIndex ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)",
                transform: i === currentIndex ? "scaleY(1.5)" : "scaleY(1)",
              }}
            />
          ))}
        </div>

        {/* Current designer name on mobile */}
        <div className="md:hidden absolute bottom-24 left-4 right-4 text-center">
          <p className="text-xs uppercase tracking-widest text-[#a3a3a3] mb-1">{designers[currentIndex]?.category}</p>
          <h3 className="font-display text-xl font-bold text-white">{designers[currentIndex]?.name}</h3>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-[10px] md:text-xs uppercase tracking-widest text-[#a3a3a3] text-center px-4">
          {isActive ? (
            <span className="hidden md:inline">Scroll or drag to explore · Click to view</span>
          ) : (
            "Scroll into view"
          )}
          {isActive && <span className="md:hidden">Swipe to explore · Tap to view</span>}
        </div>
      </div>

      {/* Project Mode UI */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${mode === "project" ? "opacity-100" : "opacity-0"}`}>
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0">
          <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
            {/* Back button on mobile, Logo on desktop */}
            <button onClick={handleBackToStrip} className="pointer-events-auto flex items-center gap-2">
              <svg className="md:hidden w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden md:inline font-display text-xl font-bold tracking-tight" style={{ color: textColor }}>
                FASHION 360
              </span>
            </button>

            {/* Counter - simplified on mobile */}
            <div className="flex items-center gap-2 md:gap-3" style={{ color: textColor }}>
              <span className="text-xs md:text-sm font-medium tabular-nums">
                {String((selectedIndex ?? 0) + 1).padStart(2, "0")}
              </span>
              <span className="text-xs md:text-sm opacity-50">/</span>
              <span className="text-xs md:text-sm font-medium tabular-nums opacity-50">
                {String(designers.length).padStart(2, "0")}
              </span>
              {/* Progress ticks - hidden on mobile */}
              <div className="hidden md:flex gap-[3px] ml-2">
                {designers.map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] h-4 transition-all duration-300"
                    style={{
                      backgroundColor: i <= (selectedIndex ?? 0) ? textColor : `${textColor}30`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* About link - hidden on mobile */}
            <a href="#" className="pointer-events-auto hidden md:block text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity" style={{ color: textColor }}>
              About
            </a>
          </div>
        </div>

        {/* Giant Typography - Designer Name (smaller on mobile, positioned higher) */}
        <div className="absolute inset-x-0 top-16 bottom-32 md:inset-0 flex flex-col justify-center px-4 md:px-8" style={{ zIndex: 5 }}>
          {nameLines.map((line, lineIndex) => (
            <div
              key={lineIndex}
              className="flex"
              style={{
                marginLeft: lineIndex % 2 === 0 ? "0" : "4vw",
                marginTop: lineIndex === 0 ? "0" : "-1vw",
              }}
            >
              {line.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="font-display font-black"
                  style={{
                    color: textColor,
                    fontSize: "clamp(2rem, 10vw, 18rem)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.02em",
                    marginRight: "0.2vw",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Category + Explore Button - positioned higher on mobile */}
        <div className="absolute bottom-20 md:bottom-8 left-4 md:left-8 right-4 md:right-auto flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 safe-area-pb">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium" style={{ color: textColor }}>
            {currentDesigner.category}
          </span>
          <button
            onClick={() => setShowDetail(true)}
            className="pointer-events-auto w-full md:w-auto px-6 py-4 md:py-2 text-sm md:text-xs uppercase tracking-widest font-medium border transition-all active:scale-95 md:hover:scale-105"
            style={{
              borderColor: textColor,
              color: textColor,
              backgroundColor: `${textColor}15`,
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.backgroundColor = textColor;
                e.currentTarget.style.color = "#000";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${textColor}15`;
              e.currentTarget.style.color = textColor;
            }}
          >
            Explore Designer
          </button>
        </div>

        {/* Navigation hint - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-xs uppercase tracking-widest" style={{ color: textColor, opacity: 0.4 }}>
            Scroll to go back · Click sides to navigate
          </span>
        </div>

        {/* Social links - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 right-8 pointer-events-auto text-right">
          {currentDesigner.instagram && (
            <a
              href={`https://instagram.com/${currentDesigner.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: textColor }}
            >
              Instagram
            </a>
          )}
          {currentDesigner.website && (
            <a
              href={currentDesigner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mt-1"
              style={{ color: textColor }}
            >
              Website
            </a>
          )}
        </div>
      </div>

      {/* Designer Detail Panel */}
      {selectedIndex !== null && (
        <DesignerDetailPanel
          designer={designers[selectedIndex]}
          accentColor={textColor}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </section>
  );
}
