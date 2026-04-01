import { useState } from 'react'
import { useRobotStore } from '../../store/robotStore'
import { useConnectionStore } from '../../store/connectionStore'
import { useRobotControls } from '../../hooks/useRobotControls'
import styles from './ControlPanel.module.css'

const POS_RANGE = { min: -1500, max: 1500, step: 1 }
const ROT_RANGE = { min: -1800000, max: 1800000, step: 1000 }

function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (v: number) => void
}) {
  const displayVal = unit === '°' ? (value / 10000).toFixed(1) : value.toString()
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{displayVal}{unit}</span>
    </div>
  )
}

export function ControlPanel() {
  const position = useRobotStore((s) => s.position)
  const status = useRobotStore((s) => s.status)
  const wsConnected = useConnectionStore((s) => s.wsConnected)
  const { move, setServo, home } = useRobotControls()

  const [target, setTarget] = useState({
    x: position.x, y: position.y, z: position.z,
    rx: position.rx, ry: position.ry, rz: position.rz,
  })
  const [speed, setSpeed] = useState(100)

  function setField(k: keyof typeof target, v: number) {
    setTarget((t) => ({ ...t, [k]: v }))
  }

  async function sendMove() {
    await move(target, speed)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={`${styles.dot} ${wsConnected ? styles.dotOn : styles.dotOff}`} />
        <span>{wsConnected ? 'Connected' : 'Disconnected'}</span>
        <span className={styles.modeTag}>SIMULATION</span>
      </div>

      <div className={styles.servoRow}>
        <button
          className={`${styles.btn} ${status.servoOn ? styles.btnDanger : styles.btnPrimary}`}
          onClick={() => setServo(!status.servoOn)}
        >
          Servo {status.servoOn ? 'ON' : 'OFF'}
        </button>
        <button className={styles.btn} onClick={home}>Home</button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Position (mm)</div>
        <SliderRow label="X" value={target.x} unit="mm" {...POS_RANGE} onChange={(v) => setField('x', v)} />
        <SliderRow label="Y" value={target.y} unit="mm" {...POS_RANGE} onChange={(v) => setField('y', v)} />
        <SliderRow label="Z" value={target.z} unit="mm" {...POS_RANGE} onChange={(v) => setField('z', v)} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Rotation</div>
        <SliderRow label="Rx" value={target.rx} unit="°" {...ROT_RANGE} onChange={(v) => setField('rx', v)} />
        <SliderRow label="Ry" value={target.ry} unit="°" {...ROT_RANGE} onChange={(v) => setField('ry', v)} />
        <SliderRow label="Rz" value={target.rz} unit="°" {...ROT_RANGE} onChange={(v) => setField('rz', v)} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Speed: {speed} mm/s</div>
        <input
          type="range" min={10} max={200} step={5} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <button
        className={`${styles.btn} ${styles.btnSend}`}
        onClick={sendMove}
        disabled={!status.servoOn}
      >
        {status.servoOn ? 'Send Move' : 'Enable Servo First'}
      </button>
    </div>
  )
}
