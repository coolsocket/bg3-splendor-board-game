import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
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
    pool: 'threads',
    server: {
      deps: {
        inline: ['@exodus/bytes', 'html-encoding-sniffer']
      }
    }
  }
})
