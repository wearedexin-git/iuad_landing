import { useRef, useState, useEffect } from "react";
import svgPaths from "../../imports/svg-ffe0txzxzn";
import { CTAButton } from "./CTAButton";
import { FashionIcon } from "./FashionIcon";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// ─── Utils ────────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function rangeProg(v: number, a: number, b: number) {
  return clamp((v - a) / (b - a), 0, 1);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function normalizeDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 30;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

const LG_BREAKPOINT = 1024;

// ─── Dati ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Martina",
    role: "Specialista",
    quote:
      "Dopo la laurea triennale volevo specializzarmi su strumenti concreti richiesti dalle aziende. Questo Master mi ha permesso di padroneggiare software come CLO3D in modo incredibilmente rapido. Ora lavoro nell'ufficio sviluppo prodotto di un brand di abbigliamento e applico ogni giorno il metodo appreso nei laboratori.",
  },
  {
    name: "Gabriele",
    role: "Studente",
    quote:
      "La forza di questo percorso è la totale assenza di teoria fine a se stessa. Lavoriamo direttamente sulla simulazione dei tessuti e sulla vestibilità degli avatar, correggendo i difetti del cartamodello in tempo reale sul manichino virtuale. I docenti sono professionisti che parlano la lingua del mercato e ti preparano agli standard reali.",
  },
  {
    name: "Francesca",
    role: "Modellista digitale freelance",
    quote:
      "Imparare a far dialogare la modellistica tradizionale su carta con la realtà virtuale in 3D ha completamente cambiato il mio modo di lavorare. IUAD ti dà le competenze per essere operativi subito: grazie al portfolio tecnico sviluppato durante i dodici mesi, ho iniziato a collaborare con diverse aziende subito dopo il diploma del Master.",
  },
];

// ─── Sub-componenti ───────────────────────────────────────────────────────────

function QuoteIcon() {
  return (
    <div className="w-[50px] h-[35px] md:w-[69px] md:h-[48px] shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 69.28 48"
      >
        <path d={svgPaths.p1bfd52c0} fill="#8D9EBD" />
      </svg>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white flex flex-col gap-4 p-8 md:p-10 rounded-3xl border-2 border-[#8D9EBD] w-full h-full">
      <QuoteIcon />
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FashionIcon className="w-[42px] h-[42px] shrink-0" />
          <span className="font-sarabun font-bold text-[#201f1f] text-lg md:text-[22px] leading-[1.4]">
            {testimonial.name}, {testimonial.role}
          </span>
        </div>
        <p className="font-sarabun font-light italic text-[#201f1f] text-[14px] md:text-[17px] leading-[1.8]">
          {testimonial.quote}
        </p>
      </div>
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

export function TestimonialBlock({ onBookClick }: { onBookClick: () => void }) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= LG_BREAKPOINT
  );

  const sectionRef      = useRef<HTMLDivElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const targetRef       = useRef(0);
  const displayRef      = useRef(0);
  const lockedRef       = useRef(false);
  const pausedRef       = useRef(false);
  const pauseTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef          = useRef(0);
  const [p, setP]       = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Aggiorna isDesktop al resize
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= LG_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Animazione titolo mobile — IntersectionObserver
  useEffect(() => {
    if (isDesktop) return;
    const el = mobileSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Animazione — attiva solo su desktop (≥ 1024px)
  useEffect(() => {
    if (!isDesktop) {
      // Ripristina lo scroll se si era bloccato prima del resize
      document.documentElement.style.overflow = "";
      document.body.style.overflow             = "";
      lockedRef.current = false;
      return;
    }

    // Se l'utente preferisce animazioni ridotte, mostra direttamente lo stato finale
    if (prefersReducedMotion) {
      setP(1);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const TOTAL_DELTA = 3000;
    const LERP        = 0.12;
    const PAUSE_MS    = 800;

    const isAtViewportTop = () => {
      const rectTop = el.getBoundingClientRect().top;
      return rectTop <= 1 && rectTop >= -el.offsetHeight;
    };

    const lock = () => {
      lockedRef.current = true;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, sectionTop);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow             = "hidden";
    };

    const unlock = () => {
      lockedRef.current = false;
      document.documentElement.style.overflow = "";
      document.body.style.overflow             = "";
    };

    const animate = () => {
      const target  = targetRef.current;
      const current = displayRef.current;
      const diff    = target - current;
      if (Math.abs(diff) < 0.0005) {
        displayRef.current = target;
        setP(target);
        return;
      }
      const next = current + diff * LERP;
      displayRef.current = next;
      setP(next);
      rafRef.current = requestAnimationFrame(animate);
    };

    const startAnimate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    // ── Wheel ─────────────────────────────────────────────────────────────────

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) {
        if (!isAtViewportTop()) return;
        if      (e.deltaY > 0 && targetRef.current < 1) { lock(); }
        else if (e.deltaY < 0 && targetRef.current > 0) { lock(); }
        else { return; }
      }

      const cur = targetRef.current;

      if (cur <= 0 && e.deltaY < 0) { unlock(); return; }

      if (cur >= 1 && e.deltaY > 0) {
        if (pausedRef.current) { e.preventDefault(); return; }
        unlock();
        return;
      }

      e.preventDefault();

      const delta = normalizeDelta(e);
      const prev  = targetRef.current;
      targetRef.current = clamp(prev + delta / TOTAL_DELTA, 0, 1);

      if (prev < 1 && targetRef.current >= 1 && !pausedRef.current) {
        pausedRef.current = true;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        pauseTimer.current = setTimeout(() => { pausedRef.current = false; }, PAUSE_MS);
      }

      startAnimate();
    };

    // ── Touch ─────────────────────────────────────────────────────────────────

    let touchY = 0;

    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };

    const onTouchMove = (e: TouchEvent) => {
      const delta = touchY - e.touches[0].clientY;

      if (!lockedRef.current) {
        if (!isAtViewportTop()) return;
        if      (delta > 0 && targetRef.current < 1) { lock(); }
        else if (delta < 0 && targetRef.current > 0) { lock(); }
        else { return; }
      }

      const cur = targetRef.current;
      if (cur <= 0 && delta < 0) { unlock(); return; }
      if (cur >= 1 && delta > 0) {
        if (pausedRef.current) { e.preventDefault(); return; }
        unlock();
        return;
      }

      e.preventDefault();
      const prev = targetRef.current;
      targetRef.current = clamp(prev + delta / TOTAL_DELTA, 0, 1);

      if (prev < 1 && targetRef.current >= 1 && !pausedRef.current) {
        pausedRef.current = true;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        pauseTimer.current = setTimeout(() => { pausedRef.current = false; }, PAUSE_MS);
      }

      startAnimate();
      touchY = e.touches[0].clientY;
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      unlock();
    };
  }, [isDesktop, prefersReducedMotion]);

  // ─── Render mobile/tablet (< 1024px) ─────────────────────────────────────────

  if (!isDesktop) {
    return (
      <section
        id="testimonial"
        ref={mobileSectionRef as React.RefObject<HTMLElement>}
        className="relative bg-[#D6E2F0] py-16 overflow-hidden"
      >
        {/* Titolo animato */}
        <div className="px-5 mb-8 overflow-hidden">
          <h2
            className="font-tiempos font-bold text-[clamp(48px,12vw,80px)] text-[#201f1f] leading-none text-center w-full"
            style={{
              opacity:    titleVisible ? 1 : 0,
              transform:  titleVisible
                ? "translateY(0) scale(1)"
                : "translateY(60px) scale(0.4)",
              transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease-out",
            }}
          >
            Testimonial
          </h2>
        </div>

        {/* Cards */}
        <div className="relative px-5 flex flex-col gap-4">
          {testimonials.map((t, i) => (
            <div key={i}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>

        {/* Bottone */}
        <div className="relative flex justify-center mt-10">
          <CTAButton text="Parla con gli studenti" onClick={onBookClick} />
        </div>
      </section>
    );
  }

  // ─── Calcolo animazioni desktop ───────────────────────────────────────────────
  //
  //  0.00 → 0.35  Titolo: sale dal basso con scala 0→1
  //  0.35 → 0.65  Gruppo card+bottone: sale dal basso come blocco unico
  //  0.65 → 1.00  Bottone: fade-in

  const titleT     = smooth(rangeProg(p, 0.00, 0.35));
  const titleDone  = p >= 0.35;
  const titleY     = window.innerHeight * 0.6 * (1 - titleT);
  const titleScale = titleT;

  const groupT = smooth(rangeProg(p, 0.35, 0.65));
  const groupY = window.innerHeight * 1.5 * (1 - groupT);

  const btnT       = smooth(rangeProg(p, 0.65, 1.00));
  const btnOpacity = btnT;

  // ─── Render desktop ──────────────────────────────────────────────────────────

  return (
    <div
      id="testimonial"
      ref={sectionRef}
      className="relative bg-[#D6E2F0] overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Titolo animato */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 1 }}
      >
        <h2
          className="font-tiempos font-bold text-[clamp(80px,11vw,160px)] text-[#201f1f] whitespace-nowrap leading-none"
          style={
            titleDone
              ? { opacity: 1 }
              : { transform: `translateY(${titleY}px) scale(${titleScale})` }
          }
        >
          Testimonial
        </h2>
      </div>

      {/* Card + bottone — gruppo animato come blocco unico */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <div
          className="absolute left-0 right-0 px-10"
          style={{ top: "50%", transform: `translateY(calc(-50% + ${groupY}px))` }}
        >
          <div className="flex flex-col gap-10 py-6">
            <div className="flex flex-row gap-5">
              {testimonials.map((t, i) => (
                <div key={i} className="flex-1 min-w-0">
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>

            <div className="flex justify-center" style={{ opacity: btnOpacity }}>
              <CTAButton text="Parla con gli studenti" onClick={onBookClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
