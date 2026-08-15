<!-- b31fe384-6afe-47a4-b57f-f635e95e115d 32091f87-3f8e-457b-88a9-066ff93b4131 -->
# Advanced GPU-Accelerated Mandelbrot & Julia Set Visualizer

## Overview

Extend the Base component to support shader-based rendering for the Mandelbrot/Julia sets, while maintaining backward compatibility with particle-based attractors. Shaders will be in separate files for clean code organization.

## Implementation Steps

### 1. Create Shader Files

**File:** `packages/frontend/src/shaders/mandelbrot.vert.glsl`
```glsl
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**File:** `packages/frontend/src/shaders/mandelbrot.frag.glsl`
```glsl
uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxIterations;
uniform vec2 u_resolution;
uniform bool u_juliaMode;
uniform vec2 u_juliaC;
uniform int u_colorScheme;

varying vec2 vUv;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / (u_zoom * u_resolution.y);
    vec2 z, c;
    
    if (u_juliaMode) {
        z = uv + u_center;
        c = u_juliaC;
    } else {
        z = vec2(0.0);
        c = uv + u_center;
    }
    
    float iterations = 0.0;
    float magnitude = 0.0;
    
    for(int i = 0; i < 1000; i++) {
        if(i >= u_maxIterations) break;
        magnitude = dot(z, z);
        if(magnitude > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iterations += 1.0;
    }
    
    vec3 color;
    if(iterations >= float(u_maxIterations)) {
        color = vec3(0.0);
    } else {
        float smoothValue = iterations - log2(log2(magnitude)) + 4.0;
        float t = smoothValue / float(u_maxIterations);
        
        if(u_colorScheme == 0) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
        } else if(u_colorScheme == 1) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.1, 0.2));
        } else if(u_colorScheme == 2) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 0.5), vec3(0.8, 0.9, 0.3));
        } else if(u_colorScheme == 3) {
            color = vec3(t);
        } else {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(2.0, 1.0, 0.0), vec3(0.5, 0.2, 0.25));
        }
    }
    
    gl_FragColor = vec4(color, 1.0);
}
```

### 2. Update TypeScript Types

**File:** `packages/frontend/src/@types/gui.ts`

Add new enum and types:
```typescript
export enum ERenderMode {
    PARTICLES = 'particles',
    SHADER = 'shader'
}

export type TShaderProps = {
    renderMode: ERenderMode.SHADER
    vertexShader: string
    fragmentShader: string
    uniforms: Record<string, { value: any }>
}
```

Update `TPointsProps` to support both modes:
```typescript
export type TPointsProps<T> = {
    renderMode?: ERenderMode
    // ... existing props
} & (TParticleProps | TShaderProps)
```

### 3. Modify Base Component

**File:** `packages/frontend/src/pages/_base.tsx`

Add conditional rendering logic:

```typescript
import { ERenderMode } from '../@types/gui'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// Inside the Base component, before the return statement:
const isShaderMode = renderMode === ERenderMode.SHADER

// Conditionally render either Points or ShaderPlane
return (
    <Canvas>
        {/* ... existing setup ... */}
        {isShaderMode ? (
            <ShaderPlane {...props} />
        ) : (
            <Points {...props} />
        )}
    </Canvas>
)
```

Add ShaderPlane component within the file:
```typescript
const ShaderPlane = ({ vertexShader, fragmentShader, uniforms }) => {
    const meshRef = useRef()
    const [resolution, setResolution] = useState([window.innerWidth, window.innerHeight])
    
    useEffect(() => {
        const handleResize = () => {
            setResolution([window.innerWidth, window.innerHeight])
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    useFrame(() => {
        if (meshRef.current?.material?.uniforms) {
            meshRef.current.material.uniforms.u_resolution.value.set(...resolution)
        }
    })
    
    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    )
}
```

### 4. Create Mandelbrot Set Component

**File:** `packages/frontend/src/pages/maps/mandelbrot_set.tsx`

```typescript
import { useEffect, useState, useCallback } from 'react'
import { Vector2 } from 'three'
import { Save } from 'lucide-react'
import { Canvas, useThree } from '@react-three/fiber'
import Base from '../_base'
import { ERenderMode } from '../../@types/gui'
import { BlockMath } from 'react-katex'
import vertexShader from '../../shaders/mandelbrot.vert.glsl?raw'
import fragmentShader from '../../shaders/mandelbrot.frag.glsl?raw'

const MandelbrotContent = () => {
    const { gl, scene, camera } = useThree()
    const [center, setCenter] = useState([-0.5, 0.0])
    const [zoom, setZoom] = useState(1.0)
    const [iterations, setIterations] = useState(256)
    const [juliaMode, setJuliaMode] = useState(false)
    const [juliaC, setJuliaC] = useState([-0.4, 0.6])
    const [colorScheme, setColorScheme] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState([0, 0])
    
    const handleWheel = useCallback((e) => {
        e.preventDefault()
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        setZoom(prev => Math.max(0.1, Math.min(prev * zoomFactor, 1e10)))
    }, [])
    
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true)
        setDragStart([e.clientX, e.clientY])
    }, [])
    
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return
        const dx = (e.clientX - dragStart[0]) / (zoom * window.innerHeight)
        const dy = (dragStart[1] - e.clientY) / (zoom * window.innerHeight)
        setCenter(prev => [prev[0] - dx, prev[1] - dy])
        setDragStart([e.clientX, e.clientY])
    }, [isDragging, dragStart, zoom])
    
    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])
    
    const handleExport = useCallback(() => {
        gl.render(scene, camera)
        const dataURL = gl.domElement.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${juliaMode ? 'julia' : 'mandelbrot'}_${Date.now()}.png`
        link.href = dataURL
        link.click()
    }, [gl, scene, camera, juliaMode])
    
    const handleCanvasClick = useCallback((e) => {
        if (juliaMode) return
        const rect = gl.domElement.getBoundingClientRect()
        const x = ((e.clientX - rect.left) - rect.width / 2) / (zoom * rect.height) + center[0]
        const y = (rect.height / 2 - (e.clientY - rect.top)) / (zoom * rect.height) + center[1]
        setJuliaC([x, y])
    }, [gl, zoom, center, juliaMode])
    
    const handleReset = () => {
        setCenter([-0.5, 0.0])
        setZoom(1.0)
        setIterations(256)
    }
    
    useEffect(() => {
        const canvas = gl.domElement
        canvas.addEventListener('wheel', handleWheel, { passive: false })
        return () => canvas.removeEventListener('wheel', handleWheel)
    }, [gl, handleWheel])
    
    return (
        <>
            <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleCanvasClick}
                style={{ position: 'fixed', inset: 0, cursor: isDragging ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
            />
            
            <div className="fixed top-20 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg text-white space-y-4 z-50 w-64">
                <div>
                    <button
                        onClick={() => setJuliaMode(!juliaMode)}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                        {juliaMode ? 'Mandelbrot Mode' : 'Julia Set Mode'}
                    </button>
                </div>
                
                <div>
                    <label className="text-sm block mb-1">Iterations: {iterations}</label>
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="10"
                        value={iterations}
                        onChange={(e) => setIterations(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
                
                <div>
                    <label className="text-sm block mb-1">Color Scheme</label>
                    <select
                        value={colorScheme}
                        onChange={(e) => setColorScheme(parseInt(e.target.value))}
                        className="w-full bg-gray-700 px-2 py-1 rounded"
                    >
                        <option value={0}>Classic Blue</option>
                        <option value={1}>Rainbow</option>
                        <option value={2}>Fire</option>
                        <option value={3}>Grayscale</option>
                        <option value={4}>Purple/Cyan</option>
                    </select>
                </div>
                
                <div className="text-xs space-y-1 font-mono">
                    <div>Center: ({center[0].toFixed(6)}, {center[1].toFixed(6)})</div>
                    <div>Zoom: {zoom.toExponential(2)}x</div>
                    {juliaMode && <div>Julia C: ({juliaC[0].toFixed(3)}, {juliaC[1].toFixed(3)})</div>}
                </div>
                
                <div className="space-y-2">
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                        Reset View
                    </button>
                    <button
                        onClick={handleExport}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save size={16} />
                        Export PNG
                    </button>
                </div>
                
                {!juliaMode && (
                    <div className="text-xs text-gray-400 italic">
                        Click on the fractal to set Julia constant
                    </div>
                )}
            </div>
        </>
    )
}

const MandelbrotSet = () => {
    const [center, setCenter] = useState([-0.5, 0.0])
    const [zoom, setZoom] = useState(1.0)
    const [iterations, setIterations] = useState(256)
    const [juliaMode, setJuliaMode] = useState(false)
    const [juliaC, setJuliaC] = useState([-0.4, 0.6])
    const [colorScheme, setColorScheme] = useState(0)
    
    const uniforms = {
        u_center: { value: new Vector2(...center) },
        u_zoom: { value: zoom },
        u_maxIterations: { value: iterations },
        u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        u_juliaMode: { value: juliaMode },
        u_juliaC: { value: new Vector2(...juliaC) },
        u_colorScheme: { value: colorScheme }
    }
    
    return (
        <Base
            renderMode={ERenderMode.SHADER}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            cameraPosition={[0, 0, 1]}
        >
            <MandelbrotContent />
        </Base>
    )
}

MandelbrotSet.getDescription = () => (
    <>
        The Mandelbrot set is one of the most famous fractals in mathematics, discovered by Benoit Mandelbrot in 1980.
        For each point c in the complex plane, we iterate:
        <BlockMath math={'z_{n+1} = z_n^2 + c'} />
        starting with z₀ = 0. Points where |z| remains bounded belong to the set (shown in black).
        <br /><br />
        <strong>Julia Sets:</strong> Toggle to Julia mode to explore related fractals. Instead of varying c and fixing z₀ = 0,
        Julia sets fix c and vary the starting point z₀. Click on the Mandelbrot set to choose the Julia constant.
        <br /><br />
        <strong>GPU-Accelerated:</strong> This visualization uses WebGL fragment shaders for real-time rendering at 60fps,
        supporting smooth zooming up to 10¹⁰x magnification with continuous coloring.
        <br /><br />
        <strong>Controls:</strong>
        <br />
        - Scroll to zoom in/out
        <br />
        - Click and drag to pan
        <br />
        - Adjust iterations for detail at high zoom
        <br />
        - Toggle between Mandelbrot and Julia modes
        <br />
        - Export current view as PNG
        <br /><br />
        Reference: <a href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank">Mandelbrot Set – Wikipedia</a>
    </>
)

export default MandelbrotSet
```

### 5. Configure Vite for GLSL Imports

**File:** `packages/frontend/vite.config.ts`

Add to plugins or config:
```typescript
import glsl from 'vite-plugin-glsl'

export default {
    plugins: [
        glsl()
    ]
}
```

If plugin is not installed, it will need to be added to package.json.

### 6. Update Routes

**File:** `packages/frontend/src/@types/routes.tsx`

Update Mandelbrot import and ensure single entry:
```typescript
import MandelbrotSet from '../pages/maps/mandelbrot_set'

// In routes array:
{
    name: 'Mandelbrot Set',
    element: MandelbrotSet,
}
```

Remove any duplicate Mandelbrot entries.

## Files to Modify/Delete

1. **Create:** `packages/frontend/src/shaders/mandelbrot.vert.glsl`
2. **Create:** `packages/frontend/src/shaders/mandelbrot.frag.glsl`
3. **Modify:** `packages/frontend/src/@types/gui.ts` (add ERenderMode and TShaderProps)
4. **Modify:** `packages/frontend/src/pages/_base.tsx` (add conditional shader rendering)
5. **Delete:** `packages/frontend/src/pages/maps/mandlebrot_set.tsx` (old CPU version)
6. **Delete:** `packages/frontend/src/pages/maps/mandlebrot_set_1.tsx` (old CPU version)
7. **Create:** `packages/frontend/src/pages/maps/mandelbrot_set.tsx` (new GPU version)
8. **Modify:** `packages/frontend/src/@types/routes.tsx` (update imports, ensure single route)
9. **Modify:** `packages/frontend/vite.config.ts` (add GLSL plugin support)
10. **Check:** `packages/frontend/package.json` (may need to add vite-plugin-glsl)

## Key Features

- GPU-accelerated real-time rendering (60fps)
- Zoom: mouse wheel (up to 10¹⁰x)
- Pan: click and drag
- Smooth continuous coloring
- 5 color palette presets
- Mandelbrot ↔ Julia set mode
- Interactive Julia constant selection
- Iteration slider (50-1000)
- Live coordinates and zoom display
- PNG export functionality
- Window resize handling
- Existing sidebar navigation remains visible
- Backward compatible with particle-based visualizations

## Technical Notes

- Shaders in separate .glsl files for better IDE support and maintainability
- Base component uses conditional rendering: particles vs shader
- Uniforms updated via React state propagation
- Resize listener updates u_resolution uniform
- Event handlers on overlay div for better performance
- Cosine palette function for smooth gradients
- Smooth escape time algorithm for continuous coloring

### To-dos

- [ ] Add animation controls to hopalong_attractor.tsx
- [ ] Add animation controls to hopalong_attractor_add.tsx, hopalong_attractor_positive.tsx, hopalong_attractor_sin.tsx
- [ ] Add animation controls to fractal_dream_attractor.tsx, bedhead_attractor.tsx, gumowski_mira_attractor.tsx, gingerbread_man.tsx
- [ ] Add animation controls to henon_map.tsx, bogdanov_map.tsx, ikeda Map.tsx
- [ ] Add animation controls to brusselator.tsx
- [ ] Test all 13 files: verify play/pause, speed, progress, replay, and color transitions work correctly
- [ ] Commit all changes with descriptive message