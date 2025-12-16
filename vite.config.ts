import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      injectRegister: 'auto',
      manifest: {
        name: 'FlexPro v2 - Fitness SaaS',
        short_name: 'FlexPro',
        description: 'Professional fitness coaching platform with AI-powered workout plans',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?${Date.now()}`;
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:woff2|woff|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return '[name].[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name].[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/i.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          } else if (ext === 'svg') {
            return `svg/[name].[hash][extname]`;
          }
          return `[name].[hash][extname]`;
        },
        manualChunks: (id) => {
          // Core vendor chunk (React + routing)
          if (id.includes('react') && (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/'))) {
            return 'vendor-core';
          }
          
          // UI vendor chunk
          if (id.includes('framer-motion') || id.includes('react-hot-toast') || id.includes('sweetalert2') || id.includes('lucide-react')) {
            return 'vendor-ui';
          }

          // Supabase client
          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase';
          }

          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query';
          }

          // Drag and drop
          if (id.includes('@dnd-kit')) {
            return 'vendor-dnd';
          }

          // Charts
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-data';
          }
        }
      }
    },
    // Optimize chunk size thresholds
    chunkSizeWarningLimit: 600,
    commonjsOptions: {
      include: /node_modules/,
      sourceMap: false
    }
  }
})
