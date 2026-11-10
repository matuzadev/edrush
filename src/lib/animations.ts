import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ANIMATION_PRESETS = {
 fadeInUp: {
   y: 30,
   opacity: 0,
   duration: 0.8,
   ease: 'power3.out',
 },
 fadeIn: {
   opacity: 0,
   duration: 0.6,
   ease: 'power2.out',
 },
 scaleIn: {
   scale: 0.95,
   opacity: 0,
   duration: 0.5,
   ease: 'back.out(1.7)',
 },
 slideInRight: {
   x: 40,
   opacity: 0,
   duration: 0.7,
   ease: 'power3.out',
 },
 staggerContainer: {
   stagger: 0.1,
 },
};

export function createScrollReveal(element: HTMLElement, options?: gsap.TweenVars) {
 return gsap.from(element, {
   ...ANIMATION_PRESETS.fadeInUp,
   scrollTrigger: {
     trigger: element,
     start: 'top 85%',
     toggleActions: 'play none none reverse',
   },
   ...options,
 });
}

export function createStaggerReveal(container: HTMLElement, children: string, options?: gsap.TweenVars) {
 return gsap.from(children, {
   ...ANIMATION_PRESETS.fadeInUp,
   ...ANIMATION_PRESETS.staggerContainer,
   scrollTrigger: {
     trigger: container,
     start: 'top 80%',
     toggleActions: 'play none none reverse',
   },
   ...options,
 });
}