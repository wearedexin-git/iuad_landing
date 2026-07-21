import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const LOGO_SRC = path.resolve(__dirname, 'src/assets/logo_iuad_black.png')
const LOGO_PUBLIC_PATH = '/assets/images/logo_iuad_black.png'

// Copia asset di deploy in `dist/` durante `vite build` (config JSON + logo IUAD).
function copyDeployAssets() {
  return {
    name: 'copy-deploy-assets',
    apply: 'build' as const,
    closeBundle() {
      const configSrc = path.resolve(__dirname, 'src/app/config/openday-config.json')
      const configDestDir = path.resolve(__dirname, 'dist/config')
      const configDest = path.resolve(configDestDir, 'openday-config.json')

      if (!fs.existsSync(configSrc)) {
        throw new Error(`[copy-deploy-assets] File sorgente non trovato: ${configSrc}`)
      }
      if (!fs.existsSync(configDestDir)) {
        fs.mkdirSync(configDestDir, { recursive: true })
      }
      fs.copyFileSync(configSrc, configDest)

      if (!fs.existsSync(LOGO_SRC)) {
        throw new Error(`[copy-deploy-assets] Logo non trovato: ${LOGO_SRC}`)
      }
      const logoDestDir = path.resolve(__dirname, 'dist/assets/images')
      const logoDest = path.resolve(logoDestDir, 'logo_iuad_black.png')
      if (!fs.existsSync(logoDestDir)) {
        fs.mkdirSync(logoDestDir, { recursive: true })
      }
      fs.copyFileSync(LOGO_SRC, logoDest)
    },
  }
}

// In dev serve il logo da `src/assets` per la thank-you page e `submit.php`.
function serveLogoInDev() {
  return {
    name: 'serve-logo-in-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url !== LOGO_PUBLIC_PATH && !url.endsWith(LOGO_PUBLIC_PATH)) {
          next()
          return
        }
        if (!fs.existsSync(LOGO_SRC)) {
          next()
          return
        }
        res.setHeader('Content-Type', 'image/png')
        fs.createReadStream(LOGO_SRC).pipe(res)
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  // In dev (`vite`) usa '/' per servire dalla root locale.
  // In build (`vite build`) usa il path di produzione sotto cui la landing è pubblicata.
  base: command === 'build' ? '/landing/design-della-moda-business-management/' : '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    copyDeployAssets(),
    serveLogoInDev(),
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
      '/landing/design-della-moda-business-management/submit.php': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/landing\/design-della-moda-business-management/, ''),
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
