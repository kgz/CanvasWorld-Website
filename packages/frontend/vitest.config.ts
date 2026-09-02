import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const rootDir = import.meta.dirname

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
	},
	resolve: {
		alias: [
			{ find: '@s', replacement: path.resolve(rootDir, 'src/@styles') },
			{ find: '@t', replacement: path.resolve(rootDir, 'src/@types') },
			{ find: '@a', replacement: path.resolve(rootDir, 'src/@assets') },
		],
	},
})
