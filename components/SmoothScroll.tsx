"use client";

import { LenisProvider } from "@/lib/lenis-context";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
