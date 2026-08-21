import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import style from '../@scss/template.module.scss'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { isMeshProps, isParticleProps, isShaderProps, EDimensions, type TPointsProps, type TParticleProps, type TShaderProps, type TMeshProps } from '../@types/gui'
import { isScreenshotMode, markScreenshotReady } from '../modules/screenshotMode'

const tagVizCanvas = (canvas: HTMLCanvasElement) => {
  canvas.id = 'cw-viz-canvas'
  canvas.dataset.cwViz = '1'
}

const canvasGlProps = () =>
  isScreenshotMode()
    ? { antialias: true as const, preserveDrawingBuffer: true as const }
    : { antialias: true as const }

/** Pack 2D xy samples into xyz (z=0). Do not recenter — partial `n` must not shift the cloud. */
function pack2D(xy: Float32Array, count: number, out: Float32Array) {
  for (let i = 0; i < count; i++) {
    out[i * 3] = xy[i * 2]
    out[i * 3 + 1] = xy[i * 2 + 1]
    out[i * 3 + 2] = 0
  }
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
  const drawnRef = useRef(0)
  const posAttr = useRef<THREE.BufferAttribute | null>(null)
  const colorAttr = useRef<THREE.BufferAttribute | null>(null)

  const positions = useMemo(() => new Float32Array(numParticles * dimension), [numParticles, dimension])
  const positions3 = useMemo(() => new Float32Array(numParticles * 3), [numParticles])
  const colors = useMemo(() => new Float32Array(numParticles * (colorAlpha ? 4 : 3)), [numParticles, colorAlpha])
  const size = pointSize ?? 0.015
  const pixelSized = size >= 1

  useLayoutEffect(() => {
    const geo = points.current?.geometry
    if (!geo) {
      return
    }
    const pos = new THREE.BufferAttribute(positions3, 3)
    pos.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', pos)
    posAttr.current = pos

    if (!singleColor) {
      const col = new THREE.BufferAttribute(colors, colorAlpha ? 4 : 3)
      col.setUsage(THREE.DynamicDrawUsage)
      geo.setAttribute('color', col)
      colorAttr.current = col
    }
  }, [positions3, colors, singleColor, colorAlpha])

  const tickRef = useRef(tick)
  tickRef.current = tick

  useFrame((_state, delta) => {
    const result = tickRef.current(positions, colors, _state, delta)
    if (typeof result === 'number') {
      drawnRef.current = Math.max(0, Math.min(numParticles, Math.floor(result)))
    }
    const drawn = drawnRef.current

    if (dimension === EDimensions.TWO_D) {
      pack2D(positions, drawn > 0 ? drawn : numParticles, positions3)
    } else {
      positions3.set(positions)
    }

    if (posAttr.current) {
      posAttr.current.needsUpdate = true
    }
    if (colorAttr.current) {
      colorAttr.current.needsUpdate = true
    }

    const geo = points.current?.geometry
    if (geo) {
      geo.setDrawRange(0, drawn > 0 ? drawn : numParticles)
    }

    if (!readySent.current && isScreenshotMode() && drawn >= numParticles) {
      readySent.current = true
      requestAnimationFrame(() => markScreenshotReady())
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry />
      <pointsMaterial
        size={size}
        sizeAttenuation={!pixelSized}
        color={singleColor ?? '#ffffff'}
        vertexColors={!singleColor}
        toneMapped={false}
        transparent={false}
        depthWrite={false}
      />
    </points>
  )
}

// ------------------------------------------------------------
// GPU line-strip trail (same tick + n progress as points)
// ------------------------------------------------------------
const LineTrail = <T,>({
  tick,
  numParticles,
  dimension,
  colorAlpha = false,
  lineOpacity = 0.8,
}: TParticleProps<T>) => {
  const line = useRef<THREE.Line>(null)
  const tickRef = useRef(tick)
  tickRef.current = tick
  const readySent = useRef(false)
  const drawnRef = useRef(0)

  const positions = useMemo(() => new Float32Array(numParticles * dimension), [numParticles, dimension])
  const colors = useMemo(() => new Float32Array(numParticles * (colorAlpha ? 4 : 3)), [numParticles, colorAlpha])

  useFrame((state, delta) => {
    const result = tickRef.current(positions, colors, state, delta)
    if (typeof result === 'number') {
      drawnRef.current = Math.max(0, Math.min(numParticles, Math.floor(result)))
    }

    const geo = line.current?.geometry
    if (geo) {
      if (geo.attributes.position) geo.attributes.position.needsUpdate = true
      if (geo.attributes.color) geo.attributes.color.needsUpdate = true
      geo.setDrawRange(0, drawnRef.current)
    }

    if (!readySent.current && isScreenshotMode() && drawnRef.current >= numParticles) {
      readySent.current = true
      requestAnimationFrame(() => markScreenshotReady())
    }
  })

  return (
    <line ref={line}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / dimension}
          array={positions}
          itemSize={dimension}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / (colorAlpha ? 4 : 3)}
          array={colors}
          itemSize={colorAlpha ? 4 : 3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent={lineOpacity < 1}
        opacity={lineOpacity}
        depthWrite={false}
      />
    </line>
  )
}

const MeshSurface = ({
  positions,
  indices,
  colors,
  progressTick,
}: Pick<TMeshProps, 'positions' | 'indices' | 'colors' | 'progressTick'>) => {
  const readySent = useRef(false)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setIndex(new THREE.BufferAttribute(indices, 1))
    geo.computeVertexNormals()
    geo.setDrawRange(0, isScreenshotMode() ? indices.length : 0)
    return geo
  }, [positions, indices, colors])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((_, delta) => {
    if (progressTick) {
      const count = progressTick(delta)
      const tris = Math.max(0, Math.floor(count / 3) * 3)
      geometry.setDrawRange(0, Math.min(indices.length, tris))
    }
    if (!readySent.current && isScreenshotMode()) {
      readySent.current = true
      requestAnimationFrame(() => markScreenshotReady())
    }
  })

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        roughness={0.45}
        metalness={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ------------------------------------------------------------
// Shader fullscreen plane
// ------------------------------------------------------------
const ShaderPlane = ({ vertexShader, fragmentShader, uniforms }: Pick<TShaderProps, 'vertexShader' | 'fragmentShader' | 'uniforms'>) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { gl, size, viewport } = useThree()
  const readySent = useRef(false)

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

  useFrame(() => {
    const mat = materialRef.current
    if (mat && mat.uniforms) {
      // Keep resolution locked to the live drawable size (chrome stage resizes).
      if (mat.uniforms.u_resolution) {
        const w = size.width * gl.getPixelRatio()
        const h = size.height * gl.getPixelRatio()
        if (w > 0 && h > 0) {
          const res = mat.uniforms.u_resolution.value
          if (res.x !== w || res.y !== h) {
            res.set(w, h)
          }
        }
      }
      mat.uniformsNeedUpdate = true

      if (!readySent.current && isScreenshotMode()) {
        readySent.current = true
        requestAnimationFrame(() => markScreenshotReady())
      }
    }
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
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
  const canvas = useRef<HTMLCanvasElement>(null)
  const screenshot = isScreenshotMode()

  useEffect(() => {
    if (isParticleProps(props) && props.setCanvasRef) {
      props.setCanvasRef(canvas)
    }
    return () => {}
  }, [props])

  const page = window.location.pathname.split('/').pop() || ''
  const title = page.split(/(?=[A-Z])/).join(' ')
  const description = `Interactive visualization of ${title}`

  if (isShaderProps(props)) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Canvas
          camera={('cameraPosition' in props && props.cameraPosition) ? { position: props.cameraPosition } : { position: [0, 0, 1], fov: 75 }}
          dpr={window.devicePixelRatio}
          gl={canvasGlProps()}
          style={{ width: '100%', height: '100%', background: '#000' }}
          onCreated={({ gl }) => tagVizCanvas(gl.domElement)}
        >
          <ShaderPlane 
            vertexShader={props.vertexShader}
            fragmentShader={props.fragmentShader}
            uniforms={props.uniforms}
          />
        </Canvas>
      </>
    )
  }

  // TEST MODE: Simple two squares (for debugging uniform updates)
  if (isShaderProps(props)) {
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
          gl={canvasGlProps()}
          style={{ width: '100%', height: '100%', background: '#000' }}
          onCreated={({ gl }) => {
            tagVizCanvas(gl.domElement)
            if (isScreenshotMode()) {
              requestAnimationFrame(() => markScreenshotReady())
            }
          }}
        >
          <TestShaderPlane uniforms={testUniforms} onScroll={handleScroll} />
        </Canvas>
      </>
    )
  }

  if (isMeshProps(props)) {
    const meshCamera = {
      position: props.cameraPosition ?? [0, 0, 4],
      fov: 75,
    }

    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <Canvas
          camera={meshCamera}
          dpr={window.devicePixelRatio}
          gl={canvasGlProps()}
          style={{ width: '100%', height: '100%', background: '#000' }}
          onCreated={({ gl }) => tagVizCanvas(gl.domElement)}
        >
          <ambientLight intensity={0.42} />
          <directionalLight position={[5, 8, 6]} intensity={1.15} />
          <directionalLight position={[-5, -3, -4]} intensity={0.38} />
          <MeshSurface
            positions={props.positions}
            indices={props.indices}
            colors={props.colors}
            progressTick={props.progressTick}
          />
          {!screenshot && (
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              autoRotate={props.autoRotate === true}
              autoRotateSpeed={props.autoRotateSpeed ?? 0.4}
            />
          )}
        </Canvas>
      </>
    )
  }

  if (!isParticleProps(props)) {
    return null
  }

  // Original particle/points mode
  const is2D = props.dimension === EDimensions.TWO_D
  const rawCam = props.cameraPosition
  const rawZ = Array.isArray(rawCam)
    ? rawCam[2]
    : rawCam && typeof rawCam === 'object' && 'z' in rawCam
      ? Reflect.get(rawCam, 'z')
      : undefined
  const camZ = Math.abs(typeof rawZ === 'number' ? rawZ : 220)
  const particleCamera = rawCam
    ? { position: rawCam, fov: 75 }
    : { position: [0, 0, camZ] as [number, number, number], fov: 75 }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Canvas
        camera={particleCamera}
        dpr={[1, 2]}
        gl={canvasGlProps()}
        style={{ width: '100%', height: '100%', background: '#000' }}
        onCreated={({ gl }) => {
          tagVizCanvas(gl.domElement)
          gl.domElement.style.width = '100%'
          gl.domElement.style.height = '100%'
          gl.domElement.style.display = 'block'
        }}
      >
        {props.drawMode === 'line' ? (
          <LineTrail
            tick={props.tick}
            numParticles={props.numParticles}
            dimension={props.dimension}
            colorAlpha={props.colorAlpha}
            lineOpacity={props.lineOpacity}
          />
        ) : (
          <Points
            tick={props.tick}
            numParticles={props.numParticles}
            dimension={props.dimension}
            pointSize={props.pointSize}
            singleColor={props.singleColor}
            colorAlpha={props.colorAlpha}
          />
        )}
        {!screenshot && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            enableRotate={!is2D}
            autoRotate={!is2D && props.autoRotate === true}
            autoRotateSpeed={props.autoRotateSpeed ?? 0.4}
          />
        )}
      </Canvas>
    </>
  )
}

export default Base
