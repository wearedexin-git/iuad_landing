import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Copia `src/app/config/openday-config.json` in `dist/config/openday-config.json`
// durante `vite build`, così che `public/submit.php` possa leggerlo a runtime in
// produzione (il frontend lo importa come modulo ES, ma il PHP ha bisogno del
// file fisico nella cartella deployata).
function copyOpendayConfig() {
  return {
    name: 'copy-openday-config',
    apply: 'build' as const,
    closeBundle() {
      const src = path.resolve(__dirname, 'src/app/config/openday-config.json')
      const destDir = path.resolve(__dirname, 'dist/config')
      const dest = path.resolve(destDir, 'openday-config.json')

      if (!fs.existsSync(src)) {
        throw new Error(`[copy-openday-config] File sorgente non trovato: ${src}`)
      }
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(src, dest)
    },
  }
}

export default defineConfig(({ command }) => ({
  // In dev (`vite`) usa '/' per servire dalla root locale.
  // In build (`vite build`) usa il path di produzione sotto cui la landing è pubblicata.
  base: command === 'build' ? '/landing/art-direction-e-copywriting/' : '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    copyOpendayConfig(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Build optimizations
  build: {
    // Aumenta il limite per warning di chunk size
    chunkSizeWarningLimit: 1000,
    
    // Ottimizzazioni di rollup
    rollupOptions: {
      output: {
        // Splitting intelligente per migliore caching
        manualChunks: {
          // Vendor chunks separati per librerie grandi
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-popover'],
        },
        
        // Nomi file con hash per cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    
    // Minification con terser per migliori risultati
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Rimuove console.log in production
        drop_debugger: true,
      },
    },
    
    // Source maps per debugging (disabilita in production se non necessario)
    sourcemap: false,
  },

  server: {
    proxy: {
      '/submit.php': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/landing/art-direction-e-copywriting/submit.php': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/landing\/art-direction-e-copywriting/, ''),
      },
    },
  },
  
  // Ottimizzazioni delle dipendenze
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
    ],
  },
}))
