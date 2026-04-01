import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useRobotStore } from '../store/robotStore'
import { useConnectionStore } from '../store/connectionStore'
import { solveIK } from '../utils/kinematics'

interface RobotStateMessage {
  type: string
  timestamp: number
  robotId: string
  position: { x: number; y: number; z: number; rx: number; ry: number; rz: number; toolNumber: number; formNumber: number }
  status: { servoOn: boolean; moving: boolean; mode: 'SIMULATION' | 'HARDWARE'; alert: string | null }
}

export function useRobotSocket() {
  const socketRef = useRef<Socket | null>(null)
  const setPosition = useRobotStore((s) => s.setPosition)
  const setStatus = useRobotStore((s) => s.setStatus)
  const setJointAngles = useRobotStore((s) => s.setJointAngles)
  const setConnected = useConnectionStore((s) => s.setConnected)
  const setError = useConnectionStore((s) => s.setError)

  useEffect(() => {
    const socket = io('/', { path: '/socket.io', transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => setConnected(false))
    socket.on('connect_error', (err) => setError(err.message))

    socket.on('robot-state', (msg: RobotStateMessage) => {
      const p = msg.position
      setPosition(p)
      setStatus(msg.status)
      const angles = solveIK(p.x, p.y, p.z, p.rx, p.ry, p.rz)
      setJointAngles([angles.j1, angles.j2, angles.j3, angles.j4, angles.j5, angles.j6])
    })

    return () => { socket.disconnect() }
  }, [setPosition, setStatus, setJointAngles, setConnected, setError])

  return socketRef
}
