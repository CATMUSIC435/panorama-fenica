import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'zustand'],
          'vendor-heavy': ['mapbox-gl', 'react-map-gl', 'recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
