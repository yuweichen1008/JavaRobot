import { ThreeViewport } from '../components/3d/ThreeViewport'
import { ControlPanel } from '../components/ui/ControlPanel'
import { StatusPanel } from '../components/ui/StatusPanel'
import { CommandHistory } from '../components/ui/CommandHistory'
import { Link } from 'react-router-dom'
import styles from './SimulatorPage.module.css'

export function SimulatorPage() {
  return (
    <div className={styles.layout}>
      <nav className={styles.topbar}>
        <span className={styles.brand}>JavaRobot</span>
        <span className={styles.sub}>YASKAWA MH12 Simulator</span>
        <Link to="/journey" className={styles.journeyLink}>My Learning Journey →</Link>
      </nav>

      <div className={styles.main}>
        <div className={styles.viewport}>
          <ThreeViewport />
        </div>
        <div className={styles.sidebar}>
          <ControlPanel />
        </div>
      </div>

      <div className={styles.statusbar}>
        <StatusPanel />
      </div>

      <CommandHistory />
    </div>
  )
}
