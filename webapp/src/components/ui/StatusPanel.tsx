import { useRobotStore } from '../../store/robotStore'
import { useRobotControls } from '../../hooks/useRobotControls'
import styles from './StatusPanel.module.css'

function fmt(v: number, unit: string, scale: number) {
  return `${(v / scale).toFixed(1)}${unit}`
}

export function StatusPanel() {
  const position = useRobotStore((s) => s.position)
  const status = useRobotStore((s) => s.status)
  const { resetAlert } = useRobotControls()

  return (
    <div className={styles.panel}>
      <div className={styles.posRow}>
        {(['x','y','z'] as const).map((k) => (
          <span key={k} className={styles.posItem}>
            <span className={styles.axis}>{k.toUpperCase()}</span>
            {fmt(position[k], 'mm', 1)}
          </span>
        ))}
        {(['rx','ry','rz'] as const).map((k) => (
          <span key={k} className={styles.posItem}>
            <span className={styles.axis}>{k.toUpperCase()}</span>
            {fmt(position[k], '°', 10000)}
          </span>
        ))}
      </div>

      <div className={styles.flags}>
        <span className={`${styles.flag} ${status.servoOn ? styles.flagOn : ''}`}>
          SERVO {status.servoOn ? 'ON' : 'OFF'}
        </span>
        <span className={`${styles.flag} ${status.moving ? styles.flagMoving : ''}`}>
          {status.moving ? 'MOVING' : 'IDLE'}
        </span>
        <span className={styles.flag}>{status.mode}</span>
      </div>

      {status.alert && (
        <div className={styles.alert}>
          ALERT: {status.alert}
          <button className={styles.alertReset} onClick={resetAlert}>Reset</button>
        </div>
      )}
    </div>
  )
}
