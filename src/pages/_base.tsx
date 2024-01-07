import { Line, OrbitControls, PointMaterial, Stats } from '@react-three/drei';
import type { RenderCallback, RootState } from '@react-three/fiber';
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from "react"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui-x';
import DatGui, { DatButton, DatFolder, DatNumber } from 'react-dat-gui';
import *  as THREE from "three";
import style from '../@scss/template.module.scss'
import MathJax from 'react-mathjax';
import { InlineMath, BlockMath } from 'react-katex';
import { Helmet } from "react-helmet";
import type { _XRFrame } from '@react-three/fiber/dist/declarations/src/core/utils';
import { renderToString } from 'react-dom/server';

const {
    sin,
    cos
} = Math

// type DatData = {
//     package: string,
//     a: number,
//     b: number,
//     c: number,
// }
//https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf


// const numParticles = 200_000;

export enum EDimensions {
    TWO_D = 2,
    THREE_D = 3
}

export interface TDatData {
    options: {
        [key: string]: {
            initialValue: number
            min: number
            max: number
            step?: number
        }
    },
    examples: { [key in keyof this['options']]: number }[],
}

export type TPointsProps<T,> = {
    datData: TDatData & { data?: T },
    tick: (
        positions: Float32Array,
        colors: Float32Array,
        datData: T,
        state: RootState,
        delta: number,
        frame?: _XRFrame) => void
    numParticles: number,
    dimension: EDimensions,
    pointSize?: number,
    description?: JSX.Element
}



const Points = <T,>({ datData, tick, numParticles = 200_000, dimension, pointSize }: TPointsProps<T>) => {
    const points = useRef<typeof points>();

    const pointsBuffer = new Float32Array(numParticles * dimension);
    const ColorBuffer = new Float32Array(numParticles * 3);

    // on every frame recalculates the position of every particle
    // and updates the attribute with the new values
    const loop: RenderCallback = (...args) => {
        if (!datData.data) {
            throw new Error('datData.data is undefined')
        }
        tick(pointsBuffer, ColorBuffer, datData.data, ...args)

        if (points?.current?.geometry?.attributes?.position) {
            points.current.geometry.attributes.position.needsUpdate = true;
        }
        if (points?.current?.geometry?.attributes?.color?.needsUpdate) {
            points.current.geometry.attributes.color.needsUpdate = true;
        }
    }

    useFrame(loop);
    return (

        <points ref={points}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={pointsBuffer.length / dimension}
                    array={pointsBuffer}
                    itemSize={dimension}

                />
                <bufferAttribute
                    attach='attributes-color'
                    count={ColorBuffer.length / 3}
                    array={ColorBuffer}
                    itemSize={3}

                />
            </bufferGeometry>

            <PointMaterial
                size={pointSize ?? 0.015}
                // color="#ef4d4d"
                // sizeAttenuation
                // depthWrite={false}
                vertexColors
            />

        </points>
    )

}

const Base = <T,>({ datData, tick, numParticles = 200_000, dimension, pointSize, setBodyJSX, description }:
    TPointsProps<T> & {
        setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
    }
) => {

    const canvas = useRef<HTMLCanvasElement>(null)
    const stats = useRef<any>(null)
    const [locked, setLocked] = useState(false)

    const [dD, setdD] = useState<T>({
        ...Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue])) as T
    })

    const descriptionJSX = useMemo(() => {
        return <>
            <DatGui data={{ ...dD, package: 'react-dat-gui' }} onUpdate={(data: T) => {
                setdD(data)
            }}>
                {
                    Object.entries(datData.options).map(([key, value]) => {
                        return <DatNumber key={key} path={key} label={key} min={value.min} max={value.max} step={value.step ?? 0.0001} />
                    })
                }
                <DatFolder closed={true} title="Examples">
                    {
                        datData.examples.map((example, i) => {
                            return <DatButton key={i} label={`Example ${i}`} onClick={() => {
                                setdD((old) => ({ ...old, ...example }))
                            }} />
                        })
                    }
                </DatFolder>

            </DatGui>
            <div className={style.card}>
                <div className={style.desc} >
                    {description && description}

                </div>
            </div>
        </>
    }, [dD, datData.options, datData.examples, description])


    useEffect(() => {
        if (locked) {
            return;
        }

        setLocked(true)
        setBodyJSX(
            descriptionJSX
        )
    }, [descriptionJSX, locked, setBodyJSX])

    const parentElementName = useMemo(() => {
        //current last opart oif the path
        const path = window.location.pathname.split('/')
        return path[path.length - 1]
    }, [])

    const SplitNameByCapital = useMemo(() => {
        return parentElementName.split(/(?=[A-Z])/).join(' ')
    }, [parentElementName])

    const descriptionToString = useMemo(() => {
        return renderToString(description ?? <></>)
    }, [description])

    const decocdeEntities = useMemo(() => {
        // convert html entities like &nsbp; to unicode
        const st = descriptionToString.replace(/&#(\d+);/g, '')
        return st
    }, [descriptionToString])

    const descriptionWithoutHTML
        = useMemo(() => {
            let st = decocdeEntities.replace(/(<([^>]+)>)/gi, "")
            // convert things like &nsbp; to spaces
            st = st.replace(/&[a-z]+;/g, " ")
            st = st.replace(/\u200B/g, '')
            console.log(st)
            return st
        }, [decocdeEntities])

    return (
        <>
            <Helmet>
                <title>{SplitNameByCapital}</title>
                <meta name="description" content={descriptionWithoutHTML} />
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
                <Points datData={{
                    ...datData,
                    data: dD
                }} tick={tick} numParticles={numParticles} dimension={dimension} pointSize={pointSize} />
            </Canvas>
        </>
    )

}

Base.whyDidYouRender = true

export default Base