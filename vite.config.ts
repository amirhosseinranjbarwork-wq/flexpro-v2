import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }

          // UI libraries
          if (id.includes('framer-motion') || id.includes('react-hot-toast') || id.includes('sweetalert2') ||
              id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'ui-vendor';
          }

          // Drag and drop
          if (id.includes('@dnd-kit')) {
            return 'dnd-vendor';
          }

          // Charts and visualization
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'chart-vendor';
          }

          // PDF and image processing (loaded on demand)
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'pdf-vendor';
          }

          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }

          // Large data files (will be lazy loaded)
          if (id.includes('/data/foodData') || id.includes('/data/resistanceExercises') ||
              id.includes('/data/correctiveExercises') || id.includes('/data/cardioExercises') ||
              id.includes('/data/warmupCooldown')) {
            return 'data-vendor';
          }
        }
      }
    },
    // Increase chunk size warning limit since we have large libraries
    chunkSizeWarningLimit: 1000
  }
})
