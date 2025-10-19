import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	css: {
		postcss: './postcss.config.js',
	},
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
		rollupOptions: {
			external: ['katex/dist/katex.min.css'],
		},
	},
	server: {
		host: 'localhost',
		port: Number(process.env.VITE_PORT) || 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:' + (process.env.BACKEND_PORT || '8080'),
				changeOrigin: true,
			},
			'/chaos': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/chaos/, '/chaos'),
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