'use client';

import { useEffect } from 'react';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import Offer from "@/components/Offer";
import Radar from "@/components/Radar";
import Footer from "@/components/Footer";
import { BugReportButton } from "@/components/BugReportButton";
import ReferralBanner from "@/components/ReferralBanner";

export default function Home() {
  useEffect(() => {
    // Sistema de Revelação Suave (Scroll Reveal)
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Seleciona todos os elementos com data-reveal para animar
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // Efeito Parallax sutil na imagem de fundo do Hero
    const handleScroll = () => {
      const scroll = window.pageYOffset;
      const bg = document.querySelector('.bg-img-blur') as HTMLElement;
      if (bg) {
        bg.style.transform = `translateY(${scroll * 0.15}px) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main>
      <Hero />
      <Features data-reveal="bottom" />
      <Showcase data-reveal="left" />
      <Testimonials data-reveal="right" />
      <Offer data-reveal="top" />
      <ReferralBanner />
      <Radar data-reveal="bottom" />
      <Footer />
      <BugReportButton />
    </main>
  );
}