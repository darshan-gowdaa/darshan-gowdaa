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
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('react-icons')) return 'vendor-icons';
          }
        },
        // hash in filename so browser re-downloads when updated
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // increase warning limit, some vendor libs are just big
    chunkSizeWarningLimit: 600,
    // no source maps in prod build
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three'],
  },
})