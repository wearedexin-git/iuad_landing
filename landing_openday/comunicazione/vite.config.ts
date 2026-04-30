import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Per test locale usa '/', per production ripristina '/landing/design-della-comunicazione/'
  base: '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
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
      '/landing/design-della-comunicazione/submit.php': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/landing\/design-della-comunicazione/, ''),
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
})
