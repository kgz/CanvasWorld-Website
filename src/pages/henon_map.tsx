import { Line, OrbitControls, PointMaterial, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatButton, DatNumber } from 'react-dat-gui';
import *  as THREE from "three";
import style from '../@scss/template.module.scss'
import MathJax from 'react-mathjax';
import { InlineMath, BlockMath } from 'react-katex';
import { Helmet } from "react-helmet";

const {
    sin,
    cos
} = Math

type DatData = {
    package: string,
    a: number,
    b: number,

}


const numParticles = 200_000;
const Points = ({ datData }: { datData: DatData }) => {
    const points = useRef<typeof points>();

    const pointsBuffer = new Float32Array(numParticles * 2);
    const ColorBuffer = new Float32Array(numParticles * 3);

    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const tick: RenderCallback = () => {
        const positions = pointsBuffer;
        const colors = ColorBuffer;
        const { a, b } = datData
        let x = 0.03, y = 0.01;
        for (let i = 0; i < numParticles; i++) {

            const xn = -(x * x) + b * y + a
            const yn = x
            x = xn
            y = yn

            positions.set([x * 10, y * 10], i * 2);

            const color = new THREE.Color()
            const percent = (sin(i) / 255) * 255
            // map percent from 0 to 255 to 0 to 1
            color.setHSL(sin(i), 1, 0.5)
            colors.set([color.r, color.g, color.b], i * 3)
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

            <PointMaterial
                size={0.015}
                // color="#ef4d4d"
                // sizeAttenuation
                // depthWrite={false}
                vertexColors
            />

        </points>
    )

}


const HenonMap = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 1.4,
        b: 0.3,
    })

    useEffect(() => {
        setBodyJSX(
            <>
                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path='a' label='a' min={0} max={2} step={0.001} />
                    <DatNumber path='b' label='b' min={0} max={2} step={0.001} />
                    <DatButton label="Reset" onClick={() => {
                        setDatData({
                            package: 'react-dat-gui',
                            a: 1.4,
                            b: 0.3,
                        })
                    }} />

                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >

                        The Henon map is a discrete-time dynamical system. <br /><br />
                        It is a prototypical example of chaotic system that exhibits the phenomenon of strange attractors. <br /><br />
                        It was introduced by Michel Hénon in 1976, while studying the Lorenz attractor map. <br />
                        The Hénon map arises from a simplification of the Lorenz system. <br /><br />
                        The Hénon map is area-preserving and exhibits chaotic behavior for certain values of its parameters. <br /><br />
                        <MathJax.Provider>
                            Definition:
                            <BlockMath math="x_{n + 1} = 1 - a x_n^2 + y_n" />
                            <BlockMath math="y_{n + 1} = b x_n" />
                            Limits:
                            <BlockMath math="a, b \in [0, 2]" />
                        </MathJax.Provider>




                    </div>


                </div>
            </>
        )
    }, [datData, setBodyJSX])

    return (
        <>
            <Helmet>
                <title>Gumowski-Mira Attractor</title>
                <meta name="description" content="Gumowski-Mira Attractor" />
                <meta name="keywords" content="Gumowski-Mira Attractor" />
            </Helmet>
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
                        position: [0, 0, -35],
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

export default HenonMap
