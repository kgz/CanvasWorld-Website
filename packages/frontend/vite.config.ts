import mdx from '@mdx-js/rollup'
import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, type ServerOptions } from 'vite'

const rootDir = import.meta.dirname

function loadDevHttps(): ServerOptions['https'] {
	const keyPath = process.env.VITE_HTTPS_KEY
	const certPath = process.env.VITE_HTTPS_CERT
	if (!keyPath || !certPath) {
		return undefined
	}
	return {
		key: fs.readFileSync(path.resolve(rootDir, keyPath)),
		cert: fs.readFileSync(path.resolve(rootDir, certPath)),
	}
}

const MDX_SOURCES_ID = 'virtual:mdx-post-sources'
const MDX_SOURCES_RESOLVED = '\0' + MDX_SOURCES_ID

function mdxPostSourcesPlugin() {
	const postsDir = path.resolve(rootDir, 'src/blog/posts')

	function loadSources() {
		const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.mdx'))
		const map: Record<string, string> = {}
		for (const file of files) {
			const slug = file.replace(/\.mdx$/, '')
			map[slug] = fs.readFileSync(path.join(postsDir, file), 'utf8')
		}
		return `export default ${JSON.stringify(map)}`
	}

	return {
		name: 'mdx-post-sources',
		resolveId(id: string) {
			if (id === MDX_SOURCES_ID) {
				return MDX_SOURCES_RESOLVED
			}
			return undefined
		},
		load(id: string) {
			if (id === MDX_SOURCES_RESOLVED) {
				return loadSources()
			}
			return undefined
		},
	}
}

export default defineConfig({
	// Production is mounted at https://matf.dev/chaos (Traefik PathPrefix + strip).
	base: process.env.NODE_ENV === 'production' ? '/chaos/' : '/',
	css: {
		postcss: './postcss.config.js',
	},
	plugins: [
		mdxPostSourcesPlugin(),
		{
			enforce: 'pre',
			...mdx({ providerImportSource: '@mdx-js/react' }),
		},
		{
			name: 'watch-shared-catalog',
			configureServer(server) {
				const catalog = path.resolve(rootDir, '../shared/routes.json')
				server.watcher.add(catalog)
				// JSON HMR alone can leave routes.tsx with a stale catalog array →
				// new slugs fall through to Index (home) inside VizEmbed iframes.
				server.watcher.on('change', (file) => {
					if (path.resolve(file) === catalog) {
						server.ws.send({ type: 'full-reload', path: '*' })
					}
				})
			},
		},
		react(),
	],
	optimizeDeps: {
		rolldownOptions: {
			transform: {
				define: {
					global: 'globalThis',
				},
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
		https: loadDevHttps(),
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
			{ find: '@s', replacement: path.resolve(rootDir, 'src/@styles') },
			{ find: '@t', replacement: path.resolve(rootDir, 'src/@types') },
			{ find: '@a', replacement: path.resolve(rootDir, 'src/@assets') },
			{ find: '@cw/routes', replacement: path.resolve(rootDir, '../shared/routes.json') },
		],
	},
})