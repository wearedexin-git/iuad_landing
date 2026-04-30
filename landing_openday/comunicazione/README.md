# Landing Page - Design della Comunicazione | IUAD Milano

Landing page per l'Open Day del Corso Triennale in Design della Comunicazione presso IUAD Milano.

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+ 
- npm o pnpm
- PHP 8.0+ (per il backend form)

### Installazione

```bash
# Clona il repository
git clone [repository-url]
cd landing_openday/comunicazione

# Installa dipendenze
npm install

# Copia e configura .env
cp .env.example .env
# Modifica .env con i tuoi token API

# Avvia dev server
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`

## 📦 Comandi Disponibili

```bash
# Sviluppo
npm run dev          # Avvia dev server con hot reload

# Build
npm run build        # Build production ottimizzata

# Preview
npm run preview      # Preview della build production locale

# Analisi
npm run build -- --mode analyze  # Analizza bundle size
```

## 🏗️ Struttura Progetto

```
comunicazione/
├── src/
│   ├── app/
│   │   ├── components/         # Componenti React
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LazyImage.tsx
│   │   │   ├── SkeletonLoaders.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CourseBlock.tsx
│   │   │   └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── usePrefersReducedMotion.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── validation.ts
│   │   │   └── preload.ts
│   │   └── App.tsx             # Root component
│   ├── assets/                 # Immagini, video, fonts
│   ├── styles/                 # CSS e Tailwind
│   └── main.tsx                # Entry point
├── public/
│   ├── submit.php              # Backend form handler
│   └── grazie.html             # Thank you page
├── index.html
├── vite.config.ts
├── package.json
├── .env.example
├── OTTIMIZZAZIONI.md           # Documentazione ottimizzazioni
└── RIEPILOGO_OTTIMIZZAZIONI.md # Riepilogo implementazioni
```

## 🎨 Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI, Material-UI
- **Animations**: Motion (Framer Motion fork)
- **Language**: TypeScript
- **Backend**: PHP 8.0+

## 📋 Configurazione

### Variabili d'Ambiente (.env)

```env
# API Environment
API_ENVIRONMENT=production          # o staging
API_TOKEN_STAGING=your_token_here
API_TOKEN_PRODUCTION=your_token_here

# Email Configuration
EMAIL_FROM=contact@accademiamoda.it
EMAIL_FROM_NAME=Accademia IUAD
EMAIL_TO_ACADEMY=ufficioculturale@accademiamoda.it
```

### Backend PHP Setup

Il form richiede un server PHP per funzionare. In locale puoi usare:

```bash
# MAMP/XAMPP
# Configura il proxy in vite.config.ts sulla porta del tuo server

# Oppure PHP built-in server
cd public
php -S localhost:8888
```

Il file `submit.php` gestisce:
- Validazione dati
- Chiamata API Eduarth CRM
- Invio email conferma (utente + accademia)
- Redirect a pagina grazie

## ✨ Features Implementate

### Performance
- ⚡ Lazy loading immagini con IntersectionObserver
- 📦 Code splitting intelligente (React, UI vendors separati)
- 🗜️ Minification con Terser (console.log rimossi in prod)
- 🚀 Preload pagina grazie on form interaction
- 💾 Cache busting con hash nei filename

### Accessibilità
- ♿ Prefers-reduced-motion support
- 🎯 ARIA labels corretti
- ⌨️ Keyboard navigation
- 📱 Mobile-first responsive

### UX
- 🛡️ Error Boundary per crash handling
- 💀 Skeleton screens (video, immagini, cards)
- ✅ Validazione form avanzata
- 📊 Analytics tracking (Meta Pixel, GTM, Google Ads)
- 🎬 Video player custom con mute toggle

### SEO
- 🔍 Meta tags completi (description, keywords, robots)
- 📱 Open Graph per Facebook
- 🐦 Twitter Cards
- 🔗 Canonical URL
- 🌍 Lang attribute (it)

### Security
- 🔒 Input sanitization (XSS protection)
- 📧 Email validation (RFC-compliant)
- 📞 Phone validation (formati italiani)
- 🚫 CORS configurato
- 🔐 Environment variables per token API

## 🧪 Testing

### Lighthouse Audit
```bash
npx lighthouse http://localhost:5173 --view
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

### Cross-Browser Testing
- Chrome/Edge ✅
- Firefox ✅
- Safari 14+ ✅
- iOS Safari ✅
- Mobile Chrome ✅

### Form Testing
1. Test validazione campi (email invalida, telefono invalido)
2. Test submit con dati corretti
3. Test error handling (server down)
4. Test preload pagina grazie
5. Test tracking analytics

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 768px

/* Tablet */
768px - 1023px

/* Desktop */
≥ 1024px
```

Alcune animazioni (PlusBlock, TestimonialBlock) sono attive solo su desktop.

## 🎯 Performance Metrics

### Target Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size Target
- Main bundle: ~300KB gzipped
- Vendor bundles: ~200KB gzipped
- Total: ~500KB gzipped

## 🚢 Deploy

### Build Production
```bash
npm run build
```

La build verrà generata in `/dist`.

### Hosting Requirements
- Static hosting (Netlify, Vercel, AWS S3, ecc.)
- PHP server per submit.php (se non usi serverless)
- HTTPS obbligatorio per API calls

### Checklist Pre-Deploy
- [ ] File `.env` configurato correttamente
- [ ] Build production senza errori
- [ ] Test form submission su staging
- [ ] Verificato tracking analytics
- [ ] Meta tags Open Graph testati
- [ ] Lighthouse audit passato
- [ ] Cross-browser testing completato
- [ ] Asset compressi (immagini WebP, video ottimizzato)

## 🐛 Troubleshooting

### Form non funziona
- Verifica che il server PHP sia avviato
- Controlla il proxy in `vite.config.ts`
- Verifica i token API in `.env`
- Controlla console browser per errori

### Immagini non caricano
- Verifica path in import
- Controlla che gli asset siano in `src/assets/`
- Build e riavvia dev server

### Video non parte
- Verifica path video in `CourseBlock.tsx`
- Su iOS, autoplay funziona solo se muted
- Controlla formato video (MP4 H.264)

### Build fallisce
- Verifica versione Node.js (18+)
- Cancella `node_modules` e reinstalla
- Verifica TypeScript errors
- Controlla import paths

## 📚 Documentazione

- [OTTIMIZZAZIONI.md](./OTTIMIZZAZIONI.md) - Dettagli tutte le ottimizzazioni
- [RIEPILOGO_OTTIMIZZAZIONI.md](./RIEPILOGO_OTTIMIZZAZIONI.md) - Summary ottimizzazioni
- [.env.example](./.env.example) - Template variabili ambiente

## 🤝 Contributing

1. Crea un branch feature (`git checkout -b feature/nome-feature`)
2. Commit changes (`git commit -m 'Add: descrizione'`)
3. Push al branch (`git push origin feature/nome-feature`)
4. Apri Pull Request

## 📄 License

© 2026 IUAD Accademia di Moda e Design. Tutti i diritti riservati.

## 📧 Contatti

- **Email**: info@accademiamoda.it
- **Telefono**: +39 081 554 0383
- **Sede**: Via Balduccio da Pisa 16, Milano

---

**Ultima modifica**: 30 Aprile 2026  
**Versione**: 1.0.0
