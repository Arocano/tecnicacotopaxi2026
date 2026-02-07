"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"

const SNOW_COUNT = 1200
const SIZE = 0.12

export type MountainPointId = "inscription" | "fecha" | "lugar" | "info"

interface MountainSceneProps {
  onPointClick: (id: MountainPointId) => void
  className?: string
  /** Cuando hay un modal abierto, las etiquetas se ocultan para evitar bugs de posicionamiento */
  labelsVisible?: boolean
}

export function MountainScene({ onPointClick, className = "", labelsVisible = true }: MountainSceneProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 1.8, 28], fov: 60 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.background = null
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, 2]} intensity={0.4} />
        <ResponsiveMountain onPointClick={onPointClick} labelsVisible={labelsVisible} />
        <Snow />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={16}
          maxDistance={38}
          maxPolarAngle={Math.PI / 2 - 0.1}
          target={[0, -3, 0]}
        />
      </Canvas>
    </div>
  )
}

const MOBILE_BREAKPOINT = 768

function ResponsiveMountain({
  onPointClick,
  labelsVisible,
}: {
  onPointClick: (id: MountainPointId) => void
  labelsVisible: boolean
}) {
  const { size } = useThree()
  const isMobile = size.width < MOBILE_BREAKPOINT || size.height < 600
  const scale = isMobile ? 2.9 : 5
  return (
    <group scale={scale} position={[0, 0, 0]}>
      <Mountain />
      <Point id="inscription" position={[0, -1.35, 2.1]} label="Inscríbete aquí" onPointClick={onPointClick} main labelsVisible={labelsVisible} />
      <Point id="fecha" position={[-1.35, 0.15, 1.2]} label="Organizan" onPointClick={onPointClick} labelsVisible={labelsVisible} />
      <Point id="lugar" position={[1.35, 0.15, 1.2]} label="En colaboración" onPointClick={onPointClick} labelsVisible={labelsVisible} />
      <Point id="info" position={[0, 1.25, 0.4]} label="Más información" onPointClick={onPointClick} labelsVisible={labelsVisible} />
    </group>
  )
}

function Snow() {
  const pointsRef = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(SNOW_COUNT * 3)
    const speeds: { y: number; drift: number; phase: number }[] = []
    for (let i = 0; i < SNOW_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.3) * 45
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      speeds.push({
        y: -0.008 - Math.random() * 0.012,
        drift: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return { positions, speeds }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const pos = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < SNOW_COUNT; i++) {
      const s = speeds[i]
      pos[i * 3 + 1] += s.y
      pos[i * 3 + 0] += Math.sin(time * 0.5 + s.phase) * s.drift
      if (pos[i * 3 + 1] < -22) {
        pos[i * 3 + 1] = 22 + Math.random() * 8
        pos[i * 3 + 0] = (Math.random() - 0.5) * 50
        pos[i * 3 + 2] = (Math.random() - 0.5) * 50
      }
    }
    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={SIZE}
        color="#ffffff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Mountain() {
  const meshRef = useRef<THREE.Mesh>(null)
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <coneGeometry args={[2.5, 3.5, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Capa "nieve" en la cima */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.9, 1.1, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  )
}

interface PointProps {
  id: MountainPointId
  position: [number, number, number]
  label: string
  onPointClick: (id: MountainPointId) => void
  main?: boolean
  labelsVisible?: boolean
}

function Point({ id, position, label, onPointClick, main, labelsVisible = true }: PointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      const scale = hovered ? 1.35 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  return (
    <group position={position}>
      {labelsVisible && (
        <Html
          position={[0, main ? 0.38 : 0.32, 0]}
          center
          distanceFactor={4}
          transform
          zIndexRange={[0, 0]}
        >
          <span
            className="pointer-events-none whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-800 shadow-sm"
            style={{ background: "rgba(255,255,255,0.92)" }}
          >
            {label}
          </span>
        </Html>
      )}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onPointClick(id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "default"
        }}
      >
        <sphereGeometry args={[main ? 0.22 : 0.16, 16, 16]} />
        <meshStandardMaterial
          color={main ? "#f59e0b" : "#94a3b8"}
          emissive={main ? "#b45309" : "#64748b"}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}
