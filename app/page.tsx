'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  { href: "https://jpmentoria.com.br/", img: "/mentoria.jpg", alt: "Mentoria" },
  { href: "https://likeapro.com.br/", img: "/consultoria.jpg", alt: "Consultoria" },
  { href: "https://store.likeapro.com.br/?fbclid=PAdGRleANdIENleHRuA2FlbQIxMQABp8pEngUBt31HytraCviTSgTS8H_i-4sETC7sapzeZnLzp81QFrALEMukjum7_aem_t-h2o4DH1QOFayTKa4C7lw", img: "/suplementos.jpg", alt: "Suplementos" },
];

// Para loop infinito, criamos um array estendido: [last, ...slides, first]
const EXTENDED = [SLIDES[SLIDES.length-1], ...SLIDES, SLIDES[0]];

export default function Page(){
  const [index, setIndex] = useState(1); // começa no primeiro "real"
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const goto = (i:number) => setIndex(i);
  const next = () => goto(index+1);
  const prev = () => goto(index-1);

  // Autoplay com pausa no hover/focus
  useEffect(() => {
    if(isPaused) return;
    autoplayRef.current && clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => { next(); }, 5000);
    return () => { if(autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [index, isPaused]);

  // Aplicar transform e lidar com fim/início para loop
  useEffect(() => {
    const track = trackRef.current;
    if(!track) return;
    const transition = isAnimating ? "transform .6s cubic-bezier(.22,.61,.36,1)" : "none";
    track.style.transition = transition;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, [index, isAnimating]);

  // Ao terminar a transição, se estamos em clone, pular sem animação
  const handleTransitionEnd = () => {
    if(index === EXTENDED.length-1){ // está no clone do primeiro
      setIsAnimating(false);
      setIndex(1);
      requestAnimationFrame(() => setIsAnimating(true));
    }
    if(index === 0){ // clone do último
      setIsAnimating(false);
      setIndex(EXTENDED.length-2);
      requestAnimationFrame(() => setIsAnimating(true));
    }
  };

  // Gestos touch
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if(touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if(dx > 40) prev();
    if(dx < -40) next();
    touchStartX.current = null;
  };

  // Teclado (setas) e foco para acessibilidade
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if(e.key === "ArrowRight") next();
      if(e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">JOÃO REICHERT</div>
        <nav className="actions">
          <Link className="btn" href="https://api.whatsapp.com/message/TH3M3QB7YLLOF1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer">
            <Image className="icon" src="/icon-whatsapp.svg" alt="" width={18} height={18} />
            Falar no WhatsApp
          </Link>
          <Link className="btn" href="https://www.instagram.com/joaoreichert/" target="_blank" rel="noopener noreferrer">
            <Image className="icon" src="/icon-instagram.svg" alt="" width={18} height={18} />
            Instagram
          </Link>
        </nav>
      </header>

      <main
        className="hero"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="carousel" aria-roledescription="carousel">
          <div
            ref={trackRef}
            className="slides"
            onTransitionEnd={handleTransitionEnd}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {EXTENDED.map((s, i) => (
              <div key={i} className="slide" aria-label={`${((i+SLIDES.length-1)%SLIDES.length)+1} de ${SLIDES.length}`}>
                <Link href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${s.alt}`}>
                  <Image src={s.img} alt={s.alt} fill sizes="100vw" priority={i===1} />
                </Link>
              </div>
            ))}
          </div>

          <div className="controls" aria-hidden="false">
            <button className="ctrl" aria-label="Anterior" onClick={prev}>
              <Image src="/icon-arrow.svg" alt="" width={18} height={18} style={{transform:"rotate(180deg)"}}/>
            </button>
            <button className="ctrl" aria-label="Próximo" onClick={next}>
              <Image src="/icon-arrow.svg" alt="" width={18} height={18}/>
            </button>
          </div>

          <div className="dots" role="tablist" aria-label="Navegação de slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className="dot"
                aria-current={((index-1+SLIDES.length)%SLIDES.length)===i}
                aria-label={`Ir para o slide ${i+1}`}
                onClick={() => goto(i+1)}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} João Reichert • Todos os direitos reservados</span>
        <span>Next.js • Poppins/Montserrat • Carrossel com loop + autoplay</span>
      </footer>
    </div>
  )
}