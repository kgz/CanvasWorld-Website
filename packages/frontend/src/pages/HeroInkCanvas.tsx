import { useEffect, useRef } from 'react'
import styles from './frontpage.module.css'

type Strand = {
	x: number
	y: number
	angle: number
	speed: number
	hue: 'ink1' | 'ink2'
	drift: number
	phase: number
}

function makeStrands(width: number, height: number, count: number): Strand[] {
	const list: Strand[] = []
	for (let i = 0; i < count; i++) {
		list.push({
			x: Math.random() * width,
			y: Math.random() * height,
			angle: Math.random() * Math.PI * 2,
			speed: 0.25 + Math.random() * 0.5,
			hue: Math.random() > 0.72 ? 'ink2' : 'ink1',
			drift: 0.004 + Math.random() * 0.01,
			phase: Math.random() * Math.PI * 2,
		})
	}
	return list
}

export function HeroInkCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		let width = 0
		let height = 0
		let strands: Strand[] = []
		let raf = 0
		let disposed = false

		const accentInk = 'rgba(61, 214, 198,'
		const coolInk = 'rgba(184, 196, 214,'

		const resize = () => {
			width = canvas.clientWidth
			height = canvas.clientHeight
			canvas.width = width * dpr
			canvas.height = height * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			ctx.fillStyle = '#05070a'
			ctx.fillRect(0, 0, width, height)
			strands = makeStrands(width, height, Math.round((width * height) / 90000) + 18)
		}

		const tick = (t: number) => {
			if (disposed) return
			ctx.fillStyle = 'rgba(5, 7, 10, 0.055)'
			ctx.fillRect(0, 0, width, height)

			for (let i = 0; i < strands.length; i++) {
				const s = strands[i]
				const wobble = Math.sin(t * 0.00035 + s.phase) * s.drift * 40
				s.angle += wobble * 0.02
				const nx = s.x + Math.cos(s.angle) * s.speed
				const ny = s.y + Math.sin(s.angle) * s.speed

				ctx.beginPath()
				ctx.moveTo(s.x, s.y)
				ctx.lineTo(nx, ny)
				ctx.strokeStyle = (s.hue === 'ink2' ? coolInk : accentInk) + '0.5)'
				ctx.lineWidth = s.hue === 'ink2' ? 0.6 : 1
				ctx.stroke()

				s.x = nx
				s.y = ny

				if (s.x < -20 || s.x > width + 20 || s.y < -20 || s.y > height + 20) {
					s.x = Math.random() * width
					s.y = Math.random() * height
					s.angle = Math.random() * Math.PI * 2
				}
			}

			if (!reduceMotion) {
				raf = requestAnimationFrame(tick)
			}
		}

		window.addEventListener('resize', resize)
		resize()

		if (reduceMotion) {
			for (let pass = 0; pass < 40; pass++) {
				tick(pass * 200)
			}
		} else {
			raf = requestAnimationFrame(tick)
		}

		return () => {
			disposed = true
			window.removeEventListener('resize', resize)
			cancelAnimationFrame(raf)
		}
	}, [])

	return <canvas className={styles.heroCanvas} ref={canvasRef} aria-hidden="true" />
}
