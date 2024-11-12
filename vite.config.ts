import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8090'

  return {
    plugins: [
      react({
        babel: { plugins: ['babel-plugin-react-compiler'] }
      }),
      visualizer({
        open: false,
        gzipSize: true
      })
    ],
    build: {
      outDir: './backend/dist',
      emptyOutDir: true
    },
    publicDir: './frontend/public',
    resolve: { alias: { '@': path.resolve(__dirname, './frontend/src') } },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    }
  }
})
