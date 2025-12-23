/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/darshan-gowdaa/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Use esbuild for minification (default in Vite, no extra deps needed)
    minify: 'esbuild',
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three'],
          'vendor-icons': ['react-icons'],
        },
        // Asset file naming with hash for cache busting
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
    // Increase chunk size warning limit (some vendor libs are large)
    chunkSizeWarningLimit: 600,
    // Enable source maps for debugging (optional, can disable for smaller builds)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'es2020',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three'],
  },
})