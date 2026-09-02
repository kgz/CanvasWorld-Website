#!/usr/bin/env node
/**
 * Measure home-route JS payload (production preview).
 *
 * Usage:
 *   node scripts/benchmark-home.mjs --build
 *   FRONTEND_URL=http://127.0.0.1:4173/chaos node scripts/benchmark-home.mjs
 */
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_ROOT = path.resolve(__dirname, '..')
const BASE_URL = (process.env.FRONTEND_URL || 'http://127.0.0.1:4173/chaos').replace(/\/$/, '')
const HOME_URL = `${BASE_URL}/`

function run(cmd, args, cwd) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false })
		child.on('error', reject)
		child.on('close', (code) => {
			if (code === 0) resolve()
			else reject(new Error(`${cmd} exited ${code}`))
		})
	})
}

async function readBuildStats() {
	const distDir = path.join(FRONTEND_ROOT, 'dist', 'assets')
	const { readdir } = await import('node:fs/promises')
	const files = await readdir(distDir)
	const jsFiles = files.filter((f) => f.endsWith('.js') && !f.endsWith('.js.map'))
	const sizes = await Promise.all(
		jsFiles.map(async (file) => {
			const buf = await readFile(path.join(distDir, file))
			return { file, bytes: buf.byteLength }
		}),
	)
	sizes.sort((a, b) => b.bytes - a.bytes)
	const totalJs = sizes.reduce((sum, entry) => sum + entry.bytes, 0)
	return { jsFiles: sizes, totalJs }
}

async function measureNetwork() {
	const browser = await chromium.launch({ headless: true })
	const page = await browser.newPage()
	const scripts = []

	page.on('response', async (response) => {
		const url = response.url()
		const type = response.request().resourceType()
		if (type !== 'script') return
		const headers = response.headers()
		const length = Number(headers['content-length'] || 0)
		let bytes = length
		if (!bytes) {
			try {
				const body = await response.body()
				bytes = body.byteLength
			} catch {
				bytes = 0
			}
		}
		scripts.push({ url, bytes })
	})

	await page.goto(HOME_URL, { waitUntil: 'networkidle', timeout: 60_000 })
	await page.waitForSelector('h1', { timeout: 15_000 })
	await browser.close()

	const totalTransfer = scripts.reduce((sum, s) => sum + s.bytes, 0)
	scripts.sort((a, b) => b.bytes - a.bytes)
	return { scripts, totalTransfer }
}

async function main() {
	const doBuild = process.argv.includes('--build')

	if (doBuild) {
		await run('pnpm', ['exec', 'vite', 'build'], FRONTEND_ROOT)
	}

	const build = await readBuildStats()
	const network = await measureNetwork()

	const report = {
		label: process.env.BENCH_LABEL || 'run',
		timestamp: new Date().toISOString(),
		homeUrl: HOME_URL,
		build: {
			totalJsBytes: build.totalJs,
			topChunks: build.jsFiles.slice(0, 8),
			chunkCount: build.jsFiles.length,
		},
		network: {
			totalScriptBytes: network.totalTransfer,
			topScripts: network.scripts.slice(0, 8),
			scriptCount: network.scripts.length,
		},
	}

	console.log(JSON.stringify(report, null, 2))
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
