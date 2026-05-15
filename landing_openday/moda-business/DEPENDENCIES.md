# Analisi Dipendenze del Progetto

## Panoramica

Questo progetto include un template UI completo (`src/app/components/ui/`) con molte dipendenze, ma la landing page utilizza solo un sottoinsieme limitato di queste librerie.

## Dipendenze Effettivamente Utilizzate nella Landing

### Core
- `react` + `react-dom` - Framework principale
- `vite` - Build tool
- `tailwindcss` + `@tailwindcss/vite` - Styling

### UI Components (Landing)
- `@radix-ui/react-*` - Solo alcuni componenti Radix sono potenzialmente utilizzati
- `lucide-react` - Icone
- `embla-carousel-react` - Carosello progetti
- `tw-animate-css` - Animazioni CSS
- `motion` - Animazioni (se utilizzato)

### Utility
- `class-variance-authority` - Gestione varianti CSS
- `clsx` + `tailwind-merge` - Utility per classi CSS

## Dipendenze del Template UI (Non Utilizzate nella Landing)

Le seguenti dipendenze sono presenti solo nei componenti `ui/` generici del template, ma **NON sono importate** nei componenti effettivi della landing (`HeroSection`, `CarouselBlock`, ecc.):

### Da Rimuovere (Se Non Necessarie per Espansioni Future)

```json
{
  "@emotion/react": "MUI - non usato",
  "@emotion/styled": "MUI - non usato",
  "@mui/icons-material": "MUI - non usato",
  "@mui/material": "MUI - non usato",
  "react-router": "Routing - non usato (SPA singola)",
  "react-dnd": "Drag & Drop - non usato",
  "react-dnd-html5-backend": "Drag & Drop - non usato",
  "react-slick": "Slider - non usato",
  "date-fns": "Date utility - non usato",
  "react-day-picker": "Solo in ui/calendar.tsx - non importato",
  "react-hook-form": "Solo in ui/form.tsx - non importato",
  "recharts": "Solo in ui/chart.tsx - non importato",
  "cmdk": "Solo in ui/command.tsx - non importato",
  "sonner": "Solo in ui/sonner.tsx - non importato",
  "vaul": "Solo in ui/drawer.tsx - non importato",
  "input-otp": "Solo in ui/input-otp.tsx - non importato",
  "next-themes": "Theme switcher - non usato (solo in ui/sonner)",
  "react-resizable-panels": "Pannelli resizable - non usato",
  "react-responsive-masonry": "Masonry layout - non usato",
  "@popperjs/core": "Tooltip positioning - potrebbe essere dipendenza transitiva",
  "react-popper": "Tooltip positioning - non usato direttamente"
}
```

## Raccomandazioni

### Opzione 1: Mantenere il Template (Consigliato per Flessibilità Futura)
Se prevedete di espandere la landing o riutilizzare componenti del template in futuro, mantenete le dipendenze così come sono. Il costo in termini di `node_modules` è accettabile per la flessibilità che offre.

### Opzione 2: Pulizia Completa (Solo per Ottimizzazione Massima)
Se volete minimizzare le dipendenze e siete certi che la landing non verrà estesa con i componenti UI del template:

1. Rimuovere tutti i pacchetti elencati sopra dal `package.json`
2. Eliminare la cartella `src/app/components/ui/` (tranne eventuali componenti effettivamente usati)
3. Eseguire `npm install` per aggiornare `node_modules`

**Attenzione**: Questa opzione riduce la flessibilità e richiede reinstallazione se in futuro vorrete usare i componenti UI.

## Dimensione Attuale

- `node_modules`: ~XXX MB (da verificare)
- Dipendenze totali nel `package.json`: 54
- Dipendenze effettivamente usate nella landing: ~10-15

## Test Post-Pulizia

Se decidete di procedere con l'Opzione 2, testate:
```bash
npm run dev
npm run build
```

E verificate che la landing funzioni correttamente.
