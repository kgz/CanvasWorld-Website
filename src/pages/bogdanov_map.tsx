import { OrbitControls, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatNumber } from 'react-dat-gui';
import *  as THREE from "three";
import style from '../@scss/template.module.scss'
import MathJax from 'react-mathjax';
import { InlineMath, BlockMath } from 'react-katex';

const {
    sin,
    cos
} = Math

type DatData = {
    package: string,
    a: number,
    b: number,

}


const numParticles = 420_000;

const Points = ({ datData }: { datData: DatData }) => {
    const points = useRef<typeof points>();
    const [datDataCache, setDatDataCache] = useState<DatData>(datData)

    const pointsBuffer = useMemo(() => {
        // Create a Float32Array of count*3 length
        // -> we are going to generate the x, y, and z values for 2000 particles
        // -> thus we need 6000 items in this array
        const positions = new Float32Array(numParticles * 2);
        let x = 0.1, y = 0;
        for (let i = 0; i < numParticles; i++) {
            // Generate random values for x, y, and z on every loop
            // const x = 1
            // const y = 1
            // const z = 0

            // positions.set([x, y, z], i * 3);

            const xnew = sin(x * y / datData.b) * y + cos(datData.a * x - y)
            const ynew = x + sin(y) / datData.b

            x = xnew
            y = ynew

            positions.set([x, y], i * 2);
        }

        return positions;
    }, [datData.a, datData.b]);

    const ColorBuffer = useMemo(() => {
        // Create a Float32Array of count*3 length
        // -> we are going to generate the x, y, and z values for 2000 particles
        // -> thus we need 6000 items in this array
        const colors = new Float32Array(numParticles * 3);

        const genRandomWithMaxAndMin = (max: number, min: number) => {
            return Math.random() * (max - min) + min;
        }


        for (let i = 0; i < numParticles; i++) {
            // Generate random values for x, y, and z on every loop



            // We add the 3 values to the attribute array for every loop
            // We add the 3 values to the attribute array for every loop
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const c = new THREE.Color()



            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            // c.setRGB(Math

            // const r = Math.sin(i * 0.01) * 0.5 + 0.5;
            // const g = Math.cos(i * 0.01) * 0.5 + 0.5;
            // const b = Math.tan(i * 0.01) * 0.5 + 0.5;
            colors.set([255, 255, 255], i * 3);

        }

        return colors;
    }, []);

    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const tick: RenderCallback = (time, delta, frame) => {
        // console.log(internal.frames)
        // console.log(points)
        // if (time.gl.info.render.frame % 5 !== 0) {
        //     return
        // }

        // if (
        //     datData.a === datDataCache.a &&
        //     datData.b === datDataCache.b
        // ) {
        //     console.log('no change')
        //     return
        // }

        setDatDataCache(datData)
        const positions = pointsBuffer;
        const colors = ColorBuffer;

        let x = 0.1, y = 0;
        for (let i = 0; i < numParticles; i++) {
            const nx = (x + y + datData.a * y + datData.b * x * (x - 1) - 0.1 * x * y)
            const ny = (y + datData.a * y + datData.b * x * (x - 1) - 0.1 * x * y)

            x = nx
            y = ny

            positions.set([x * 5, y * 5], i * 2);

            const color = new THREE.Color()
            // stroke(color("hsl(" + ((Math.round(x*50 * y*50 ) % opts.colorRange) + (360 - opts.colorRange))+ ", 100%, 50%)"))

            color.setHSL((Math.round(i) % 360) / 360, 1, 0.5)
            colors.set([color.r, color.g, color.b], i * 3);
        }

        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.geometry.attributes.color.needsUpdate = true;
    }

    useFrame(tick);


    return (

        <points ref={points}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={pointsBuffer.length / 2}
                    array={pointsBuffer}
                    itemSize={2}
                />
                <bufferAttribute
                    attach='attributes-color'
                    count={ColorBuffer.length / 3}
                    array={ColorBuffer}
                    itemSize={3}

                />
            </bufferGeometry>

            <pointsMaterial
                size={0.015}
                // color="#fff"
                // sizeAttenuation
                // depthWrite={false}
                vertexColors={true}
            />

        </points>
    )

}


const BogdanovMap = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 0.0025,
        b: 1.44,
    })

    useEffect(() => {
        setBodyJSX(
            <>

                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path="a" min={0} max={0.01} step={0.0001} key={'a'} />
                    <DatNumber path="b" min={0.5} max={2.5} step={0.01} />
                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >
                        The Bogdanov map is a mathematical model that describes a discrete dynamical system.
                        It is named after its discoverer, Boris Bogdanov.
                        The map is often used to study chaotic behavior in nonlinear systems.
                        <br />
                        <br />

                        The Bogdanov map is defined by the following equations:
                        <br />
                        <InlineMath math={'x(n+1) = y(n) + 1 - a * x(n)^2'} />
                        <br />
                        <InlineMath math={'y(n+1) = b * x(n)'} />
                        <br />
                        <br />
                        Limits:
                        <br />
                        <InlineMath math="a \in [0, 0.01]" />
                        <br />
                        <InlineMath math="b \in [0.5, 2.5]" />
                        <br />
                        <br />
                        Here, x(n) and y(n) represent the state variables at time step n. The parameters a and b are constants that determine the behavior of the system.

                        The map exhibits interesting dynamics depending on the values of a and b.
                        <br />
                        <br />
                        It can display periodic behavior, stable fixed points, or chaotic trajectories. The chaotic behavior arises when the system is sensitive to initial conditions, meaning small changes in the initial state can lead to significantly different outcomes.
                        <br />
                        <br />

                        The Bogdanov map has applications in various fields, including physics, biology, and economics. It provides insights into complex systems and helps researchers understand the behavior of nonlinear dynamical systems.
                    </div>
                </div>
            </>
        )
    }, [datData, setBodyJSX])

    return (
        <>
            <div style={{
                position: "fixed",
                zIndex: 999
            }}
                ref={stats}
            >
                <Stats parent={stats} className="stats" />
            </div>
            <Canvas
                ref={canvas}
                className={style.canvas}
                camera={
                    {
                        position: [0, 0, -3],
                        fov: 75,
                        near: 0.1,
                        far: 1000,

                    }
                }>
                <OrbitControls makeDefault />
                <Points datData={datData} />
            </Canvas>

        </>
    )

}

export default BogdanovMap
