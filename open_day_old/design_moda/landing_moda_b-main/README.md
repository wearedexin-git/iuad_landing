# Art&Copy — Hero Landing Page

Landing page per il biennio **Art Direction & Copywriting** di IUAD, costruita con React + Vite + Tailwind CSS.

## Stack

- **React 18** + **TypeScript**
- **Vite 6** — dev server e bundler
- **Tailwind CSS v4** — utility-first styling
- **Motion (Framer Motion v12)** — animazioni scroll-based

## Struttura

```
src/
├── app/
│   ├── App.tsx                   # Root: composizione di tutti i blocchi
│   └── components/
│       ├── Header.tsx
│       ├── HeroSection.tsx
│       ├── TextBlock.tsx
│       ├── CoppiaCreativaBlock.tsx
│       ├── CourseBlock.tsx
│       ├── CarouselBlock.tsx
│       ├── PlusBlock.tsx         # Scroll-lock animation (3 fasi)
│       ├── TestimonialBlock.tsx  # Scroll-lock animation (titolo + card + CTA)
│       ├── FormBlock.tsx
│       └── CTAButton.tsx
├── styles/
│   ├── theme.css
│   └── fonts.css
└── imports/                      # Asset SVG generati da Figma
```

## Animazioni scroll-lock

`PlusBlock` e `TestimonialBlock` usano un meccanismo di **scroll-lock custom** (wheel + touch + RAF lerp) che:

1. Blocca lo scroll della pagina quando la sezione raggiunge il top del viewport
2. Accumula l'input dell'utente (wheel/touch) in un progress `p` da `0` a `1`
3. Interpola `p` verso il target con lerp (`LERP = 0.12`) tramite `requestAnimationFrame`
4. Sblocca lo scroll dopo una breve pausa quando `p = 1`

### TestimonialBlock — fasi

| Range `p` | Animazione |
|---|---|
| `0.00 → 0.35` | Titolo "Testimonial" sale dal basso con scala `0 → 1` |
| `0.35 → 0.65` | Gruppo card + bottone entra dal basso come blocco unico |
| `0.65 → 1.00` | Bottone "Parla con gli studenti" in fade-in |

## Avvio

```bash
npm install
npm run dev
```

Il dev server parte su `http://localhost:5173` (o porta successiva se occupata).

## Font

- **Tiempos Headline** — titoli
- **Sarabun** — corpo testo e UI
