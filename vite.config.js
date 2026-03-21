/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/darshan-gowdaa/',
  plugins: [
    react(),
    tailwindcss(),
    // optimize images during build
    ViteImageOptimizer(),
    // gzip compression
    compression({
      algorithm: 'gzip',
      threshold: 1024, // only compress files > 1KB
    }),
    // brotli is better compression than gzip
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],
  build: {
    // Use esbuild for minification
    minify: 'esbuild',
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // put big libraries in their own chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three'],
          'vendor-icons': ['react-icons'],
        },
        // hash in filename so browser re-downloads when updated
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // increase warning limit, some vendor libs are just big
    chunkSizeWarningLimit: 600,
    // no source maps in prod build
    sourcemap: false,
  },
  // drop console logs and debuggers from the production build
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three'],
  },
})