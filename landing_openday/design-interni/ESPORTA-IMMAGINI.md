# 📸 Guida: Esportare Immagini da Figma

Per far funzionare il progetto, devi esportare 14 immagini dal file Figma e salvarle nella cartella `src/assets/`.

## 🎯 Passaggi

### 1. Apri il file Figma
Apri il file: **OpenDay-ArtDirection&Copy**

### 2. Trova la sezione "carousel-block"
Cerca il frame chiamato **"carousel-block"** (dovrebbe essere nella sezione "Blocchi Landing Desktop")

### 3. Esporta le immagini del carousel

Seleziona ed esporta le seguenti immagini **una alla volta**:

| **Nome in Figma** | **Salva come** (in `src/assets/`) |
|-------------------|-------------------------------------|
| Rectangle 11      | `rectangle-11.png`                  |
| Rectangle 1       | `rectangle-1.png`                   |
| Rectangle 2       | `rectangle-2.png`                   |
| Rectangle 4       | `rectangle-4.png`                   |
| Rectangle 12      | `rectangle-12.png`                  |
| Rectangle 3       | `rectangle-3.png`                   |
| Rectangle 5       | `rectangle-5.png`                   |
| Rectangle 8       | `rectangle-8.png`                   |
| Rectangle 14      | `rectangle-14.png`                  |
| Rectangle 10      | `rectangle-10.png`                  |
| Rectangle 7       | `rectangle-7.png`                   |
| Rectangle 9       | `rectangle-9.png`                   |
| Rectangle 13      | `rectangle-13.png`                  |

### 4. Esporta l'immagine del blocco "Coppia Creativa"

Cerca il frame **"course-block"** o **"coppia-creativa"** e esporta l'immagine come:
- **Salva come**: `coppia-creativa.png` (in `src/assets/`)

---

## 📝 Come esportare da Figma

1. **Seleziona** l'elemento (es. "Rectangle 11")
2. Nella barra laterale destra, vai alla sezione **"Export"**
3. Clicca su **"+"** se non c'è già un'esportazione configurata
4. Imposta il formato su **PNG**
5. Clicca su **"Export Rectangle..."**
6. Salva il file nella cartella `src/assets/` del progetto con il nome indicato nella tabella sopra

---

## ✅ Verifica

Alla fine, la cartella `src/assets/` dovrebbe contenere questi 14 file:

```
src/assets/
├── rectangle-11.png
├── rectangle-1.png
├── rectangle-2.png
├── rectangle-4.png
├── rectangle-12.png
├── rectangle-3.png
├── rectangle-5.png
├── rectangle-8.png
├── rectangle-14.png
├── rectangle-10.png
├── rectangle-7.png
├── rectangle-9.png
├── rectangle-13.png
└── coppia-creativa.png
```

Una volta completato, riavvia il dev server con `npm run dev` e il progetto dovrebbe funzionare! 🚀
