# Landing Page - Regia per il Cinema e la Pubblicità | IUAD

Landing page per l'Open Day del Corso Triennale in Regia per il Cinema e la Pubblicità presso IUAD. **Sedi e date** (Milano, Napoli, una o entrambe) sono definite in `src/app/config/openday-config.json` e si riflettono su hero, form, email, redirect verso la pagina di ringraziamento e footer.

> **Importante:** comandi `npm` e file di progetto si trovano nella cartella `landing_openday/comunicazione` (non nella root generica del monorepo, se presente).

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
│   │   ├── config/             # Config condivisa (sedi, date, footer)
│   │   │   └── openday-config.json
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

### Config sedi e date Open Day

Il file `src/app/config/openday-config.json` è la sorgente unica per:
- sedi disponibili in landing (Milano/Napoli o una sola sede);
- indirizzi mostrati in hero e nelle email;
- date/orari selezionabili nel form;
- valori inviati all'API (`location` e `open_day_date`).

Regole di compilazione:
- `campuses[].apiValue`: deve essere esattamente `Milano` o `Napoli` (valori accettati da Eduarth).
- `campuses[].address`: testo libero dell'indirizzo sede (puoi usare placeholder finché non è definitivo).
- `campuses[].sessions[].apiDateTime`: formato `YYYY-MM-DD HH:mm` (es. `2026-05-16 11:00`).
- Se una sede ha una sola sessione, dopo la scelta della sede il campo **Data** viene valorizzato automaticamente con quell’unica data (l’utente vede comunque il placeholder «Seleziona Giorno» finché non ha scelto la sede).
- Se una sede non deve comparire, **rimuovi l’intero oggetto** da `campuses` oppure imposta `"sessions": []` su quella sede: viene esclusa da hero e dal form.
- **Una sola sede attiva:** lascia un solo oggetto in `campuses` (oppure due dove uno ha `sessions: []`) e assicurati che la sede visibile abbia **almeno una** voce in `sessions`. Se **tutte** le sedi hanno `sessions` vuoto o manca del tutto la chiave `sessions` su un oggetto, la landing non ha date selezionabili e mostra un messaggio di configurazione nell’hero (il form non avrà sedi nel menu a tendina).
- Non eliminare la chiave `sessions`: usa sempre `"sessions": []` o un array con le date; in caso contrario il JSON può risultare non valido o causare errori in pagina.
- `footer.contacts`: righe del footer (titolo sede, telefono, email); ordine e testi sono quelli mostrati in pagina, separati da `; `.

Esempio strutturale (nel repo sono presenti anche `requestDescription`, `course`, `origin` e `footer`):
```json
{
  "requestDescription": "Richiesta da Landing",
  "course": ["corso triennale di i livello in regia per il cinema e la pubblicità"],
  "origin": ["website", "landing", "openday"],
  "campuses": [
    {
      "id": "milano",
      "label": "Milano",
      "apiValue": "Milano",
      "address": "Via Balduccio da Pisa 16, Milano",
      "sessions": [{ "id": "milano-1", "apiDateTime": "2026-05-16 11:00" }]
    }
  ],
  "footer": {
    "contacts": [
      { "title": "Accademia IUAD Napoli", "phone": "+39 …", "email": "info@accademiamoda.it" },
      { "title": "Accademia IUAD Milano", "phone": "+39 …", "email": "info@accademiamoda.it" }
    ]
  }
}
```

Dopo ogni aggiornamento delle date/sedi o del footer:
```bash
npm run build
```

### Form (Hero): campi e comportamento

- **Una sola sede** in `campuses` (con almeno una data): **nessun** campo Sede né Data se c’è **una sola** sessione (sede e data sono implicite e inviate al backend). Se quella sede ha **più** sessioni, compare **solo** il campo Data (larga tutta la card).
- **Due o più sedi**: select **Sede** e **Data** come prima (stessa riga da `md`, colonna su mobile).
- **Sede** (solo multi-sede): prima opzione «Seleziona la sede» (nessun valore preimpostato).
- **Data**: label «Data *», prima opzione «Seleziona Giorno» dove il select è visibile.
- **Come ci hai conosciuto**, privacy e campi anagrafici: invariati rispetto alla versione precedente.
- Il frontend invia a `submit.php` un JSON che include, oltre ai dati personali, almeno:
  - `location`: valore `apiValue` della sede (`Milano` o `Napoli`, come da Eduarth);
  - `open_day_date`: stringa `YYYY-MM-DD HH:mm` scelta tra le sessioni configurate per quella sede.

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

Il form richiede un server PHP per funzionare. Con **`npm run dev`**, Vite inoltra `/submit.php` verso **`http://localhost:8888`** (vedi `vite.config.ts`). Servono **due terminali**:

**Terminale 1 — PHP (obbligatorio prima di testare il submit):**
```bash
cd landing_openday/comunicazione/public
php -S localhost:8888
```

**Terminale 2 — Vite:**
```bash
cd landing_openday/comunicazione
npm run dev
```

Se PHP non è in ascolto, in console Vite compare `http proxy error: /submit.php` e `ECONNREFUSED`, e in pagina un errore sul submit. Avvia sempre il server PHP sulla stessa porta configurata nel proxy.

In alternativa: MAMP/XAMPP sulla porta scelta, aggiornando `vite.config.ts` → `server.proxy['/submit.php'].target`.

Il file `public/submit.php` gestisce:
- Lettura della stessa configurazione `src/app/config/openday-config.json` (whitelist di sedi e date ammesse)
- Validazione campi obbligatori, inclusi `location` e `open_day_date`
- Composizione del payload verso l’API Eduarth (`/api/leads/steps/create`), incluso `open_day_date` nel formato atteso dalla documentazione
- Invio email di conferma all’utente e notifica all’accademia (sede, data formattata in italiano, indirizzo sede da config)
- Risposta JSON con `redirect` verso `grazie.html?sede=...&data=...` (parametri leggibili per la pagina di ringraziamento e per il tracking)

**Percorso config lato PHP:** `__DIR__ . '/../src/app/config/openday-config.json'` (relativo a `public/submit.php`). In **deploy** deve esistere quella struttura sul server: cartella `src/app/config/` con il JSON aggiornato, oltre agli asset della build. Se carichi solo la cartella `dist/`, configura un path alternativo in `submit.php` o copia il file JSON in una posizione raggiungibile dal PHP.

### Pagina di ringraziamento e tracking

- `public/grazie.html` legge `sede` e `data` dalla query string e li mostra nel testo.
- Eventi **Meta** (`Lead`) e **Google** (conversione) includono parametri personalizzati `sede` e `open_day_date` dove applicabile; sul form, `preload.ts` inoltra anche `campus` / `open_day_date` verso Pixel, `dataLayer` e `gtag` sugli eventi configurati.

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
- 🏢 Open Day multi-sede: scelta sede e data da config unica, hero allineato alle sedi attive
- 📊 Analytics tracking (Meta Pixel, GTM, Google Ads) con parametri sede/data sugli eventi rilevanti
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

### Form Testing (checklist suggerita)
1. Validazione campi anagrafici (email, telefono, nome/cognome)
2. Privacy non accettata: messaggio coerente
3. **Sede** non selezionata: messaggio «Seleziona la sede.»
4. **Data** non selezionata (dopo aver scelto sede con più sessioni): messaggio «Seleziona la data.»
5. Sede con **una sola** sessione: dopo scelta sede, data valorizzata automaticamente
6. Submit con combinazioni **Milano** e **Napoli** (e ogni data prevista in config) verso **staging** Eduarth
7. Verifica email utente e accademia: sede, data italiana, indirizzo
8. Redirect su `grazie.html` con query string; testo pagina e conversioni
9. Preload pagina grazie dopo interazione form
10. Errori rete / API: messaggi lato form e assenza di JSON corrotto
11. Manipolazione payload (es. `location` o `open_day_date` non in whitelist): risposta 422 dal PHP

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
- [ ] `src/app/config/openday-config.json` aggiornato (sedi, date, footer) e presente sul server insieme a `submit.php`
- [ ] File `.env` configurato correttamente
- [ ] Build production senza errori
- [ ] Test form submission su staging Eduarth (tutte le sedi/date previste)
- [ ] Verificato tracking analytics e parametri sede/data
- [ ] Meta tags Open Graph testati
- [ ] Lighthouse audit passato
- [ ] Cross-browser testing completato
- [ ] Asset compressi (immagini WebP, video ottimizzato)

## 🐛 Troubleshooting

### Form non funziona
- **Dev:** errore proxy `ECONNREFUSED` su `/submit.php` → avvia `php -S localhost:8888` dalla cartella `public` (o allinea porta e `vite.config.ts`)
- Verifica che il server PHP sia avviato
- Controlla il proxy in `vite.config.ts`
- Verifica i token API in `.env`
- Controlla che `src/app/config/openday-config.json` sia leggibile dal PHP (path, permessi, deploy incompleto)
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

## 📧 Contatti e footer

I recapiti mostrati nel **footer** della pagina provengono da `footer.contacts` in `openday-config.json` (testo unico in pagina, separato da `; ` tra una sede e l’altra). Aggiorna lì telefoni e email quando sono definitivi.

Per riferimento generico progetto (non necessariamente allineato al footer):

- **Email**: info@accademiamoda.it  
- **Telefono**: +39 081 554 0383  

---

**Ultima modifica**: 4 maggio 2026  
**Versione**: 1.1.0
