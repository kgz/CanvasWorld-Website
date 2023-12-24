import { CameraControls } from "@react-three/drei";
import { OrbitControls, Stats } from '@react-three/drei';
import type { RenderCallback } from '@react-three/fiber';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';
import *  as THREE from "three";
import style from '../@scss/template.module.scss'
import { useAppDispatch, useAppSelector } from "../@store/store";
import { SetMenuOpen } from "../@store/webSiteState.slice";
import Menu from "../modules/Menu";
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
    const [datDataCache, setDatDataCache] = useState<DatData>(datData)

    const pointsBuffer = useMemo(() => {
        // Create a Float32Array of count*3 length
        // -> we are going to generate the x, y, and z values for 2000 particles
        // -> thus we need 6000 items in this array
        const positions = new Float32Array(numParticles * 2);
        let x = 1, y = 1;
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

        let x = 1, y = 1;
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

            const color = new THREE.Color()
            color.setRGB(255, 119, 0)
            colors.set([color.r, color.g, color.b], i * 3);
        }


        // foreach(time.scene[2].geometry.)

        // Update the attribute with the new positions
        // if (points.current) {
        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.geometry.attributes.color.needsUpdate = true;
        // }
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


const BedheadAttractor = () => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)

    const [datData, setDatData] = useState<DatData>({
        package: 'react-dat-gui',
        a: 0.65343,
        b: 0.7345345,
    })

    const dispatch = useAppDispatch()
    const { menuOpen } = useAppSelector(state => state.webSiteState)

    return (
        <>
            <div className={style.body}>
                <Menu>
                    <div className={style.card}>
                        <div className={style.desc} >
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                        </div>
                    </div>
                    <DatGui data={datData} onUpdate={(data: DatData) => {
                        setDatData(data)
                    }}>
                        <DatNumber path="a" min={-1} max={1} step={0.0001} key={'a'} />
                        <DatNumber path="b" min={-1} max={1} step={0.0001} />
                    </DatGui>
                </Menu>

            </div>

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
                }



            >
                <OrbitControls makeDefault



                />

                {/* <ambientLight /> */}
                {/* <pointLight position={[10, 10, 10]} /> */}
                <Points datData={datData} />
            </Canvas>

        </>
    )

}

BedheadAttractor.bodyBlock = () => (
    <div>
        test
    </div>
)

export default BedheadAttractor
