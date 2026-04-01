import { useState } from 'react'
import { useRobotStore } from '../../store/robotStore'
import styles from './CommandHistory.module.css'

export function CommandHistory() {
  const history = useRobotStore((s) => s.history)
  const [open, setOpen] = useState(false)

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
      <button className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        History ({history.length}) {open ? '▼' : '▲'}
      </button>
      {open && (
        <div className={styles.list}>
          {history.length === 0 && <div className={styles.empty}>No commands yet</div>}
          {history.map((e) => (
            <div key={e.id} className={`${styles.entry} ${e.result === 'error' ? styles.entryError : ''}`}>
              <span className={styles.time}>{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span className={styles.type}>{e.type}</span>
              {e.message && <span className={styles.msg}>{e.message}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
