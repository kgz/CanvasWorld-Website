import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	// Production is mounted at https://matf.dev/chaos (Traefik PathPrefix + strip).
	base: process.env.NODE_ENV === 'production' ? '/chaos/' : '/',
	css: {
		postcss: './postcss.config.js',
	},
	plugins: [
		{
			enforce: 'pre',
			...mdx({ providerImportSource: '@mdx-js/react' }),
		},
		{
			name: 'watch-shared-catalog',
			configureServer(server) {
				server.watcher.add(path.resolve(__dirname, '../shared/routes.json'))
			},
		},
		react({
			// Enable React Refresh for hot reloading
			fastRefresh: true,
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
		// Enable HMR (Hot Module Replacement)
		hmr: {
			port: Number(process.env.VITE_PORT) || 5173,
		},
		proxy: {
			'/api': {
				target: 'http://localhost:' + (process.env.BACKEND_PORT || '8080'),
				changeOrigin: true,
			},
			'/chaos/icons': {
				target: 'http://localhost:' + (process.env.BACKEND_PORT || '8080'),
				changeOrigin: true,
				configure: (proxy) => {
					proxy.on('proxyRes', (proxyRes) => {
						proxyRes.headers['cache-control'] = 'no-store'
					})
				},
			},
		},
	},
	resolve: {
		alias: [
			{ find: '@s', replacement: path.resolve(__dirname, 'src/@styles') },
			{ find: '@t', replacement: path.resolve(__dirname, 'src/@types') },
			{ find: '@a', replacement: path.resolve(__dirname, 'src/@assets') },
			{ find: '@cw/routes', replacement: path.resolve(__dirname, '../shared/routes.json') },
		],
	},
})