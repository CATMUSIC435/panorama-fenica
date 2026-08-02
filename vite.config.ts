import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl') || id.includes('react-map-gl')) {
              return 'vendor-map';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('three') || id.includes('three-stdlib')) {
              return 'vendor-three';
            }
            if (id.includes('@react-three')) {
              return 'vendor-react-three';
            }
            if (id.includes('lucide')) {
              return 'vendor-icons';
            }
            if (id.includes('@react-spring')) {
              return 'vendor-spring';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
