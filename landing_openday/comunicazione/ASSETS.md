# Asset del Progetto - Documentazione

## ✅ Stato Asset: TUTTI PRESENTI

Tutti i file richiesti sono presenti nella cartella `src/assets/`. Di seguito l'inventario completo:

### Immagine Corso
- **File**: `course_image.jpg`
- **Utilizzato in**: `src/app/components/CoppiaCreativaBlock.tsx`
- **Scopo**: Immagine principale del corso di Design della Comunicazione

### Immagini Carosello (10 file)
Tutti utilizzati in `src/app/components/CarouselBlock.tsx`:

1. `carousel_image_1.jpg`
2. `carousel_image_2.jpg`
3. `carousel_image_3.jpg`
4. `carousel_image_4.jpg`
5. `carousel_image_5.jpg`
6. `carousel_image_6.jpg`
7. `carousel_image_7.jpg`
8. `carousel_image_8.jpg`
9. `carousel_image_9.jpg`
10. `carousel_image_10.jpg`

**Scopo**: Galleria di progetti/lavori degli studenti mostrata nel carosello

## 📊 Dimensioni File Attuali

- `course_image.jpg`: 616 KB
- `carousel_image_1.jpg`: 1.06 MB ⚠️ (considera ottimizzazione)
- `carousel_image_2.jpg`: 511 KB
- `carousel_image_3.jpg`: 792 KB
- `carousel_image_4.jpg`: 724 KB
- `carousel_image_5.jpg`: 790 KB
- `carousel_image_6.jpg`: 467 KB
- `carousel_image_7.jpg`: 650 KB
- `carousel_image_8.jpg`: 578 KB
- `carousel_image_9.jpg`: 655 KB
- `carousel_image_10.jpg`: 188 KB

**Dimensione totale**: ~7 MB

### 💡 Raccomandazioni per Ottimizzazione:

Alcune immagini sono piuttosto grandi. Per migliorare le performance:

1. **Specifiche Tecniche Ottimali**:
   - **Formato**: JPEG
   - **Risoluzione**: 1200-1920px larghezza (responsive)
   - **Qualità**: 80-85% (bilanciamento qualità/dimensione)
   - **Dimensione file**: < 500KB per immagine (ottimizzato per caricamento veloce)

3. **Considera l'uso di formati moderni**:
   - WebP (supporto browser moderno): riduzione ~30% dimensione
   - AVIF (supporto browser più recente): riduzione ~50% dimensione
   - Implementa fallback per browser legacy

4. **Ottimizzazione con tools**:
   ```bash
   # Esempio con imagemagick
   mogrify -quality 85 -resize 1920x src/assets/*.jpg
   
   # Oppure usa servizi online come TinyPNG, Squoosh, ecc.
   ```

## 🔍 Verifica Presenza File

Esegui questo comando per verificare:

```bash
ls -lh src/assets/*.jpg
```

## 🎨 Altri Asset Presenti

- ✅ `src/assets/communication_icon.svg` - Icona comunicazione
- ✅ `src/assets/fonts/TiemposHeadline-Bold.woff2` - Font Tiempos
- ✅ Font Sarabun caricati da Google Fonts (via `index.html`)

## 📝 Note Tecniche

- Vite ottimizzerà automaticamente le immagini durante il build
- Gli import statici garantiscono che Vite includa i file nel bundle
- Le immagini vengono hashate per il cache busting
