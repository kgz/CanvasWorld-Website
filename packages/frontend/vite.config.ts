import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [
					['@babel/plugin-proposal-decorators', { legacy: true }],
					['@babel/plugin-proposal-class-properties', { loose: true }],
				],
			},
		}),
	],
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext',
			define: {
				global: 'globalThis',
			},
			supported: {
				bigint: true,
			},
		},
	},
	build: {
		target: 'esnext',
		outDir: './dist',
		sourcemap: true,
		emptyOutDir: true,
	},
	server: {
		host: 'localhost',
		port: Number(process.env.VITE_PORT) || 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:' + (process.env.BACKEND_PORT || '8080'),
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: [
			{ find: '@s', replacement: path.resolve(__dirname, 'src/@styles') },
			{ find: '@t', replacement: path.resolve(__dirname, 'src/@types') },
			{ find: '@a', replacement: path.resolve(__dirname, 'src/@assets') },
		],
	},
})