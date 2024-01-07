import type { RootState } from '@react-three/fiber';
import *  as THREE from "three";
import type { TDatData, TPointsProps } from './_base';
import Base, { EDimensions } from './_base';
import { InlineMath, BlockMath } from 'react-katex';

const HopalongAttractor = ({
    setBodyJSX
}: {
    setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {
    const datData: TDatData = {
        options: {
            a: {
                initialValue: 1.4,
                min: -20,
                max: 20,
                step: 0.000001
            },
            b: {
                initialValue: 5.157895,
                min: -20,
                max: 20,
                step: 0.000001
            },
            c: {
                initialValue: 2.736842,
                min: -20,
                max: 20,
                step: 0.000001
            },
        },
        examples: [
            {
                a: 1.4,
                b: 5.157895,
                c: 2.736842
            },
            {
                a: -11,
                b: 0.3,
                c: -0.5
            },
            {
                a: 1.4,
                b: 5.157895,
                c: -4.561404
            }
        ]
    } as const

    type TData = {
        [key in keyof typeof datData.options]: typeof datData['options'][key]['initialValue']
    }

    const tick: TPointsProps<TData>['tick'] = (
        positions: Float32Array,
        colors: Float32Array,
        datData: TData,
        state: RootState,
        delta: number,
        frame?: XRFrame | undefined
    ) => {
        const { a, b, c } = datData
        let x = 0.03, y = 0.01;
        for (let i = 0; i < positions.length / 2; i++) {
            const xn = y - 1 - Math.sqrt(Math.abs(b * x - c)) * Math.sign(x - 1)
            const yn = a - x - 1
            x = xn
            y = yn
            positions.set([x * 1, y * 1], i * 2);
            const color = new THREE.Color()
            const colorI = Math.floor(i / 1000)
            color.setHSL(0.8 + (colorI / (255 * 0.2)), 1, 0.5)
            colors.set([color.r, color.g, color.b], i * 3)
        }

        return { positions, colors }
    }

    return (
        <Base<TData>
            setBodyJSX={setBodyJSX}
            datData={datData}
            dimension={EDimensions.TWO_D}
            numParticles={200_000}
            tick={tick}
            pointSize={0.5}
            description={<>
                The Hopalong Attractor is a fractal also known as the "Skull Attractor" or "Martin's Attractor".
                <br />
                <br />
                It was discovered by Barry Martin in 1981 and at the core is just a modified simple ellipse.
                <br />
                <br />
                Definition:
                <BlockMath math="x_{n+1} = y_n - sign(x_n) \sqrt{|b x_n - c|}" />
                <BlockMath math="y_{n+1} = a - x_n - 1" />
                Limits:
                <BlockMath math="a, b, c \in [-20, 20]" />

                <br />
            </>}
        />
    )

}

export default HopalongAttractor
