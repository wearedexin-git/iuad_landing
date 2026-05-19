import { useRef, useState, useEffect } from "react";
import { CTAButton } from "./CTAButton";
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

/**
 * Normalizza deltaY in pixel indipendentemente dal dispositivo:
 * - deltaMode 0 (pixel): trackpad e mouse Chrome/Safari → usa il valore diretto
 * - deltaMode 1 (righe): mouse Firefox → moltiplica per px/riga
 * - deltaMode 2 (pagina): raro → moltiplica per altezza viewport
 */
function normalizeDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 30;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
  return e.deltaY;
}

// ─── Classi condivise ─────────────────────────────────────────────────────────

const TITLE_CLS =
  "font-tiempos text-[38px] md:text-[60px] lg:text-[80px] text-[#8D9EBD] leading-[1.05] text-center";

const BODY_CLS =
  "font-sarabun font-light text-[22px] md:text-[30px] lg:text-[38px] text-[#201f1f] leading-[1.5] max-w-[900px] text-center";

const PHASE_CLS =
  "absolute inset-0 flex items-center justify-center px-5 md:px-10";

// ─── Componente ───────────────────────────────────────────────────────────────

export function PlusBlock({ onBookClick }: { onBookClick: () => void }) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const targetRef    = useRef(0);
  const displayRef   = useRef(0);
  const lockedRef    = useRef(false);
  const pausedRef    = useRef(false);
  const pauseTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef       = useRef(0);
  const [p, setP]    = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Se l'utente preferisce animazioni ridotte, mostra direttamente la fase finale
    if (prefersReducedMotion) {
      setP(1);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    // Quanti px di delta wheel/touch normalizzato coprono il range 0→1
    const TOTAL_DELTA = 3000;
    // Velocità del lerp: 0.10 = morbido, 0.20 = reattivo
    const LERP = 0.12;
    // Pausa in ms dopo che l'animazione raggiunge p=1 (fase 3 visibile)
    const PAUSE_MS = 1000;

    /**
     * True solo quando il top della sezione ha raggiunto (o superato di poco)
     * il top del viewport. Evita il lock prematuro quando la sezione è ancora
     * parzialmente visibile in basso, che causava il saltello dello scroll.
     */
    const isAtViewportTop = () => {
      const rectTop = el.getBoundingClientRect().top;
      // ≤ 1  → sezione arrivata al top (piccola tolleranza per mouse veloci)
      // ≥ -el.offsetHeight → sezione non è già scomparsa sopra il viewport
      return rectTop <= 1 && rectTop >= -el.offsetHeight;
    };

    /**
     * Blocca lo scroll della pagina.
     * isAtViewportTop() garantisce che la sezione sia già al top (rect.top ≤ 1px)
     * quando scatta, quindi il scrollTo corregge al massimo 1px — impercettibile.
     */
    const lock = () => {
      lockedRef.current = true;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, sectionTop);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    /** Rilascia lo scroll della pagina */
    const unlock = () => {
      lockedRef.current = false;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    /**
     * Loop RAF: anima displayRef verso targetRef con lerp.
     * Questo è ciò che rende il mouse fluido: il target salta,
     * il display segue gradualmente ogni frame.
     */
    const animate = () => {
      const target  = targetRef.current;
      const current = displayRef.current;
      const diff    = target - current;

      if (Math.abs(diff) < 0.0005) {
        displayRef.current = target;
        setP(target);
        return; // convergenza raggiunta, non riprogrammare
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

    // ── Wheel ────────────────────────────────────────────────────────────────

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) {
        if (!isAtViewportTop()) return;

        // Entrata dall'alto (scroll giù): p deve essere < 1
        if (e.deltaY > 0 && targetRef.current < 1) { lock(); }
        // Entrata dal basso (scroll su): p deve essere > 0
        else if (e.deltaY < 0 && targetRef.current > 0) { lock(); }
        else { return; }
      }

      const cur = targetRef.current;

      // Bordo inferiore: rilascia verso la sezione precedente
      if (cur <= 0 && e.deltaY < 0) { unlock(); return; }

      // Bordo superiore: se siamo in pausa, blocca lo scroll e aspetta
      if (cur >= 1 && e.deltaY > 0) {
        if (pausedRef.current) { e.preventDefault(); return; }
        unlock();
        return;
      }

      e.preventDefault();

      const delta = normalizeDelta(e);
      const prev  = targetRef.current;
      targetRef.current = clamp(prev + delta / TOTAL_DELTA, 0, 1);

      // Prima volta che il target raggiunge 1: avvia la pausa
      if (prev < 1 && targetRef.current >= 1 && !pausedRef.current) {
        pausedRef.current = true;
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
        pauseTimer.current = setTimeout(() => {
          pausedRef.current = false;
        }, PAUSE_MS);
      }

      startAnimate();
    };

    // ── Touch ────────────────────────────────────────────────────────────────

    let touchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const delta = touchY - e.touches[0].clientY;

      if (!lockedRef.current) {
        if (!isAtViewportTop()) return;

        if (delta > 0 && targetRef.current < 1) { lock(); }
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
        pauseTimer.current = setTimeout(() => {
          pausedRef.current = false;
        }, PAUSE_MS);
      }

      startAnimate();
      touchY = e.touches[0].clientY;
    };

    window.addEventListener("wheel",       onWheel,       { passive: false });
    window.addEventListener("touchstart",  onTouchStart,  { passive: true  });
    window.addEventListener("touchmove",   onTouchMove,   { passive: false });

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      unlock();
    };
  }, [prefersReducedMotion]);

  // ─── Calcolo animazioni ───────────────────────────────────────────────────

  // Fase 1: entra 0.00→0.10 | split-esce 0.30→0.50
  const p1EnterT      = smooth(rangeProg(p, 0.00, 0.10));
  const p1ExitT       = smooth(rangeProg(p, 0.30, 0.50));
  const p1Scale       = 0.1 + 0.9 * p1EnterT;
  const p1Opacity     = p1EnterT;
  const p1Line1X      = -100 * p1ExitT;   // riga 1 → sinistra
  const p1Line2X      =  100 * p1ExitT;   // riga 2 → destra
  const p1LineOpacity = 1 - p1ExitT;

  // Fase 2: entra 0.30→0.50 | esce 0.65→0.85
  const p2EnterT      = smooth(rangeProg(p, 0.30, 0.50));
  const p2ExitT       = smooth(rangeProg(p, 0.65, 0.85));
  const p2Scale       = 0.1 + 0.9 * p2EnterT;
  const p2Opacity     = p2EnterT;
  const p2TitleX      = -100 * p2ExitT;   // titolo → sinistra
  const p2BodyX       =  100 * p2ExitT;   // testo  → destra
  const p2ExitOpacity = 1 - p2ExitT;

  // Fase 3: entra 0.65→0.85
  const p3EnterT = smooth(rangeProg(p, 0.65, 0.85));
  const p3Scale  = 0.1 + 0.9 * p3EnterT;
  const p3Opacity = p3EnterT;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* ── Fase 1: solo titolo ─────────────────────────────────────────── */}
      <div
        className={PHASE_CLS}
        style={{ opacity: p1Opacity, transform: `scale(${p1Scale})`, zIndex: 1 }}
      >
        <h2 className={TITLE_CLS}>
          <span
            className="block"
            style={{ transform: `translateX(${p1Line1X}vw)`, opacity: p1LineOpacity }}
          >
            Perché diventare <span className="lg:hidden">un</span>
          </span>
          <span
            className="block"
            style={{ transform: `translateX(${p1Line2X}vw)`, opacity: p1LineOpacity }}
          >
            <span className="hidden lg:inline">un </span>Creativo IUAD
          </span>
        </h2>
      </div>

      {/* ── Fase 2: titolo + testo ──────────────────────────────────────── */}
      <div
        className={PHASE_CLS}
        style={{ opacity: p2Opacity, transform: `scale(${p2Scale})`, zIndex: 2 }}
      >
        <div className="flex flex-col items-center gap-2 md:gap-4 max-w-[945px] w-full">
          <h2
            className={TITLE_CLS}
            style={{ transform: `translateX(${p2TitleX}vw)`, opacity: p2ExitOpacity }}
          >
            Meno teoria,
            <br />
            più pratica
          </h2>
          <p
            className={BODY_CLS}
            style={{ transform: `translateX(${p2BodyX}vw)`, opacity: p2ExitOpacity }}
          >
            Partiamo dalle basi teoriche per portarti subito in laboratorio:{" "}
            <span className="font-bold">qui imparerai sperimentando</span>,{" "}
            <span className="font-bold">affrontando</span>{" "}
            <span className="font-bold">sfide</span> concrete e{" "}
            <span className="font-bold">progetti</span>{" "}
            <span className="font-bold">reali</span>.
          </p>
        </div>
      </div>

      {/* ── Fase 3: titolo + testo + CTA ────────────────────────────────── */}
      <div
        className={PHASE_CLS}
        style={{ opacity: p3Opacity, transform: `scale(${p3Scale})`, zIndex: 3 }}
      >
        <div className="flex flex-col items-center gap-2 md:gap-4 max-w-[945px] w-full">
          <h2 className={TITLE_CLS}>
            Guidato da chi
            <br />
            lavora nel settore
          </h2>
          <p className={BODY_CLS}>
            In aula non portiamo solo programmi di studio, ma l'esperienza viva
            di{" "}
            <span className="font-bold">professionisti</span> che{" "}
            <span className="font-bold">operano</span>{" "}
            <span className="font-bold">ogni giorno </span>
            ai vertici del <span className="font-bold">settore</span>.
          </p>
          <CTAButton onClick={onBookClick} />
        </div>
      </div>
    </div>
  );
}
