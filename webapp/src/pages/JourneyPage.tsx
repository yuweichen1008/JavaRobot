import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { milestones, type Milestone } from '../data/journey'
import { Link } from 'react-router-dom'
import styles from './JourneyPage.module.css'

const VERSION_COLORS: Record<string, string> = {
  v1:     '#6e7681',
  v2:     '#1f6feb',
  v3:     '#388bfd',
  'v1.3': '#2ea043',
  MATLAB: '#d29922',
  Web:    '#bc8cff',
}

function TimelineNode({ milestone }: { milestone: Milestone }) {
  const [expanded, setExpanded] = useState(false)
  const color = VERSION_COLORS[milestone.version] ?? '#58a6ff'

  return (
    <div className={styles.node}>
      <div className={styles.nodeLeft}>
        <div className={styles.dot} style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <div className={styles.line} />
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.version} style={{ color, borderColor: color }}>{milestone.version}</span>
          <span className={styles.date}>{milestone.date}</span>
        </div>
        <h3 className={styles.title}>{milestone.title}</h3>
        <p className={styles.description}>{milestone.description}</p>
        {milestone.commitNote && (
          <div className={styles.commit}>
            git: <em>{milestone.commitNote}</em>
          </div>
        )}
        {milestone.codeSnippet && (
          <button className={styles.expandBtn} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Hide code' : 'View code snippet'} ›
          </button>
        )}
        {expanded && milestone.codeSnippet && (
          <div className={styles.snippet}>
            {milestone.snippetLabel && (
              <div className={styles.snippetLabel}>{milestone.snippetLabel}</div>
            )}
            <SyntaxHighlighter
              language={milestone.language === 'text' ? 'typescript' : milestone.language}
              style={atomOneDark}
              customStyle={{ margin: 0, borderRadius: '0 0 6px 6px', fontSize: '12px' }}
            >
              {milestone.codeSnippet}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

export function JourneyPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>← Simulator</Link>
        <span className={styles.navTitle}>Learning Journey</span>
      </nav>

      <header className={styles.hero}>
        <h1>From Hello World to Industrial Robot</h1>
        <p>
          How I learned to code by controlling a YASKAWA Motoman MH12 — UDP sockets,
          rotation matrices, and the command pattern, one commit at a time.
        </p>
        <div className={styles.heroMeta}>
          <span>Nov 2016 → Jan 2018</span>
          <span>Java → MATLAB → TypeScript</span>
          <span>6-DOF robotic arm</span>
        </div>
      </header>

      <div className={styles.timeline}>
        {milestones.map((m) => (
          <TimelineNode key={m.id} milestone={m} />
        ))}
      </div>
    </div>
  )
}
