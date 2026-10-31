"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { projects, Project } from "./projects";
import { vertexShader, fragmentShader, bgVertexShader, bgFragmentShader } from "./shaders";

// Design dimensions for scaling
const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 900;

// Panel dimensions at design scale
const PANEL_WIDTH = 100;
const PANEL_HEIGHT = 370;
const PANEL_GAP = 20;

// Project mode dimensions
const PROJECT_FRAME_WIDTH = 1054;
const PROJECT_FRAME_HEIGHT = 602;
const PROJECT_GAP = 152;

// Modes
type Mode = "strip" | "project" | "detail";

// Damping helper (frame-rate independent)
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const damp = (a: number, b: number, t: number, dtFrames: number) =>
  lerp(a, b, 1 - Math.pow(1 - t, dtFrames));

// Easing functions
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Color helpers
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

interface PanelData {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  index: number;
  texture: THREE.Texture;
  baseX: number;
  imageAspect: number; // Original image aspect ratio
  // Current animated values
  x: number;
  y: number;
  w: number;
  h: number;
  light: number;
  opacity: number;
  multiply: number;
  // Targets
  targetX: number;
  targetY: number;
  targetW: number;
  targetH: number;
  targetLight: number;
  targetOpacity: number;
  targetMultiply: number;
}

// Calculate cover-fit UV scale based on panel and image aspect ratios
const getCoverScale = (panelW: number, panelH: number, imageAspect: number): [number, number] => {
  const panelAspect = panelW / panelH;
  if (imageAspect > panelAspect) {
    // Image is wider than panel - fit height, crop width
    return [panelAspect / imageAspect, 1];
  } else {
    // Image is taller than panel - fit width, crop height
    return [1, imageAspect / panelAspect];
  }
};

interface VelocityStripProps {
  isActive?: boolean;
  onEscape?: () => void;
  onModeChange?: (mode: "strip" | "project" | "detail") => void;
}

export default function VelocityStrip({ isActive = true, onEscape, onModeChange }: VelocityStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const panelsRef = useRef<PanelData[]>([]);
  const bgMeshRef = useRef<THREE.Mesh | null>(null);
  const bgMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // State
  const [mode, setMode] = useState<Mode>("strip");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  // Scroll state
  const scrollRef = useRef({
    targ: 0,
    curr: 0,
    lag: 0,
    latency: 0,
    bend: 0,
    rotate: 0,
    max: 0,
  });

  // Drag state
  const dragRef = useRef({
    active: false,
    startX: 0,
    startTarg: 0,
  });

  // Mouse state
  const mouseRef = useRef({ x: 0, y: 0, moved: false });

  // Background color
  const bgColorRef = useRef({ r: 0.08, g: 0.08, b: 0.08 }); // #141414
  const bgTargetRef = useRef({ r: 0.08, g: 0.08, b: 0.08 });

  // Viewport
  const viewportRef = useRef({ width: 0, height: 0, ratio: 1 });

  // Reduced motion preference
  const reducedMotionRef = useRef(false);

  // Calculate ratio for scaling
  const getRatio = useCallback(() => {
    const { width, height } = viewportRef.current;
    return Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Check reduced motion preference
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Viewport
    viewportRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: Math.min(
        window.innerWidth / DESIGN_WIDTH,
        window.innerHeight / DESIGN_HEIGHT
      ),
    };

    // Renderer
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(viewportRef.current.width, viewportRef.current.height);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - positioned so 1 unit = 1 CSS pixel at z=0
    const fov = 45;
    const aspect = viewportRef.current.width / viewportRef.current.height;
    const near = 1;
    const far = 2000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // Calculate camera Z so that viewport height = scene height at z=0
    const halfFovRad = (fov * Math.PI) / 180 / 2;
    const cameraZ = viewportRef.current.height / 2 / Math.tan(halfFovRad);
    camera.position.set(0, 0, cameraZ);
    cameraRef.current = camera;

    // Background plane
    const bgGeometry = new THREE.PlaneGeometry(
      viewportRef.current.width * 2,
      viewportRef.current.height * 2
    );
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Vector3(0.08, 0.08, 0.08) },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -500;
    scene.add(bgMesh);
    bgMeshRef.current = bgMesh;
    bgMaterialRef.current = bgMaterial;

    // Create panels
    const ratio = getRatio();
    const panelW = PANEL_WIDTH * ratio;
    const panelH = PANEL_HEIGHT * ratio;
    const gap = PANEL_GAP * ratio;

    // Start position (panel 0 centered)
    const startX = viewportRef.current.width / 2 - panelW / 2;

    // Max scroll
    scrollRef.current.max = (projects.length - 1) * (panelW + gap);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Create panel meshes
    const panels: PanelData[] = [];
    projects.forEach((project, i) => {
      // Subdivided plane for smooth vertex bulge
      const geometry = new THREE.PlaneGeometry(1, 1, 20, 1);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: null },
          uScale: { value: new THREE.Vector2(1, 1) },
          uOffsetY: { value: 0 },
          uLight: { value: 0 },
          uOpacity: { value: 0 }, // Start invisible for intro
          uMultiply: { value: 0 },
          uBgColor: { value: new THREE.Vector3(1, 1, 1) },
          uBend: { value: 0 },
          uRotate: { value: 0 },
          uRadius: { value: 500 * ratio },
          uViewport: {
            value: new THREE.Vector2(
              viewportRef.current.width,
              viewportRef.current.height
            ),
          },
        },
        transparent: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Initial positions for intro (far right, 3x spacing)
      const introBaseX = startX + i * (panelW + gap) * 3;

      // Create panel data first (texture loads async)
      const panelData: PanelData = {
        mesh,
        material,
        index: i,
        texture: null as unknown as THREE.Texture,
        baseX: startX + i * (panelW + gap),
        imageAspect: 1, // Default, updated when texture loads
        // Current values
        x: introBaseX,
        y: 0,
        w: panelW,
        h: panelH,
        light: 0,
        opacity: 0,
        multiply: 0,
        // Targets (will be set by updateLayout)
        targetX: startX + i * (panelW + gap),
        targetY: 0,
        targetW: panelW,
        targetH: panelH,
        targetLight: 0,
        targetOpacity: 1,
        targetMultiply: 0,
      };

      // Load texture and store image aspect ratio
      const texture = textureLoader.load(project.image, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        // Store image aspect ratio for dynamic UV calculation
        const imgAspect = tex.image.width / tex.image.height;
        panelData.imageAspect = imgAspect;
        panelData.texture = tex;

        // Set initial UV scale
        const [scaleX, scaleY] = getCoverScale(panelData.w, panelData.h, imgAspect);
        material.uniforms.uScale.value.set(scaleX, scaleY);
        material.uniforms.uTexture.value = tex;
      });

      panels.push(panelData);
    });

    panelsRef.current = panels;

    // Start intro animation
    setTimeout(() => {
      panels.forEach((p) => {
        p.targetOpacity = 1;
      });
      setTimeout(() => setIntroComplete(true), 1000);
    }, 100);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      panels.forEach((p) => {
        p.mesh.geometry.dispose();
        p.material.dispose();
        if (p.texture) p.texture.dispose();
      });
      bgGeometry.dispose();
      bgMaterial.dispose();
    };
  }, [getRatio]);

  // Update layout based on mode
  const updateLayout = useCallback(() => {
    const panels = panelsRef.current;
    if (!panels.length) return;

    const ratio = getRatio();
    const vw = viewportRef.current.width;
    const vh = viewportRef.current.height;

    if (mode === "strip") {
      // Strip mode layout
      const panelW = PANEL_WIDTH * ratio;
      const panelH = PANEL_HEIGHT * ratio;
      const gap = PANEL_GAP * ratio;
      const startX = vw / 2 - panelW / 2;

      scrollRef.current.max = (projects.length - 1) * (panelW + gap);

      panels.forEach((p, i) => {
        p.baseX = startX + i * (panelW + gap);
        p.targetW = panelW;
        p.targetH = panelH;
        p.targetY = 0;
        p.targetLight = 0;
        p.targetOpacity = 1;
        p.targetMultiply = 0;
      });

      // Background to dark
      bgTargetRef.current = { r: 0.08, g: 0.08, b: 0.08 };
    } else if (mode === "project") {
      // Project mode layout
      const project = projects[currentIndex];
      const frameW = PROJECT_FRAME_WIDTH * ratio;
      const frameH = PROJECT_FRAME_HEIGHT * ratio;
      const gap = PROJECT_GAP * (vw / DESIGN_WIDTH);

      // Selected panel - centered
      const selectedPanel = panels[currentIndex];
      selectedPanel.targetW = frameW;
      selectedPanel.targetH = frameH;
      selectedPanel.targetX = vw / 2 - frameW / 2;
      selectedPanel.targetY = 0;
      selectedPanel.targetLight = 1;
      selectedPanel.targetOpacity = 1;
      selectedPanel.targetMultiply = 0;

      // Neighbour width
      const neighbourW = Math.max(
        0.5 * (vw - (frameW + 2 * gap)),
        0.5 * frameW
      );

      // Layout neighbours and others
      panels.forEach((p, i) => {
        if (i === currentIndex) return;

        const dist = i - currentIndex;

        if (Math.abs(dist) === 1) {
          // Neighbour
          p.targetW = neighbourW;
          p.targetH = frameH;
          p.targetY = 0;
          p.targetLight = 0.3;
          p.targetOpacity = 1;
          p.targetMultiply = project.color.multiply;

          if (dist === -1) {
            // Left neighbour
            p.targetX = vw / 2 - frameW / 2 - gap - neighbourW;
          } else {
            // Right neighbour
            p.targetX = vw / 2 + frameW / 2 + gap;
          }
        } else {
          // Far away panels
          const panelW = PANEL_WIDTH * ratio;
          p.targetW = panelW;
          p.targetH = frameH;
          p.targetOpacity = 0;

          if (dist < -1) {
            // Far left
            const k = Math.abs(dist) - 1;
            const extraGap = gap * k * k * 0.1;
            p.targetX =
              vw / 2 -
              frameW / 2 -
              gap -
              neighbourW -
              gap -
              (Math.abs(dist) - 1) * (panelW + gap) -
              extraGap;
          } else {
            // Far right
            const k = dist - 1;
            const extraGap = gap * k * k * 0.1;
            p.targetX =
              vw / 2 +
              frameW / 2 +
              gap +
              neighbourW +
              gap +
              (dist - 1) * (panelW + gap) +
              extraGap;
          }
        }
      });

      // Background to project color
      const [r, g, b] = hexToRgb(project.color.bg);
      bgTargetRef.current = { r, g, b };
    }
  }, [mode, currentIndex, getRatio]);

  // Handle click on panel
  const handlePanelClick = useCallback(
    (index: number) => {
      if (!introComplete) return;

      if (mode === "strip") {
        // First scroll to center the panel, then switch to project mode
        const ratio = getRatio();
        const panelW = PANEL_WIDTH * ratio;
        const gap = PANEL_GAP * ratio;
        scrollRef.current.targ = index * (panelW + gap);
        setCurrentIndex(index);
        setTimeout(() => setMode("project"), 100);
      } else if (mode === "project") {
        // Check if clicking neighbour
        if (index === currentIndex - 1 || index === currentIndex + 1) {
          setCurrentIndex(index);
        }
      }
    },
    [mode, currentIndex, introComplete, getRatio]
  );

  // Handle going back to strip mode
  const handleBackToStrip = useCallback(() => {
    setMode("strip");
  }, []);

  // Handle explore click
  const handleExplore = useCallback(() => {
    const project = projects[currentIndex];
    window.history.pushState({}, "", `/${project.slug}`);
    setMode("detail");
    setGalleryIndex(0);
  }, [currentIndex]);

  // Handle back from detail
  const handleBackFromDetail = useCallback(() => {
    window.history.pushState({}, "", "/");
    setMode("project");
  }, []);

  // Effect to update layout when mode changes
  useEffect(() => {
    updateLayout();
  }, [mode, currentIndex, updateLayout]);

  // Notify parent of mode changes
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  // Animation loop
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      // Delta time for frame-rate independence
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const dtFrames = delta / 16.67; // Normalize to 60fps

      const panels = panelsRef.current;
      const scroll = scrollRef.current;
      const ratio = getRatio();
      const vw = viewportRef.current.width;

      if (mode === "strip") {
        // Update scroll with damping
        scroll.curr = damp(scroll.curr, scroll.targ, 0.08, dtFrames);
        scroll.lag = damp(scroll.lag, scroll.targ, 0.08, dtFrames);
        scroll.latency +=
          (scroll.targ - scroll.lag - scroll.latency) * 0.08 * dtFrames;

        // Calculate bend and rotate from latency (velocity proxy)
        if (!reducedMotionRef.current) {
          scroll.bend = Math.min(Math.abs(scroll.latency) / 500, 1);
          scroll.rotate = Math.max(
            -1.7,
            Math.min(1.7, scroll.latency / (500 / 1.7))
          );
        } else {
          scroll.bend = 0;
          scroll.rotate = 0;
        }

        // Update current index
        const panelW = PANEL_WIDTH * ratio;
        const gap = PANEL_GAP * ratio;
        const newIndex = Math.round(scroll.curr / (panelW + gap));
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < projects.length) {
          setCurrentIndex(newIndex);
        }

        // Update panels
        panels.forEach((p) => {
          // Screen position
          const screenX = p.baseX - scroll.curr;
          p.targetX = screenX;

          // Animate to targets
          p.x = damp(p.x, p.targetX, 0.08, dtFrames);
          p.y = damp(p.y, p.targetY, 0.08, dtFrames);
          p.w = damp(p.w, p.targetW, 0.08, dtFrames);
          p.h = damp(p.h, p.targetH, 0.08, dtFrames);
          p.light = damp(p.light, p.targetLight, 0.1, dtFrames);
          p.opacity = damp(p.opacity, p.targetOpacity, 0.08, dtFrames);
          p.multiply = damp(p.multiply, p.targetMultiply, 0.08, dtFrames);

          // Update mesh transform
          p.mesh.position.set(
            p.x + p.w / 2 - vw / 2,
            -p.y,
            0
          );
          p.mesh.scale.set(p.w, p.h, 1);

          // Update uniforms
          p.material.uniforms.uBend.value = scroll.bend;
          p.material.uniforms.uRotate.value = scroll.rotate;
          p.material.uniforms.uLight.value = p.light;
          p.material.uniforms.uOpacity.value = p.opacity;
          p.material.uniforms.uMultiply.value = p.multiply;
          p.material.uniforms.uRadius.value = 500 * ratio;

          // Update UV scale based on current panel dimensions
          if (p.imageAspect > 0) {
            const [scaleX, scaleY] = getCoverScale(p.w, p.h, p.imageAspect);
            p.material.uniforms.uScale.value.set(scaleX, scaleY);
          }
        });
      } else if (mode === "project" || mode === "detail") {
        // In project/detail mode, just animate to targets
        panels.forEach((p) => {
          p.x = damp(p.x, p.targetX, 0.07, dtFrames);
          p.y = damp(p.y, p.targetY, 0.07, dtFrames);
          p.w = damp(p.w, p.targetW, 0.07, dtFrames);
          p.h = damp(p.h, p.targetH, 0.07, dtFrames);
          p.light = damp(p.light, p.targetLight, 0.1, dtFrames);
          p.opacity = damp(p.opacity, p.targetOpacity, 0.07, dtFrames);
          p.multiply = damp(p.multiply, p.targetMultiply, 0.07, dtFrames);

          // Reset bend/rotate
          p.material.uniforms.uBend.value = damp(
            p.material.uniforms.uBend.value,
            0,
            0.1,
            dtFrames
          );
          p.material.uniforms.uRotate.value = damp(
            p.material.uniforms.uRotate.value,
            0,
            0.1,
            dtFrames
          );

          // Update mesh
          p.mesh.position.set(p.x + p.w / 2 - vw / 2, -p.y, 0);
          p.mesh.scale.set(p.w, p.h, 1);

          // Update uniforms
          p.material.uniforms.uLight.value = p.light;
          p.material.uniforms.uOpacity.value = p.opacity;
          p.material.uniforms.uMultiply.value = p.multiply;

          // Update bg color uniform
          const bg = bgColorRef.current;
          p.material.uniforms.uBgColor.value.set(bg.r, bg.g, bg.b);

          // Update UV scale based on current panel dimensions
          if (p.imageAspect > 0) {
            const [scaleX, scaleY] = getCoverScale(p.w, p.h, p.imageAspect);
            p.material.uniforms.uScale.value.set(scaleX, scaleY);
          }
        });
      }

      // Animate background color
      const bg = bgColorRef.current;
      const target = bgTargetRef.current;
      bg.r = damp(bg.r, target.r, 0.05, dtFrames);
      bg.g = damp(bg.g, target.g, 0.05, dtFrames);
      bg.b = damp(bg.b, target.b, 0.05, dtFrames);

      if (bgMaterialRef.current) {
        bgMaterialRef.current.uniforms.uColor.value.set(bg.r, bg.g, bg.b);
      }

      // Render
      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, currentIndex, getRatio]);

  // Event handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wheel handler
    const handleWheel = (e: WheelEvent) => {
      if (!isActive) return;
      e.preventDefault();

      if (mode !== "strip") {
        // Any wheel in project mode returns to strip
        if (mode === "project") {
          handleBackToStrip();
        }
        return;
      }

      const scroll = scrollRef.current;
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      // Firefox line mode adjustment
      const multiplier = e.deltaMode === 1 ? 0.75 : 0.556;

      scroll.targ = Math.max(
        0,
        Math.min(scroll.max, scroll.targ + delta * multiplier)
      );
    };

    // Pointer handlers
    const handlePointerDown = (e: PointerEvent) => {
      if (mode !== "strip") return;

      dragRef.current = {
        active: true,
        startX: e.clientX,
        startTarg: scrollRef.current.targ,
      };
      mouseRef.current.moved = false;
      container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;

      // Hover detection
      if (mode === "strip" && !dragRef.current.active) {
        const panels = panelsRef.current;
        const vw = viewportRef.current.width;
        const vh = viewportRef.current.height;

        panels.forEach((p) => {
          const left = p.x;
          const right = p.x + p.w;
          const top = vh / 2 - p.h / 2;
          const bottom = vh / 2 + p.h / 2;

          if (
            mouseRef.current.x >= left &&
            mouseRef.current.x <= right &&
            mouseRef.current.y >= top &&
            mouseRef.current.y <= bottom
          ) {
            p.targetLight = 1;
          } else {
            p.targetLight = 0;
          }
        });
      }

      if (!dragRef.current.active) return;

      const drag = dragRef.current;
      const scroll = scrollRef.current;
      const sensitivity = 1;

      scroll.targ = Math.max(
        0,
        Math.min(
          scroll.max,
          drag.startTarg - (e.clientX - drag.startX) * sensitivity
        )
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (dragRef.current.active) {
        container.releasePointerCapture(e.pointerId);
        dragRef.current.active = false;

        // If no movement, treat as click
        if (!mouseRef.current.moved) {
          // Hit test panels
          const panels = panelsRef.current;
          const vh = viewportRef.current.height;

          for (const p of panels) {
            const left = p.x;
            const right = p.x + p.w;
            const top = vh / 2 - p.h / 2;
            const bottom = vh / 2 + p.h / 2;

            if (
              mouseRef.current.x >= left &&
              mouseRef.current.x <= right &&
              mouseRef.current.y >= top &&
              mouseRef.current.y <= bottom
            ) {
              handlePanelClick(p.index);
              break;
            }
          }
        }
      }
    };

    // Click handler for project mode
    const handleClick = (e: MouseEvent) => {
      if (mode !== "project") return;

      const panels = panelsRef.current;
      const vh = viewportRef.current.height;

      for (const p of panels) {
        const left = p.x;
        const right = p.x + p.w;
        const top = vh / 2 - p.h / 2;
        const bottom = vh / 2 + p.h / 2;

        if (
          e.clientX >= left &&
          e.clientX <= right &&
          e.clientY >= top &&
          e.clientY <= bottom
        ) {
          handlePanelClick(p.index);
          break;
        }
      }
    };

    // Keyboard handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === "detail") {
        if (e.key === "Escape" || e.key === "p") {
          handleBackFromDetail();
        } else if (
          e.key === "ArrowDown" ||
          e.key === "ArrowRight" ||
          e.key === " "
        ) {
          e.preventDefault();
          const project = projects[currentIndex];
          if (galleryIndex < project.gallery.length - 1) {
            setGalleryIndex(galleryIndex + 1);
          }
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          if (galleryIndex > 0) {
            setGalleryIndex(galleryIndex - 1);
          } else {
            handleBackFromDetail();
          }
        }
      } else if (mode === "project") {
        if (e.key === "Escape") {
          handleBackToStrip();
        }
      } else if (mode === "strip") {
        if (e.key === "Escape" && onEscape) {
          onEscape();
        }
      }
    };

    // Resize handler
    const handleResize = () => {
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: Math.min(
          window.innerWidth / DESIGN_WIDTH,
          window.innerHeight / DESIGN_HEIGHT
        ),
      };

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(
          viewportRef.current.width,
          viewportRef.current.height
        );
        cameraRef.current.aspect =
          viewportRef.current.width / viewportRef.current.height;
        cameraRef.current.updateProjectionMatrix();

        // Recalculate camera Z
        const fov = 45;
        const halfFovRad = (fov * Math.PI) / 180 / 2;
        const cameraZ = viewportRef.current.height / 2 / Math.tan(halfFovRad);
        cameraRef.current.position.z = cameraZ;

        // Update background mesh size
        if (bgMeshRef.current) {
          bgMeshRef.current.geometry.dispose();
          bgMeshRef.current.geometry = new THREE.PlaneGeometry(
            viewportRef.current.width * 2,
            viewportRef.current.height * 2
          );
        }
      }

      updateLayout();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    mode,
    currentIndex,
    galleryIndex,
    handlePanelClick,
    handleBackToStrip,
    handleBackFromDetail,
    updateLayout,
    isActive,
    onEscape,
  ]);

  // Current project data
  const project = projects[currentIndex];
  const isLightBg =
    mode !== "strip" && project && hexToRgb(project.color.bg).reduce((a, b) => a + b, 0) > 1.5;
  const textColor = isLightBg ? "#1a1a1a" : "#fafafa";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Tick bar / Progress indicator */}
      {mode === "strip" && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {projects.map((_, i) => (
            <div
              key={i}
              className="w-px h-4 transition-all duration-300"
              style={{
                backgroundColor:
                  i === currentIndex
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.2)",
                transform: i === currentIndex ? "scaleY(1.5)" : "scaleY(1)",
              }}
            />
          ))}
        </div>
      )}

      {/* Project mode counter */}
      {mode === "project" && (
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 font-mono text-sm transition-colors duration-500"
          style={{ color: textColor }}
        >
          <div className="flex gap-px">
            {Array(Math.min(currentIndex, 5))
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-px h-3"
                  style={{ backgroundColor: textColor, opacity: 0.3 }}
                />
              ))}
          </div>
          <span style={{ opacity: 0.5 }}>
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div
            className="w-8 h-px"
            style={{ backgroundColor: textColor, opacity: 0.3 }}
          />
          <span style={{ opacity: 0.5 }}>
            {String(projects.length).padStart(2, "0")}
          </span>
          <div className="flex gap-px">
            {Array(Math.min(projects.length - currentIndex - 1, 5))
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-px h-3"
                  style={{ backgroundColor: textColor, opacity: 0.3 }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Title letters */}
      {mode === "project" && project && (
        <div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex transition-colors duration-500"
          style={{
            fontSize: `${Math.min(viewportRef.current.width * 0.15, 270)}px`,
            lineHeight: 0.85,
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: project.color.text,
          }}
        >
          {project.title.split("").map((letter, i) => {
            const totalWidth = project.title.length * 0.8; // em units
            const position = project.letterPositions[i] || i * (100 / project.title.length);
            const offset = (position / 100 - 0.5) * totalWidth;
            return (
              <div
                key={i}
                className="transition-transform duration-1000"
                style={{
                  transform: `translate3d(${offset}em, 0, 0)`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${i * 10}ms`,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      )}

      {/* Explore link */}
      {mode === "project" && (
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0 animate-fadeIn"
          style={{
            animationDelay: "400ms",
            animationFillMode: "forwards",
            animationDuration: "1600ms",
            color: textColor,
          }}
        >
          <button
            onClick={handleExplore}
            className="text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
          >
            Explore
          </button>
          <div
            className="w-px h-8"
            style={{ backgroundColor: textColor, opacity: 0.3 }}
          />
          <div
            className="text-lg"
            style={{ opacity: 0.5 }}
          >
            +
          </div>
        </div>
      )}

      {/* Detail mode UI */}
      {mode === "detail" && project && (
        <>
          {/* Close / Projects button */}
          <button
            onClick={handleBackFromDetail}
            className="absolute top-8 right-8 z-20 text-xs tracking-widest uppercase hover:opacity-70 transition-all flex flex-col items-center gap-2"
            style={{ color: textColor }}
          >
            <span className="text-xl">&times;</span>
            <span>Projects</span>
          </button>

          {/* Packed title */}
          <div
            className="absolute top-1/2 left-12 -translate-y-1/2 z-10 pointer-events-none"
            style={{
              fontSize: `${Math.min(viewportRef.current.width * 0.12, 200)}px`,
              lineHeight: 0.85,
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: project.color.text,
              opacity: 0.3,
            }}
          >
            {project.title}
          </div>

          {/* Main gallery image */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              width: "55%",
              maxWidth: "900px",
            }}
          >
            <img
              src={project.gallery[galleryIndex]}
              alt={`${project.title} - ${galleryIndex + 1}`}
              className="w-full h-auto object-cover animate-slideUp"
              style={{
                animationDuration: "800ms",
                animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          {/* Thumbnail column */}
          <div
            className="absolute top-1/2 right-8 -translate-y-1/2 z-10 flex flex-col gap-2 hidden lg:flex"
          >
            {project.gallery.map((thumb, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className="relative w-10 h-10 overflow-hidden transition-opacity hover:opacity-100"
                style={{ opacity: i === galleryIndex ? 1 : 0.5 }}
              >
                <img
                  src={thumb}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {i === galleryIndex && (
                  <div
                    className="absolute inset-0 border transition-all duration-300"
                    style={{
                      borderColor: project.color.text,
                      opacity: 0.7,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Meta info */}
          <div
            className="absolute bottom-8 left-12 right-12 z-10 flex justify-between items-end text-xs tracking-wide uppercase animate-fadeIn"
            style={{
              color: textColor,
              opacity: 0.7,
              animationDelay: "500ms",
              animationFillMode: "forwards",
            }}
          >
            <div className="flex gap-8">
              <div>
                <span style={{ opacity: 0.5 }}>Completed</span>
                <span className="mx-2">/</span>
                {project.meta.completed}
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>Type</span>
                <span className="mx-2">/</span>
                {project.meta.type}
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>Role</span>
                <span className="mx-2">/</span>
                {project.meta.role}
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>Client</span>
                <span className="mx-2">/</span>
                {project.meta.client}
              </div>
            </div>
            <div className="max-w-md text-right normal-case">
              {project.description}
            </div>
          </div>
        </>
      )}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation-name: fadeIn;
        }

        .animate-slideUp {
          animation-name: slideUp;
        }
      `}</style>
    </div>
  );
}
