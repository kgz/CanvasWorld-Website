import { CameraControls } from "@react-three/drei";
import { OrbitControls, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';
import *  as THREE from "three";


type DatData = {
    package: string,
    a: number,
    b: number,
}


const numParticles = 220000;

const Points = ({ datData }: { datData: DatData }) => {



    const points = useRef<typeof points>();

    const pointsBuffer = useMemo(() => {
        // Create a Float32Array of count*3 length
        // -> we are going to generate the x, y, and z values for 2000 particles
        // -> thus we need 6000 items in this array
        const positions = new Float32Array(numParticles * 3);

        for (let i = 0; i < numParticles; i++) {
            // Generate random values for x, y, and z on every loop
            const x = i
            const y = i
            const z = 0

            positions.set([x, y, z], i * 3);
        }

        return positions;
    }, []);

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

            const r = Math.sin(i * 0.01) * 0.5 + 0.5;
            const g = Math.cos(i * 0.01) * 0.5 + 0.5;
            const b = Math.tan(i * 0.01) * 0.5 + 0.5;
            colors.set([r, g, b], i * 3);

        }

        return colors;
    }, []);


    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const tick: RenderCallback = (time, delta, frame) => {
        // console.log(internal.frames)
        // console.log(points)
        if (time.gl.info.render.frame % 5 !== 0) {
            return
        }
        const positions = pointsBuffer;
        const colors = points.current.geometry.attributes.color.array;

        for (let i = 0; i < numParticles; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const { a, b } = datData
            const newX = Math.sin(x * y / b) * y + Math.cos(a * x - y)
            const newy = x + Math.sin(y) / b

            positions[i * 3] = newX;
            positions[i * 3 + 1] = newy;

        }


        // foreach(time.scene[2].geometry.)

        // Update the attribute with the new positions
        // if (points.current) {
        points.current.geometry.attributes.position.needsUpdate = true;
        // }
    }

    useFrame(tick);


    return (

        <points ref={points}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={pointsBuffer.length / 3}
                    array={pointsBuffer}
                    itemSize={4}
                />
                <bufferAttribute
                    attach='attributes-color'
                    count={ColorBuffer.length / 3}
                    array={ColorBuffer}
                    itemSize={4}

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


const BedheadAttractor = () => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 1.3,
        b: 3.7,
    })



    return (
        <>
            <div style={{
                position: "fixed",
                top: 0,
                right: 0,
                zIndex: 999
            }} >
                <DatGui data={datData} onUpdate={(data: DatData) => {
                    setDatData(data)
                }}>
                    <DatNumber path="a" min={0} max={20} step={0.0001} key={'a'} />
                    <DatNumber path="b" min={0} max={20} step={0.0001} />
                </DatGui>

            </div>
            <div style={{
                position: "fixed",
                top: 0,
                left: 300,
                zIndex: 999
            }}

                ref={stats}
            >
                asdf
                <Stats showPanel={0} parent={stats} className="stats" />
            </div>
            <Canvas
                ref={canvas}
                style={{
                    height: "100%",
                    width: "100%",
                    background: "#000"
                }}

            >
                <OrbitControls makeDefault />

                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Points datData={datData} />
            </Canvas>
        </>
    )

}

export default BedheadAttractor
