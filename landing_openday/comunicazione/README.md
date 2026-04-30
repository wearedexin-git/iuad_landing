# Landing Page - Design della Comunicazione | IUAD Milano

Landing page per la campagna Open Day del corso triennale di Design della Comunicazione presso l'Accademia IUAD Milano.

## 📋 Informazioni Evento

- **Corso**: Design della Comunicazione (Triennale di I livello)
- **Sede**: IUAD Milano - Via Balduccio da Pisa 16
- **Data Open Day**: 16 maggio 2026, ore 11:00
- **Cliente**: Accademia IUAD (Istituto Universitario di Architettura e Design)

## 🚀 Quick Start

### Prerequisiti

- **Node.js**: v18+ 
- **npm** o **pnpm**
- **PHP**: 7.4+ (per il backend di lead capture)

### Installazione

```bash
# Clona il repository
git clone [url-repository]
cd landing_comunicazione_b-main

# Installa le dipendenze
npm install

# Crea il file di ambiente dalle credenziali
cp .env.example .env

# ⚠️ IMPORTANTE: Modifica .env con i token JWT reali
nano .env
```

### Configurazione File .env

Apri il file `.env` e configura:

```env
# Ambiente: 'staging' o 'production'
API_ENVIRONMENT=production

# Token JWT per staging
API_TOKEN_STAGING=your_staging_token_here

# Token JWT per produzione
API_TOKEN_PRODUCTION=your_production_token_here

# Email
EMAIL_FROM=contact@accademiamoda.it
EMAIL_FROM_NAME=Accademia IUAD
EMAIL_TO_ACADEMY=ufficioculturale@accademiamoda.it
```

### Sviluppo Locale

```bash
# Avvia il server di sviluppo Vite
npm run dev

# In un altro terminale, avvia PHP per gestire submit.php
# Opzione 1: PHP built-in server
cd public && php -S localhost:8888

# Opzione 2: Usa MAMP/XAMPP/altro server locale
```

La landing sarà disponibile su `http://localhost:5173/landing/design-della-comunicazione/`

### Build per Produzione

```bash
# Compila il progetto
npm run build

# La cartella dist/ conterrà tutti i file pronti per il deploy
```

## 📁 Struttura del Progetto

```
landing_comunicazione_b-main/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Componente root
│   │   └── components/
│   │       ├── Header.tsx             # Header + CTA
│   │       ├── HeroSection.tsx        # Hero + Form registrazione
│   │       ├── TextBlock.tsx          # Blocco testo introduttivo
│   │       ├── CoppiaCreativaBlock.tsx
│   │       ├── CourseBlock.tsx        # Info sul corso
│   │       ├── CarouselBlock.tsx      # Galleria progetti
│   │       ├── PlusBlock.tsx
│   │       ├── TestimonialBlock.tsx   # Testimonianze
│   │       ├── Footer.tsx             # Footer con contatti
│   │       ├── ui/                    # Componenti UI generici (template)
│   │       └── figma/                 # Componenti da design
│   ├── assets/                        # Immagini, font, SVG
│   ├── styles/                        # CSS (Tailwind, fonts, theme)
│   └── types/                         # TypeScript declarations
├── public/
│   ├── submit.php                     # Backend lead capture
│   └── grazie.html                    # Thank you page
├── .env                               # ⚠️ NON COMMITTARE (credenziali)
├── .env.example                       # Template configurazione
├── vite.config.ts                     # Configurazione Vite
├── package.json
└── README.md
```

## 🎨 Stack Tecnologico

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 6** - Build tool ultra-veloce
- **Tailwind CSS 4** - Utility-first CSS
- **Radix UI** - Componenti headless accessibili
- **Embla Carousel** - Carosello progetti

### Backend
- **PHP** - API endpoint per lead capture
- **Eduarth API** - Sistema CRM per lead management

### Tracking & Analytics
- Google Tag Manager
- Meta Pixel (Facebook)
- Google Ads Conversion
- Iubenda (Cookie consent)

## 🔐 Sicurezza

### File Sensibili

⚠️ **IMPORTANTE**: Il file `.env` contiene credenziali sensibili e **NON deve mai essere committato** nel repository.

```bash
# Verifica che .env sia nel .gitignore
cat .gitignore | grep .env
```

### Token JWT

I token JWT per l'API Eduarth sono configurati nel file `.env`:
- **Staging Token**: Per sviluppo/test
- **Production Token**: Per l'ambiente di produzione

**Prima del deploy in produzione**, verifica:
1. Che `API_ENVIRONMENT=production` nel file `.env`
2. Che i token siano aggiornati e validi
3. Che le email siano configurate correttamente

## 🌐 Deploy

### Requisiti Server

- **Web Server**: Apache/Nginx con supporto per SPA
- **PHP**: 7.4+ con estensioni `curl`, `json`, `mbstring`
- **HTTPS**: Obbligatorio per privacy e sicurezza

### Path di Deploy

Il progetto è configurato per essere servito su:

```
https://tuodominio.it/landing/design-della-comunicazione/
```

Se vuoi cambiare il path, modifica `base` in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/tuo-nuovo-path/',
  // ...
});
```

### Procedura Deploy

1. **Build del progetto**:
   ```bash
   npm run build
   ```

2. **Carica su server**:
   ```bash
   # Carica tutto il contenuto di dist/ nella directory web
   rsync -avz dist/ user@server:/path/to/landing/design-della-comunicazione/
   ```

3. **Configura file .env sul server**:
   ```bash
   # Sul server, crea .env nella root del progetto (un livello sopra public/)
   nano /path/to/landing/.env
   ```

4. **Configura web server** per servire `index.html` come fallback per le route SPA

5. **Verifica funzionamento**:
   - Apri la landing nel browser
   - Testa il form di registrazione
   - Verifica che arrivi l'email di conferma
   - Controlla che i lead arrivino in Eduarth

## 📊 Lead Capture Flow

```
User compila form
     ↓
HeroSection invia POST a submit.php
     ↓
submit.php valida i dati
     ↓
submit.php chiama API Eduarth
     ↓
submit.php invia 2 email:
  - Conferma all'utente
  - Notifica all'accademia
     ↓
Redirect a grazie.html
```

### Campi Form

- `first_name` - Nome
- `last_name` - Cognome
- `email` - Email
- `phone_number` - Numero di telefono
- `how_you_knows` - Come ci ha conosciuto (1-7)

### API Endpoint

- **Staging**: `https://staging-eduarth.accademiamoda.it/api/leads/steps/create`
- **Production**: `https://eduarth.accademiamoda.it/api/leads/steps/create`

## 🎯 Ottimizzazioni Implementate

### ✅ Sicurezza
- Token JWT spostati da codice a variabili d'ambiente
- File `.env` escluso da git
- Validazione input lato server

### ✅ Codice
- Rimosso codice legacy (`LandingDesktop.tsx`, `.history/`)
- Rinominato `FormBlock` → `Footer` per chiarezza semantica
- Documentazione dipendenze (`DEPENDENCIES.md`)

### ✅ Asset
- Tutte le immagini presenti e verificate
- Documentazione asset con suggerimenti di ottimizzazione (`ASSETS.md`)

### 🔄 Da Valutare (Opzionale)
- Pulizia dipendenze non utilizzate dal template UI
- Ottimizzazione dimensione immagini (alcune > 1MB)
- Implementazione lazy loading per immagini
- Conversione immagini a WebP/AVIF

## 🐛 Troubleshooting

### Form non funziona

1. Verifica che PHP sia in esecuzione:
   ```bash
   curl http://localhost:8888/submit.php
   ```

2. Controlla il file `.env` sia configurato correttamente

3. Verifica i log PHP per errori:
   ```bash
   tail -f /var/log/php/error.log
   ```

### Build fallisce

1. Verifica che tutte le immagini siano presenti:
   ```bash
   ls -l src/assets/*.jpg
   ```

2. Pulisci la cache e riprova:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

### Email non arrivano

1. Verifica configurazione email in `.env`
2. Controlla che il server PHP abbia configurato correttamente la funzione `mail()`
3. Verifica log email del server

## 📚 Documentazione Aggiuntiva

- [`DEPENDENCIES.md`](./DEPENDENCIES.md) - Analisi dettagliata delle dipendenze
- [`ASSETS.md`](./ASSETS.md) - Inventario e ottimizzazione asset
- [`.env.example`](./.env.example) - Template configurazione ambiente

## 🤝 Supporto

Per domande o supporto:
- **Email**: info@accademiamoda.it
- **Telefono**: +39 081 554 0383
- **Sede IUAD Milano**: Via Balduccio da Pisa 16, Milano

## 📝 Note di Versione

### v0.0.1 - Versione Corrente
- Landing page completa con tutti i componenti
- Sistema di lead capture integrato con Eduarth
- Tracking analytics configurato
- Ottimizzazioni sicurezza e codice implementate

---

**Sviluppato per**: Accademia IUAD Milano  
**Corso**: Design della Comunicazione - Open Day 2026
