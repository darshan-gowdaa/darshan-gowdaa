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
})