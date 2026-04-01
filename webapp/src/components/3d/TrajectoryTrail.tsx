import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRobotStore } from '../../store/robotStore'

const RING_SIZE = 300
const S = 0.1  // mm → three units

export function TrajectoryTrail() {
  const position = useRobotStore((s) => s.position)
  const ring = useRef<THREE.Vector3[]>([])
  const geoRef = useRef<THREE.BufferGeometry>(null)

  useEffect(() => {
    const p = new THREE.Vector3(position.x * S, position.z * S, -position.y * S)
    ring.current.push(p)
    if (ring.current.length > RING_SIZE) ring.current.shift()
  }, [position])

  useFrame(() => {
    if (!geoRef.current || ring.current.length < 2) return
    geoRef.current.setFromPoints(ring.current)
    geoRef.current.computeBoundingSphere()
  })

  return (
    <line>
      <bufferGeometry ref={geoRef} />
      <lineBasicMaterial color="#00ffcc" opacity={0.5} transparent />
    </line>
  )
}
