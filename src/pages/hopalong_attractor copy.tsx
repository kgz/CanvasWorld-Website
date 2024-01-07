import { Line, OrbitControls, PointMaterial, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatButton, DatFolder, DatNumber } from 'react-dat-gui';
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
}
//https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf


const numParticles = 200_000;
const Points = ({ datData }: { datData: DatData }) => {
    const points = useRef<typeof points>();

    const pointsBuffer = new Float32Array(numParticles * 2);
    const ColorBuffer = new Float32Array(numParticles * 3);

    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const tick: RenderCallback = (state) => {
        const positions = pointsBuffer;
        const colors = ColorBuffer;
        const { a, b, c } = datData

        const frame = state.clock.getElapsedTime() * 0.1
        let x = 0.03, y = 0.01;
        for (let i = 0; i < numParticles; i++) {

            const xn = y - 1 - Math.sqrt(Math.abs(b * x - c)) * Math.sign(x - 1)
            const yn = a - x - 1
            x = xn
            y = yn

            positions.set([x * 1, y * 1], i * 2);


            const h = Math.sqrt(x ** 2 + y ** 2)

            const color = new THREE.Color()

            //colorI should be an int that increases every 5000 iterations
            const colorI = Math.floor(i / 1000)

            // map percent from 0 to 255 to 0 to 1
            color.setHSL(0.8 + (colorI / (255 * 0.2)), 1, 0.5)
            colors.set([color.r, color.g, color.b], i * 3)
        }
        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.geometry.attributes.color.needsUpdate = true;
    }

    useFrame(tick);

    // soh
    // tah
    // toa



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


const HopalongAttractor = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 1.4,
        b: 5.157895,
        c: 2.736842
    })

    useEffect(() => {
        setBodyJSX(
            <>
                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path='a' label='a' min={-20} max={20} step={0.000001} />
                    <DatNumber path='b' label='b' min={-20} max={20} step={0.000001} />
                    <DatNumber path='c' label='c' min={-20} max={20} step={0.000001} />
                    <DatFolder closed={true} title="Examples">
                        <DatButton label="Example A" onClick={() => { setDatData((old) => ({ ...old, a: 1.4, b: 5.157895, c: 2.736842 })) }} />
                        <DatButton label="Example B" onClick={() => { setDatData((old) => ({ ...old, a: -11, b: 0.3, c: -0.5 })) }} />
                        <DatButton label="Example C" onClick={() => { setDatData((old) => ({ ...old, a: 1.4, b: 5.157895, c: -4.561404 })) }} />
                    </DatFolder>

                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >

                        The Hopalong Attractor is a fractal also known as the "Skull Attractor" or "Martin's Attractor".
                        <br />
                        <br />
                        It was discovered by Barry Martin in 1981 and at the core is just a modified simple ellipse.
                        <br />
                        <br />
                        <MathJax.Provider>
                            Definition:
                            <BlockMath math="x_{n+1} = y_n - sign(x_n) \sqrt{|b x_n - c|}" />
                            <BlockMath math="y_{n+1} = a - x_n - 1" />
                            Limits:
                            <BlockMath math="a, b, c \in [-20, 20]" />

                        </MathJax.Provider>
                        <br />







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
                        position: [0, 0, -95],
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

export default HopalongAttractor
