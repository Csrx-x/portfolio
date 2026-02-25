"use client";
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper-Funktion für die Maskierung der Zeilen
function splitTextIntoLines(element: HTMLElement) {
  const text = element.innerText;
  const words = text.split(" ");
  let currentLine = "";
  const lines: string[] = [];

  element.innerText = ''; 

  words.forEach(word => {
    const testSpan = document.createElement('span');
    testSpan.style.whiteSpace = 'nowrap';
    testSpan.style.visibility = 'hidden';
    testSpan.innerText = currentLine + (currentLine ? ' ' : '') + word;
    element.appendChild(testSpan);

    if (testSpan.offsetWidth > element.offsetWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
    element.removeChild(testSpan);
  });
  lines.push(currentLine);

  // Maskierung: Jede Zeile bekommt einen Wrapper mit 'overflow-hidden'
  return lines.map(line => `
    <span class="block overflow-hidden py-1">
      <span class="animated-line block">
        ${line}
      </span>
    </span>
  `).join('');
}

export default function Portfolio() {
  const container = useRef(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    if (heroHeadlineRef.current) {
      // Text aufteilen
      heroHeadlineRef.current.innerHTML = splitTextIntoLines(heroHeadlineRef.current);

      // Animation: Reveal-Effekt ohne Fade
      tl.from(".animated-line", {
        yPercent: 105, // Startet komplett unterhalb der Maske
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, "-=0.7")
      .from(".hero-buttons > *", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1
      }, "-=0.5");
    }

    // Scroll-Animation für Bento-Karten
    gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[#0F1115] text-[#F8FAFC] font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Background Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-50"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 text-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center bg-[#1A1D23]/60 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-2xl">
          <a href="#" className="text-xl font-extrabold tracking-tighter uppercase">
            LEON<span className="text-[#8B5CF6]">.</span>
          </a>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#work" className="hover:text-[#8B5CF6] transition-colors py-2">Work</a>
            <a href="#about" className="hover:text-[#8B5CF6] transition-colors py-2">About</a>
            <a href="#contact" className="ml-4 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-xl hover:bg-[#7c4dff] transition-all">
              Let's Talk
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl text-center hero-content">
          <h1 ref={heroHeadlineRef} className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tight">
            Digitale Erlebnisse <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">
              neu gedacht.
            </span>
          </h1>
          <p className="hero-subtitle text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Ich bin Leon Jakob — Webentwickler & Designer. Ich kombiniere sauberen Code mit herausragendem Design für moderne Unternehmen.
          </p>
          <div className="hero-buttons flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#work" className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform">
              Projekte ansehen
            </a>
            <a href="#contact" className="px-8 py-4 bg-[#1A1D23]/60 backdrop-blur-md border border-white/10 font-bold rounded-2xl hover:bg-white/5 transition-all">
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="work" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold mb-12">Ausgewählte Projekte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card md:col-span-2 group relative overflow-hidden rounded-3xl bg-[#1A1D23] border border-white/5 h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent opacity-80 z-10" />
            <div className="absolute bottom-8 left-8 z-20">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#22D3EE] mb-2 block">Fullstack App</span>
              <h3 className="text-3xl font-bold">Crypto Dashboard</h3>
            </div>
            <div className="w-full h-full bg-slate-800/50 group-hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="bento-card group relative overflow-hidden rounded-3xl bg-[#1A1D23] border border-white/5 h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent opacity-80 z-10" />
            <div className="absolute bottom-8 left-8 z-20">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5CF6] mb-2 block">UI/UX Design</span>
              <h3 className="text-2xl font-bold">Nexus UI Kit</h3>
            </div>
            <div className="w-full h-full bg-slate-700/50 group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="max-w-6xl mx-auto px-6 py-32 border-t border-white/5 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Bereit für das nächste Level?</h2>
        <a href="mailto:hallo@leonjakob.de" className="text-2xl md:text-6xl font-black text-[#F8FAFC] hover:text-[#8B5CF6] transition-all duration-500 underline underline-offset-[12px]">
          hallo@leonjakob.de
        </a>
      </footer>
    </div>
  );
}