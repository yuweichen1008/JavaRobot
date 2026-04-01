import { useRef } from 'react'
import { useRobotStore } from '../../store/robotStore'

// Simplified YASKAWA MH12 geometry (mm → Three.js units, 1 unit = 10mm)
const S = 0.1  // scale: mm → three units
const DH = { d1: 88*S, a2: 310*S, a3: 270*S, d4: 70*S, d5: 70*S, d6: 70*S }

function Link({ length, radius = 0.6, color = '#4a9eff' }: { length: number; radius?: number; color?: string }) {
  return (
    <mesh position={[0, length / 2, 0]}>
      <cylinderGeometry args={[radius * 0.6, radius, length, 12]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function Joint({ radius = 0.9, color = '#ff8c42' }: { radius?: number; color?: string }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
    </mesh>
  )
}

export function RobotArm() {
  const jointAngles = useRobotStore((s) => s.jointAngles)
  const [j1, j2, j3, j4, j5, j6] = jointAngles
  const ref = useRef(null)

  return (
    <group ref={ref}>
      {/* Base */}
      <mesh position={[0, DH.d1 / 2, 0]}>
        <cylinderGeometry args={[1.2, 1.5, DH.d1, 16]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* J1 — yaw around Y */}
      <group position={[0, DH.d1, 0]} rotation={[0, j1, 0]}>
        <Joint />
        <Link length={DH.a2} color="#3a7bd5" />

        {/* J2 — pitch around Z */}
        <group position={[0, DH.a2, 0]} rotation={[0, 0, j2]}>
          <Joint />
          <Link length={DH.a3} color="#3a7bd5" />

          {/* J3 — pitch around Z */}
          <group position={[0, DH.a3, 0]} rotation={[0, 0, j3]}>
            <Joint />
            <Link length={DH.d4} color="#5a9de8" />

            {/* J4 — roll around Y */}
            <group position={[0, DH.d4, 0]} rotation={[0, j4, 0]}>
              <Joint radius={0.7} />
              <Link length={DH.d5} radius={0.45} color="#7ab0f0" />

              {/* J5 — pitch around Z */}
              <group position={[0, DH.d5, 0]} rotation={[0, 0, j5]}>
                <Joint radius={0.6} />
                <Link length={DH.d6} radius={0.35} color="#a0c4f8" />

                {/* J6 — roll (tool flange) */}
                <group position={[0, DH.d6, 0]} rotation={[0, j6, 0]}>
                  {/* Tool flange */}
                  <mesh>
                    <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
                    <meshStandardMaterial color="#ff4444" metalness={0.9} roughness={0.1} />
                  </mesh>
                  {/* Tool tip marker */}
                  <mesh position={[0, 0.4, 0]}>
                    <coneGeometry args={[0.2, 0.6, 8]} />
                    <meshStandardMaterial color="#ffcc00" />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
