'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroller() {
 const lenisRef = useRef<Lenis | null>(null);

 useEffect(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const lenis = new Lenis({
   duration: 1.2,
   smoothWheel: true,
   wheelMultiplier: 1,
   touchMultiplier: 1.5,
  });

  lenisRef.current = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
   lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return () => {
   lenis.destroy();
   gsap.ticker.remove(lenis.raf);
   ScrollTrigger.getAll().forEach((t) => t.kill());
  };
 }, []);

 return null;
}