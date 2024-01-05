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
    c: number,
    d: number,
}



const numParticles = 300_000;
const Points = ({ datData }: { datData: DatData }) => {
    const points = useRef<typeof points>();

    const pointsBuffer = new Float32Array(numParticles * 2);
    const ColorBuffer = new Float32Array(numParticles * 3);

    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const tick: RenderCallback = () => {
        const positions = pointsBuffer;
        const colors = ColorBuffer;

        let x = -2, y = -2;
        const { a, b, c, d } = datData

        for (let i = 0; i < numParticles; i++) {
            const nx = Math.sin(b * y) + c * Math.sin(b * x)
            const ny = Math.sin(a * x) + d * Math.sin(a * y)

            x = nx
            y = ny

            positions.set([x * 5, y * 5], i * 2);

            const color = new THREE.Color()
            // const percent = (sin(x + y) / 255) * 255
            // map percent from 0 to 255 to 0 to 1

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
                color="#0f87b3"
            // sizeAttenuation
            // depthWrite={false}
            // vertexColors
            />

        </points>
    )

}


const FractalDreamAttractor = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 1.1,
        b: 2.7640000000000002,
        c: 1.07,
        d: 1.561,

    })

    useEffect(() => {
        setBodyJSX(
            <>
                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path="a" min={-0} max={3} step={0.01} />
                    <DatNumber path="b" min={-0} max={3} step={0.01} />
                    <DatNumber path="c" min={-0} max={3} step={0.01} />
                    <DatNumber path="d" min={-0} max={3} step={0.01} />
                    <DatButton label="Reset" onClick={() => {
                        setDatData({
                            package: 'react-dat-gui',
                            a: 1.1,
                            b: 2.7640000000000002,
                            c: 1.073,
                            d: 1.561,
                        })
                    }} />
                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >
                        The Clifford Attractor is a 2D strange attractor.<br /><br />

                        It is characterized by two iterative equations that determine the x and y coordinates of discrete steps in the path of a particle across a 2D space. <br />The starting point (x0, y0) and the values of four parameters (a, b, c, d) influence the shape of the attractor.<br /><br />

                        It is named after Clifford Pickover, who described it in his book Chaos in Wonderland (1994).
                        <br /><br />
                        Definition: <br />
                        <MathJax.Provider>
                            <BlockMath math={`x_{n+1} = sin(a * y_n) + c * cos(a * x_n)`} />
                            <BlockMath math={`y_{n+1} = sin(b * x_n) + d * cos(b * y_n)`} />
                        </MathJax.Provider>
                        <br />
                        Limits: <br />
                        <InlineMath math="a,b,c,d \in [-3, 3]" />





                    </div>


                </div>
            </>
        )
    }, [datData, setBodyJSX])

    return (
        <>
            <Helmet>
                <title>Fractal Dream Attractor</title>
                <meta name="description" content="Fractal Dream Attractor" />
                <meta name="keywords" content="Fractal Dream Attractor" />
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
                        position: [0, 0, -20],
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

export default FractalDreamAttractor
