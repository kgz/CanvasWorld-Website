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
    x: number,
    y: number,
    a: number,
    b: number,
    mu: number,
}

const G = (x: number, mu: number) => {
    return mu * x + 2 * (1 - mu) * x ** 2 / (1.0 + x ** 2)
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
        let { x, y } = datData
        const { a, b, mu } = datData
        for (let i = 0; i < numParticles; i++) {

            const xn = y + a * (1 - b * y ** 2) * y + G(x, mu)
            const yn = -x + G(xn, mu)
            x = xn
            y = yn

            positions.set([x, y], i * 2);
        }
        points.current.geometry.attributes.position.needsUpdate = true;
        // points.current.geometry.attributes.color.needsUpdate = true;
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
                {/* <bufferAttribute
                    attach='attributes-color'
                    count={ColorBuffer.length / 3}
                    array={ColorBuffer}
                    itemSize={3}

                /> */}
            </bufferGeometry>

            <PointMaterial
                size={0.015}
                color="#ef4d4d"
            // sizeAttenuation
            // depthWrite={false}
            // vertexColors
            />

        </points>
    )

}


const GumowskiMiraAttractor = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        x: 0.723135391715914,
        y: -0.327585775405169,
        a: 0,
        b: -0.211,
        mu: -0.228
    })

    useEffect(() => {
        setBodyJSX(
            <>
                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path='x' label='x' min={-20} max={20} step={0.0001} />
                    <DatNumber path='y' label='y' min={-20} max={20} step={0.0001} />
                    <DatNumber path='a' label='a' min={-1} max={1} step={0.001} />
                    <DatNumber path='b' label='b' min={-1} max={1} step={0.001} />
                    <DatNumber path='mu' label='μ' min={-1} max={1} step={0.001} />

                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >


                        The Gumowski-Mira Attractor is a mathematical model that describes the behavior of a dynamic system.
                        <br /><br />
                        It is often used in chaos theory and fractal geometry to generate visually interesting patterns. The equations in the code represent the iterative formulas for calculating the next values of the variables x and y in the Gumowski-Mira Attractor.
                        <br /><br />These equations involve parameters a, b, and μ, which determine the shape and characteristics of the attractor.
                        <br /><br /> By varying these parameters, you can create different visual patterns and explore the complex dynamics of the system.
                        <br />
                        <br />
                        <MathJax.Provider>
                            Definition:
                            <BlockMath math={`x_{n+1} = y_n + a(1 - b y_n^2)y_n + G(x_n, \\mu)`} />
                            <BlockMath math={`y_{n+1} = -x_n + G(x_{n+1}, \\mu)`} />
                            Where: <BlockMath math={`G(x, \\mu) = \\mu x + 2(1 - \\mu) \\frac{x^2}{1 + x^2}`} />

                            Limits:
                            <BlockMath math="x, y \in [-20, 20]" />
                            <BlockMath math="a, b,\mu \in [-1, 1]" />
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

export default GumowskiMiraAttractor
