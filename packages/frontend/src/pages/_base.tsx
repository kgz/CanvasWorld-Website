import { OrbitControls, PointMaterial, Stats } from '@react-three/drei'
import type { RenderCallback } from '@react-three/fiber'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import style from '../@scss/template.module.scss'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { EDimensions, ERenderMode, type TPointsProps, type TParticleProps, type TShaderProps } from '../@types/gui'
import { isScreenshotMode, markScreenshotReady } from '../modules/screenshotMode'

const tagVizCanvas = (canvas: HTMLCanvasElement) => {
  canvas.id = 'cw-viz-canvas'
  canvas.dataset.cwViz = '1'
}

// ------------------------------------------------------------
// Particle Points Renderer
// ------------------------------------------------------------
const Points = <T,>({
  tick,
  numParticles,
  dimension,
  pointSize,
  singleColor,
  colorAlpha = false
}: TParticleProps<T>) => {
  const points = useRef<THREE.Points>(null)
  const readySent = useRef(false)

  const positions = useMemo(() => new Float32Array(numParticles * dimension), [numParticles, dimension])
  const colors = useMemo(() => new Float32Array(numParticles * (colorAlpha ? 4 : 3)), [numParticles, colorAlpha])

  const loop: RenderCallback = (state, delta) => {
    tick(positions, colors, state, delta)

    const geo = points.current?.geometry
    if (geo?.attributes.position) geo.attributes.position.needsUpdate = true
    if (geo?.attributes.color) geo.attributes.color.needsUpdate = true

    if (!readySent.current && isScreenshotMode()) {
      readySent.current = true
      // next paint after buffer update
      requestAnimationFrame(() => markScreenshotReady())
    }
  }

  useFrame(loop)

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / dimension} array={positions} itemSize={dimension} />
        {!singleColor && (
          <bufferAttribute attach="attributes-color" count={colors.length / (colorAlpha ? 4 : 3)} array={colors} itemSize={colorAlpha ? 4 : 3} />
        )}
      </bufferGeometry>
      <PointMaterial size={pointSize ?? 0.015} color={singleColor ?? new THREE.Color(0xffffff)} vertexColors={!singleColor} />
    </points>
  )
}

// ------------------------------------------------------------
// Shader fullscreen plane
// ------------------------------------------------------------
const ShaderPlane = ({ vertexShader, fragmentShader, uniforms }: TShaderProps) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { gl, size, camera } = useThree()
  const readySent = useRef(false)

  // Lock zoom for orthographic fractal mode
  useFrame(() => {
    camera.zoom = 1
    camera.updateProjectionMatrix()
  })

  // Resize uniform
  useEffect(() => {
    const mat = materialRef.current
    if (mat?.uniforms?.u_resolution) {
      const w = size.width * gl.getPixelRatio()
      const h = size.height * gl.getPixelRatio()
      if (w > 0 && h > 0) mat.uniforms.u_resolution.value.set(w, h)
    }
    return () => {}
  }, [size.width, size.height, gl])

  // CRITICAL: Force uniforms update every frame (same pattern that worked in test)
  useFrame(() => {
    const mat = materialRef.current
    if (mat && mat.uniforms) {
      // Force Three.js to upload uniforms to GPU and re-render
      mat.uniformsNeedUpdate = true
      mat.needsUpdate = true

      if (!readySent.current && isScreenshotMode()) {
        readySent.current = true
        requestAnimationFrame(() => markScreenshotReady())
      }
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <rawShaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ------------------------------------------------------------
// SIMPLE TEST: Two squares, one moves on scroll
// ------------------------------------------------------------
const TestShaderPlane = ({ uniforms, onScroll }: { uniforms: { u_offset: { value: THREE.Vector2 }, u_resolution: { value: THREE.Vector2 } }, onScroll: (delta: number) => void }) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { gl, size } = useThree()

  // Update resolution uniform
  useEffect(() => {
    if (uniforms.u_resolution) {
      const w = size.width * gl.getPixelRatio()
      const h = size.height * gl.getPixelRatio()
      uniforms.u_resolution.value.set(w, h)
      console.log('📐 Resolution set to:', w, h)
    }
  }, [size.width, size.height, gl, uniforms])

  // Force uniforms update every frame
  useFrame(() => {
    const mat = materialRef.current
    if (mat) {
      mat.uniformsNeedUpdate = true
      
      // Debug: log uniform value occasionally AND check if it matches material's uniform
      if (mat.userData.debugFrame === undefined) mat.userData.debugFrame = 0
      mat.userData.debugFrame++
      if (mat.userData.debugFrame % 60 === 0) {
        const jsUniform = uniforms.u_offset?.value
        const matUniform = mat.uniforms?.u_offset?.value
        console.log('📊 Test shader uniform check:', {
          jsValue: jsUniform ? `${jsUniform.x.toFixed(4)}, ${jsUniform.y.toFixed(4)}` : 'null',
          matValue: matUniform ? `${matUniform.x.toFixed(4)}, ${matUniform.y.toFixed(4)}` : 'null',
          sameObject: jsUniform === matUniform,
          uniformsNeedUpdate: mat.uniformsNeedUpdate
        })
      }
    }
  })

  // Listen for scroll events - use window instead of canvas
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY
      console.log('🖱️ WHEEL EVENT caught in TestShaderPlane, delta:', delta)
      onScroll(delta)
    }

    // Listen on window to catch all scroll events
    window.addEventListener('wheel', handleWheel, { passive: false })
    console.log('✅ TestShaderPlane: Wheel listener attached')
    return () => {
      window.removeEventListener('wheel', handleWheel)
      console.log('❌ TestShaderPlane: Wheel listener removed')
    }
  }, [onScroll])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <rawShaderMaterial
        ref={materialRef}
        vertexShader={`
          attribute vec3 position;
          varying vec2 vUv;
          void main() {
            vUv = position.xy * 0.5 + 0.5;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision mediump float;
          uniform vec2 u_offset;
          uniform vec2 u_resolution;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            
            // First square: fixed position (red, bottom-left)
            vec2 square1 = step(vec2(0.1), uv) * step(uv, vec2(0.3));
            float sq1 = square1.x * square1.y;
            
            // Second square: moves with u_offset (green, center)
            // Make it more visible and show offset value
            vec2 square2Pos = vec2(0.5, 0.5) + u_offset * 2.0;
            vec2 square2 = step(square2Pos - vec2(0.15), uv) * step(uv, square2Pos + vec2(0.15));
            float sq2 = square2.x * square2.y;
            
            // Show offset as background gradient for debugging
            vec3 bgColor = vec3(0.1 + u_offset.x * 0.5, 0.1, 0.1);
            
            vec3 color = bgColor;
            if (sq1 > 0.5) {
              color = vec3(1.0, 0.0, 0.0); // Red square (fixed)
            } else if (sq2 > 0.5) {
              color = vec3(0.0, 1.0, 0.0); // Green square (moves)
            }
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ------------------------------------------------------------
// Base wrapper
// ------------------------------------------------------------
const Base = <T,>(props: TPointsProps<T>) => {
  const isShaderMode = props.renderMode === ERenderMode.SHADER
  const canvas = useRef<HTMLCanvasElement>(null)
  const stats = useRef<any>(null)
  const screenshot = isScreenshotMode()

  useEffect(() => {
    if (!isShaderMode && 'setCanvasRef' in props && props.setCanvasRef) {
      props.setCanvasRef(canvas)
    }
    return () => {}
  }, [isShaderMode, props])

  const isIframe = new URLSearchParams(window.location.search).get('iframe') !== null
  const page = window.location.pathname.split('/').pop() || ''
  const title = page.split(/(?=[A-Z])/).join(' ')
  const showHud = !isIframe && !screenshot

  const description = useMemo(() => {
    const desc = 'description' in props ? props.description : undefined
    return desc || `Interactive visualization of ${title}`
  }, [props, title])

  // Shader mode - use actual shader if uniforms provided, otherwise test
  if (isShaderMode && 'vertexShader' in props && 'fragmentShader' in props && 'uniforms' in props) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Canvas
          camera={('cameraPosition' in props && props.cameraPosition) ? { position: props.cameraPosition } : { position: [0, 0, 1], fov: 75 }}
          dpr={window.devicePixelRatio}
          style={{ width: '100%', height: '100vh', background: '#000' }}
          onCreated={({ gl }) => tagVizCanvas(gl.domElement)}
        >
          <ShaderPlane 
            vertexShader={props.vertexShader}
            fragmentShader={props.fragmentShader}
            uniforms={props.uniforms}
          />
          {showHud && <Stats />}
        </Canvas>
      </>
    )
  }

  // TEST MODE: Simple two squares (for debugging uniform updates)
  if (isShaderMode) {
    const [offset, setOffset] = useState([0, 0])
    
    const testUniforms = useRef({
      u_offset: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(0, 0) }
    }).current

    const handleScroll = useCallback((delta: number) => {
      const speed = 0.001
      setOffset(prev => {
        const newOffset = [prev[0] + delta * speed, prev[1]]
        // CRITICAL: Update the uniform value directly
        testUniforms.u_offset.value.set(newOffset[0], newOffset[1])
        console.log('🖱️ Base handleScroll:', {
          delta,
          newOffset,
          uniformX: testUniforms.u_offset.value.x,
          uniformY: testUniforms.u_offset.value.y
        })
        return newOffset
      })
    }, [testUniforms])

    // Update uniform when offset changes (redundant but ensures sync)
    useEffect(() => {
      testUniforms.u_offset.value.set(offset[0], offset[1])
    }, [offset, testUniforms])

    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          dpr={window.devicePixelRatio}
          style={{ width: '100%', height: '100vh', background: '#000' }}
          onCreated={({ gl }) => {
            tagVizCanvas(gl.domElement)
            if (isScreenshotMode()) {
              requestAnimationFrame(() => markScreenshotReady())
            }
          }}
        >
          <TestShaderPlane uniforms={testUniforms} onScroll={handleScroll} />
          {showHud && <Stats />}
        </Canvas>
      </>
    )
  }

  // Original particle/points mode
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={window.devicePixelRatio}
        style={{ width: '100%', height: '100vh', background: '#000' }}
        onCreated={({ gl }) => tagVizCanvas(gl.domElement)}
      >
        <Points
          tick={props.tick}
          numParticles={props.numParticles}
          dimension={props.dimension}
          pointSize={props.pointSize}
          singleColor={props.singleColor}
          colorAlpha={props.colorAlpha}
        />
        {!screenshot && <OrbitControls enableDamping dampingFactor={0.05} />}
        {showHud && <Stats />}
      </Canvas>
    </>
  )
}

export default Base
