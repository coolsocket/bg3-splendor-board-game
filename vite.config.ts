import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    viteCompression({ algorithm: 'gzip', ext: '.gz' })
  ],
  resolve: {
    alias: {
      '@exodus/bytes/encoding-lite.js': path.resolve(__dirname, 'src/test-utils/exodus-bytes-mock.cjs'),
      '@exodus/bytes/encoding-lite': path.resolve(__dirname, 'src/test-utils/exodus-bytes-mock.cjs')
    }
  },
  ssr: {
    noExternal: ['@exodus/bytes']
  },
  test: {
    environment: 'happy-dom',
    pool: 'threads',
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/e2e/**/*'],
    server: {
      deps: {
        inline: ['@exodus/bytes', 'html-encoding-sniffer']
      }
    }
  }
})
