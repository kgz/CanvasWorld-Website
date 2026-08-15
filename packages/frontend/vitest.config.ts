import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: [
      { find: '@s', replacement: path.resolve(__dirname, 'src/@styles') },
      { find: '@t', replacement: path.resolve(__dirname, 'src/@types') },
      { find: '@a', replacement: path.resolve(__dirname, 'src/@assets') },
    ],
  },
})
