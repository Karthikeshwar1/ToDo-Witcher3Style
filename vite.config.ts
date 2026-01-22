import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment - must match your repo name exactly
  base: '/ToDo-Witcher3Style/',
})
