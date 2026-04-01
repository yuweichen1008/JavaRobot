import { useRobotStore } from '../store/robotStore'

interface MoveTarget {
  x: number; y: number; z: number
  rx: number; ry: number; rz: number
}

export function useRobotControls() {
  const addHistory = useRobotStore((s) => s.addHistory)

  async function post(path: string, body: unknown) {
    const res = await fetch(`/api/v1/robot${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  async function move(target: MoveTarget, speed: number) {
    const result = await post('/move', { target, speed })
    addHistory({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'MOVE',
      payload: { target, speed },
      result: result.error ? 'error' : 'ok',
      message: result.error ?? result.message,
    })
    return result
  }

  async function setServo(on: boolean) {
    return post('/servo', { on })
  }

  async function home() {
    return post('/home', {})
  }

  async function resetAlert() {
    return post('/alert/reset', {})
  }

  return { move, setServo, home, resetAlert }
}
