import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment - change 'Witcher3ToDo' to your repo name
  base: '/Witcher3ToDo/',
})
