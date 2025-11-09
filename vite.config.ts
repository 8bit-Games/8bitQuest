import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig({
  root: './client',
  publicDir: '../client',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['underscore'],
        },
      },
    },
  },

  plugins: [
    // Legacy browser support (optional)
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),

    // Progressive Web App
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'sprites/**/*', 'audio/**/*'],
      manifest: {
        name: '8bitQuest',
        short_name: '8bitQuest',
        description: 'A massively multiplayer adventure game',
        theme_color: '#1a1a1a',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'img/common/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,mp3,ogg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  optimizeDeps: {
    include: ['underscore'],
  },
});
