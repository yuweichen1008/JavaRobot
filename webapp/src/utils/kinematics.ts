// Analytical IK for a spherical-wrist 6-DOF robot (YASKAWA MH12 approximation).
// Ported from RobotRotation.java — same ZYX Euler convention.
//
// Input units (matching original RobotPosition.java):
//   position: mm (integer, e.g. 1234 → 1234 mm)
//   rotation: 0.0001 degrees (e.g. 900000 → 90.0°)
//
// Output: joint angles in radians for the Three.js scene graph

export interface JointAngles {
  j1: number; j2: number; j3: number;
  j4: number; j5: number; j6: number;
}

// Approximate DH parameters for MH12 (mm)
const DH = { d1: 88, a2: 310, a3: 270, d4: 70, d5: 70, d6: 70 }

const DEG = Math.PI / 180
const EPS = 1e-6

// Build 3×3 rotation matrix from ZYX Euler angles (in radians)
// matches RobotRotation.java: Rz * Ry * Rx
function eulerZYX(rx: number, ry: number, rz: number): number[][] {
  const cx = Math.cos(rx), sx = Math.sin(rx)
  const cy = Math.cos(ry), sy = Math.sin(ry)
  const cz = Math.cos(rz), sz = Math.sin(rz)
  return [
    [cz * cy,  cz * sy * sx - sz * cx,  cz * sy * cx + sz * sx],
    [sz * cy,  sz * sy * sx + cz * cx,  sz * sy * cx - cz * sx],
    [-sy,      cy * sx,                  cy * cx               ],
  ]
}

// Multiply two 3×3 matrices
function matmul(A: number[][], B: number[][]): number[][] {
  return A.map((row, i) =>
    [0, 1, 2].map((j) => row.reduce((s, _, k) => s + A[i][k] * B[k][j], 0))
  )
}

// Transpose 3×3
function transpose(M: number[][]): number[][] {
  return M[0].map((_, j) => M.map((row) => row[j]))
}

export function solveIK(
  x: number, y: number, z: number,
  rx: number, ry: number, rz: number,
): JointAngles {
  // Convert units
  const xm = x          // already mm
  const ym = y
  const zm = z
  const rxr = (rx / 10000) * DEG
  const ryr = (ry / 10000) * DEG
  const rzr = (rz / 10000) * DEG

  // End-effector rotation matrix
  const R = eulerZYX(rxr, ryr, rzr)

  // Wrist center: subtract tool-z offset along z-column of R
  const d6 = DH.d6
  const wx = xm - d6 * R[0][2]
  const wy = ym - d6 * R[1][2]
  const wz = zm - d6 * R[2][2]

  // --- Position subproblem (J1, J2, J3) ---
  const j1 = Math.atan2(wy, wx)

  const r_xy = Math.sqrt(wx * wx + wy * wy)
  const dz   = wz - DH.d1
  const L    = Math.sqrt(r_xy * r_xy + dz * dz)

  const a2 = DH.a2
  const a3 = DH.a3

  // Law of cosines for elbow angle
  let cosJ3 = (L * L - a2 * a2 - a3 * a3) / (2 * a2 * a3)
  cosJ3 = Math.max(-1, Math.min(1, cosJ3))  // clamp for numerical safety
  const j3 = -Math.acos(cosJ3)              // elbow-down configuration

  // Shoulder angle
  const alpha = Math.atan2(dz, r_xy)
  const beta  = Math.atan2(a3 * Math.sin(-j3), a2 + a3 * Math.cos(-j3))
  const j2    = alpha - beta

  // --- Orientation subproblem (J4, J5, J6) ---
  // R0_3 from joint angles
  const c1 = Math.cos(j1)
  const s1 = Math.sin(j1)
  const c23 = Math.cos(j2 + j3)
  const s23 = Math.sin(j2 + j3)

  const R0_3: number[][] = [
    [ c1 * c23,  -c1 * s23,  s1],
    [ s1 * c23,  -s1 * s23, -c1],
    [ s23,        c23,        0 ],
  ]

  const R3_6 = matmul(transpose(R0_3), R)

  // ZYZ Euler decomposition of R3_6
  const sinJ5 = Math.sqrt(R3_6[2][0] * R3_6[2][0] + R3_6[2][1] * R3_6[2][1])

  let j4: number, j5: number, j6: number
  if (sinJ5 < EPS) {
    // Wrist singularity: absorb into J4
    j4 = 0
    j5 = 0
    j6 = Math.atan2(-R3_6[0][1], R3_6[0][0])
  } else {
    j5 = Math.atan2(sinJ5, R3_6[2][2])
    j4 = Math.atan2(R3_6[1][2], R3_6[0][2])
    j6 = Math.atan2(R3_6[2][1], -R3_6[2][0])
  }

  return { j1, j2, j3, j4, j5, j6 }
}
