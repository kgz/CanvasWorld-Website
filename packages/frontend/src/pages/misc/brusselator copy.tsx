import { OrbitControls, Stats } from '@react-three/drei'
import type { RenderCallback } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatNumber } from 'react-dat-gui'
import * as THREE from 'three'
import style from '../../@scss/template.module.scss'
import MathJax from 'react-mathjax'
import { InlineMath, BlockMath } from 'react-katex'

const { sin, cos } = Math

type DatData = {
	package: string
	a: number
	b: number
	feed: number
	kill: number
}

const Points = ({ datData }: { datData: DatData }) => {
	const points = useRef<typeof points>()
	const [datDataCache, setDatDataCache] = useState<DatData>(datData)
	const width = 200,
		height = 200
	const [grid, setGrid] = useState<
		{
			a: number
			b: number
			aNext: number
			bNext: number
		}[][]
	>(
		new Array(width).fill(
			new Array(height).fill({
				a: 1,
				b: 0,
				aNext: 0,
				bNext: Math.random() * 0.1,
			}),
		),
	)

	const pointsBuffer = useMemo(() => new Float32Array(width * height * 2), [])
	const ColorBuffer = useMemo(() => new Float32Array(width * height * 3), [])

	useEffect(() => {
		const temp = grid

		for (let i = 100; i < 110; i++) {
			for (let j = 100; j < 110; j++) {
				temp[i][j] = {
					a: 1,
					b: 0,
					aNext: 0,
					bNext: 1,
				}
			}
		}
		setGrid(temp)
	}, [grid])

	const laplaceA = useCallback(
		(i: number, j: number) => {
			let sumA = 0

			if (i === 0 || j === 0 || i === width - 1 || j === height - 1) {
				return 0
			}

			sumA += grid[i][j].a * -1
			sumA += grid[i - 1][j].a * 0.2
			sumA += grid[i + 1][j].a * 0.2
			sumA += grid[i][j + 1].a * 0.2
			sumA += grid[i][j - 1].a * 0.2
			sumA += grid[i - 1][j - 1].a * 0.05
			sumA += grid[i + 1][j - 1].a * 0.05
			sumA += grid[i + 1][j + 1].a * 0.05
			sumA += grid[i - 1][j + 1].a * 0.05
			return sumA
		},
		[grid],
	)

	const laplaceB = useCallback(
		(i: number, j: number) => {
			let sumB = 0

			if (i === 0 || j === 0 || i === width - 1 || j === height - 1) {
				return 0
			}

			sumB += grid[i][j].b * -1
			sumB += grid[i - 1][j].b * 0.2
			sumB += grid[i + 1][j].b * 0.2
			sumB += grid[i][j + 1].b * 0.2
			sumB += grid[i][j - 1].b * 0.2
			sumB += grid[i - 1][j - 1].b * 0.05
			sumB += grid[i + 1][j - 1].b * 0.05
			sumB += grid[i + 1][j + 1].b * 0.05
			sumB += grid[i - 1][j + 1].b * 0.05
			return sumB
		},
		[grid],
	)

	// const calculateValues = useCallback((i: number, j: number): { a: number, b: number } => {
	//     const { a, b } = grid[i][j];

	//     const da = datDataCache.a;
	//     const db = datDataCache.b;
	//     const { kill, feed } = datDataCache;

	//     let newA = a + (da * laplaceA(i, j, grid) - a * b * b + feed * (1 - a)) * 0.1;
	//     let newB = b + (db * laplaceB(i, j, grid) + a * b * b - (kill + feed) * b) * 0.1;

	//     newA = Math.min(Math.max(newA, 0), 1);
	//     newB = Math.min(Math.max(newB, 0), 1);
	//     return { a: newA, b: newB };
	// }, [grid, datDataCache, laplaceA, laplaceB])

	const swap = useCallback(() => {
		const temp = grid
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[0].length; j++) {
				temp[i][j].a = temp[i][j].aNext
				temp[i][j].b = temp[i][j].bNext
			}
		}
		setGrid(temp)
	}, [grid])

	// on every frame recalculates the position of every particle
	// and updates the attribute with the new values
	const tick: RenderCallback = useCallback(
		(time, delta, frame) => {
			// Remove the unused variables 'delta' and 'frame'
			if (time.gl.info.render.frame % 5 !== 0) {
				// console.log(grid)
				return
			}

			const tempNext = grid

			const positions = pointsBuffer
			const colors = ColorBuffer

			for (let i = 0; i < grid.length; i++) {
				for (let j = 0; j < grid[0].length; j++) {
					const { a, b } = grid[i][j]

					const da = datData.a
					const db = datData.b
					const { kill, feed } = datData

					let newA = a + (da * laplaceA(i, j) - a * b * b + feed * (1 - a)) * 0.1
					let newB = b + (db * laplaceB(i, j) + a * b * b - (kill + feed) * b) * 0.1

					newA = Math.min(Math.max(newA, 0), 1)
					newB = Math.min(Math.max(newB, 0), 1)

					tempNext[i][j].aNext = newA
					tempNext[i][j].bNext = newB

					const x = i - width / 2
					const y = j - height / 2
					const index = (i + j * width) * 2

					positions.set([x, y], index)

					const color = new THREE.Color()
					const c = Math.floor((newA - newB) * 1)
					color.setRGB(c, c, c)
					color.toArray(colors, index * 3)
				}
			}

			setGrid(tempNext)
			swap()
			points.current.geometry.attributes.position.needsUpdate = true
			points.current.geometry.attributes.color.needsUpdate = true
		},
		[grid, pointsBuffer, ColorBuffer, swap, datData, laplaceA, laplaceB],
	)

	useFrame(tick)

	return (
		<points ref={points}>
			<bufferGeometry attach="geometry">
				<bufferAttribute
					attach="attributes-position"
					count={pointsBuffer.length / 2}
					array={pointsBuffer}
					itemSize={2}
				/>
				<bufferAttribute attach="attributes-color" count={ColorBuffer.length / 3} array={ColorBuffer} itemSize={3} />
			</bufferGeometry>

			<pointsMaterial
				size={1}
				// color="#fff"
				// sizeAttenuation
				// depthWrite={false}
				vertexColors
			/>
		</points>
	)
}

const BogdanovMap = ({
	setBodyJSX,
}: {
	setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {
	const canvas = useRef<HTMLCanvasElement>(null)
	const stats = useRef<any>(null)

	const [datData, setDatData] = useState<DatData>({
		package: 'react-dat-gui',
		a: 1,
		b: 0.5,
		feed: 0.055,
		kill: 0.062,
	})

	useEffect(() => {
		setBodyJSX(
			<>
				<DatGui
					data={datData}
					onUpdate={(data: DatData) => {
						setDatData(data)
					}}
				>
					<DatNumber path="a" label="a" min={0} max={1} step={0.001} />
					<DatNumber path="b" label="b" min={0} max={1} step={0.001} />
					<DatNumber path="feed" label="feed" min={0} max={1} step={0.001} />
					<DatNumber path="kill" label="kill" min={0} max={1} step={0.001} />
				</DatGui>
				<div className={style.card}>
					<div className={style.desc}>
						ations in various fields, including physics, biology, and economics. It provides insights into complex
						systems and helps researchers understand the behavior of nonlinear dynamical systems.
					</div>
				</div>
			</>,
		)
	}, [datData, setBodyJSX])

	return (
		<>
			<div
				style={{
					position: 'fixed',
					zIndex: 999,
				}}
				ref={stats}
			>
				<Stats parent={stats} className="stats" />
			</div>
			<Canvas
				ref={canvas}
				className={style.canvas}
				camera={{
					position: [0, 0, -180],
					fov: 75,
					near: 0.1,
					far: 1000,
				}}
				onCreated={({ gl }) => {
					gl.setClearColor('white')
				}}
			>
				<OrbitControls makeDefault />
				<Points datData={datData} />
			</Canvas>
		</>
	)
}

export default BogdanovMap
