import { OrbitControls, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatNumber } from 'react-dat-gui';
import *  as THREE from "three";
import style from '../@scss/template.module.scss'
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


const numParticles = 220_000;

const Points = ({ datData }: { datData: DatData }) => {
    const points = useRef<typeof points>();

    const pointsBuffer = useMemo(() => {
        const positions = new Float32Array(numParticles * 2);
        let x = 1, y = 1;
        for (let i = 0; i < numParticles; i++) {
            const xnew = sin(x * y / datData.b) * y + cos(datData.a * x - y)
            const ynew = x + sin(y) / datData.b

            x = xnew
            y = ynew

            positions.set([x, y], i * 2);
        }

        return positions;
    }, [datData.a, datData.b]);

    const ColorBuffer = useMemo(() => {
        const colors = new Float32Array(numParticles * 3);
        for (let i = 0; i < numParticles; i++) {
            colors.set([47, 161, 214], i * 3);
        }

        return colors;
    }, []);

    const tick: RenderCallback = () => {
        const positions = pointsBuffer;
        const colors = ColorBuffer;
        let x = 1, y = 1;
        for (let i = 0; i < numParticles; i++) {
            const xnew = sin(x * y / datData.b) * y + cos(datData.a * x - y)
            const ynew = x + sin(y) / datData.b
            x = xnew
            y = ynew
            positions.set([x, y], i * 2);

            const color = new THREE.Color()
            color.setRGB(47, 161, 214)
            colors.set([color.r, color.g, color.b], i * 3);
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

            <pointsMaterial
                size={0.015}
                color="#2fa1d6"
                // sizeAttenuation
                // depthWrite={false}
                // vertexColors={true}
            />

        </points>
    )

}


const BedheadAttractor = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 0.65343,
        b: 0.7345345,
    })

    useEffect(() => {
        setBodyJSX(
            <>

                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path="a" min={-1} max={1} step={0.0001} />
                    <DatNumber path="b" min={-1} max={1} step={0.0001} />
                </DatGui>
                <div className={style.card}>
                    <div className={style.desc} >
                        Cannot actually find any information on this attractor, but it looks cool.
                        <br />
                        <br />
                        <InlineMath math="x(n+1) = sin(x*y/b) * y + cos(a*x - y)" />
                        <br />
                        <br />
                        <InlineMath math="y(n+1) = x + sin(y)/b" />
                        <br />
                        <br />
                        Limits:
                        <br />
                        <InlineMath math="a, b \in [-1, 1]" />

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
                        position: [0, 0, -10],
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

export default BedheadAttractor
