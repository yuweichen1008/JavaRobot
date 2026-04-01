import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { RobotArm } from './RobotArm'
import { TrajectoryTrail } from './TrajectoryTrail'
import { Suspense } from 'react'

export function ThreeViewport() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0d1117' }}>
      <Canvas
        camera={{ position: [20, 15, 20], fov: 50, near: 0.1, far: 1000 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4a9eff" />

          <Environment preset="city" />

          <RobotArm />
          <TrajectoryTrail />

          {/* Floor grid */}
          <Grid
            position={[0, 0, 0]}
            args={[40, 40]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#1a2a3a"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#2a4a6a"
            fadeDistance={80}
            infiniteGrid
          />

          {/* Coordinate axes helper (small, at origin) */}
          <axesHelper args={[3]} />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={100}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
