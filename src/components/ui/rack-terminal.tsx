'use client'

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { motion, useMotionTemplate, useSpring } from 'framer-motion'
import { RackGraph } from '@/components/ui/rack-graph'
import { cn } from '@/lib/utils'

type TabId = 'status' | 'stack' | 'link'

const TABS: { id: TabId; label: string; title: string }[] = [
  { id: 'status', label: 'STAT', title: 'NODE_STATUS' },
  { id: 'stack', label: 'STACK', title: 'MEDIA_STACK' },
  { id: 'link', label: 'DATA', title: 'LINK_MAP' },
]

const NODES = [
  { id: 'NAS', state: 'locked' },
  { id: 'MEDIA', state: 'indexed' },
  { id: 'DNS', state: 'filtered' },
  { id: 'QUICKSYNC', state: 'hot' },
]

const SERVICES = [
  ['Jellyfin archive', 'serving'],
  ['Quicksync transcode', 'ready'],
  ['Nextcloud vault', 'synced'],
  ['WireGuard tunnel', 'peered'],
  ['Restic cold copy', 'sealed'],
]

const ROUTES = [
  'home-lab / local resolver',
  'jellyfin / hardware transcode',
  'archive / cold snapshot',
  'wireguard / trusted peers',
]

const pad = (value: number) => value.toString().padStart(2, '0')
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
const drift = (value: number, by: number, min: number, max: number) =>
  clamp(value + (Math.random() * 2 - 1) * by, min, max)

export function RackTerminal() {
  const [tab, setTab] = useState<TabId>('status')
  const [activeNode, setActiveNode] = useState('QUICKSYNC')
  const [activeService, setActiveService] = useState(1)
  const [now, setNow] = useState(() => new Date())
  const [scan, setScan] = useState(0)
  const [metrics, setMetrics] = useState({ cpu: 38, net: 2.5, density: 82, peers: 3 })

  const screenRef = useRef<HTMLDivElement>(null)

  // A ticking clock is the most honest "this is live" signal.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  // Telemetry that never sits perfectly still.
  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((m) => ({
        cpu: Math.round(drift(m.cpu, 9, 24, 94)),
        net: Math.round(drift(m.net, 0.4, 1.4, 3.6) * 10) / 10,
        density: Math.round(drift(m.density, 1.3, 74, 96)),
        peers: Math.round(drift(m.peers, 1, 2, 6)),
      }))
    }, 1800)
    return () => window.clearInterval(id)
  }, [])

  // Cursor-tracking glow — decorative, so it rides a spring (Emil's rule).
  const glowX = useSpring(50, { stiffness: 140, damping: 18, mass: 0.6 })
  const glowY = useSpring(40, { stiffness: 140, damping: 18, mass: 0.6 })
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, oklch(0.82 0.16 75 / 0.22) 0%, oklch(0.82 0.16 75 / 0.07) 32%, transparent 62%)`

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = screenRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    glowX.set(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100)
    glowY.set(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100)
  }

  const handlePointerLeave = () => {
    glowX.set(50)
    glowY.set(40)
  }

  const nodeState = NODES.find((n) => n.id === activeNode)?.state ?? 'hot'
  const activeTitle = TABS.find((t) => t.id === tab)?.title ?? ''

  return (
    <section className="rack-terminal" aria-label="DUNEIFY rack terminal">
      <div className="rack-terminal-shell">
        <span className="rack-terminal-screw rack-terminal-screw--tl" />
        <span className="rack-terminal-screw rack-terminal-screw--tr" />
        <span className="rack-terminal-screw rack-terminal-screw--bl" />
        <span className="rack-terminal-screw rack-terminal-screw--br" />

        <div
          ref={screenRef}
          className="rack-terminal-screen"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            className="rack-terminal-glow"
            aria-hidden="true"
            style={{ background: glow }}
          />
          <div className="rack-terminal-scanlines" aria-hidden="true" />
          <div className="rack-terminal-glass" aria-hidden="true" />

          <div className="rack-terminal-boot">
            <header className="rack-terminal-topbar">
              <div className="rack-terminal-title">{activeTitle}</div>
              <div className="rack-terminal-line" />
              <div className="rack-terminal-stats">
                <span>
                  QUICKSYNC <strong>{metrics.cpu > 80 ? 'HOT' : 'READY'}</strong>
                </span>
                <span>
                  LAN <strong>{metrics.net.toFixed(1)}G</strong>
                </span>
                <span className="rack-terminal-pulse">///</span>
              </div>
            </header>

            <main className="rack-terminal-main">
              {tab === 'status' && (
                <div
                  key="status"
                  className="rack-terminal-panel rack-terminal-panel--status is-active"
                >
                  <aside className="rack-terminal-module rack-terminal-side-menu">
                    {NODES.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveNode(node.id)}
                        aria-pressed={node.id === activeNode}
                        className={cn(
                          'rack-terminal-side-row',
                          node.id === activeNode &&
                            'rack-terminal-side-row--active',
                        )}
                      >
                        <span>{node.id}</span>
                        <small>{node.state}</small>
                      </button>
                    ))}
                  </aside>

                  <section className="rack-terminal-module rack-terminal-status-display">
                    <p className="rack-terminal-kicker">
                      {activeNode} / {nodeState}
                    </p>
                    <div className="rack-terminal-time">
                      {pad(now.getHours())}
                      <span className="rack-terminal-blink">:</span>
                      {pad(now.getMinutes())}
                    </div>
                    <p className="rack-terminal-date">
                      local only / no lease / uptime {pad(now.getSeconds())}s
                    </p>
                    <RackGraph />
                    <div className="rack-terminal-tape" aria-hidden="true">
                      <span>
                        hardware transcode / local archive / cold backup / owned
                        media /&nbsp;
                      </span>
                      <span>
                        hardware transcode / local archive / cold backup / owned
                        media /&nbsp;
                      </span>
                    </div>
                  </section>

                  <aside className="rack-terminal-module rack-terminal-right-menu">
                    <div className="rack-terminal-sync-ring" aria-hidden="true">
                      <span />
                    </div>
                    <div className="rack-terminal-readout">
                      <span>cpu</span>
                      <strong>{metrics.cpu}%</strong>
                      <div className="rack-terminal-meter">
                        <span style={{ width: `${metrics.cpu}%` }} />
                      </div>
                    </div>
                    <div className="rack-terminal-readout">
                      <span>peers</span>
                      <strong>{metrics.peers}</strong>
                      <div className="rack-terminal-meter">
                        <span style={{ width: `${metrics.peers * 16}%` }} />
                      </div>
                    </div>
                  </aside>
                </div>
              )}

              {tab === 'stack' && (
                <div
                  key="stack"
                  className="rack-terminal-panel rack-terminal-panel--stack is-active"
                >
                  <div className="rack-terminal-module rack-terminal-stack-copy">
                    <p className="rack-terminal-kicker">media stack inventory</p>
                    <ul className="rack-terminal-stack-list">
                      {SERVICES.map(([name, state], index) => (
                        <li key={name}>
                          <button
                            type="button"
                            onClick={() => setActiveService(index)}
                            aria-pressed={index === activeService}
                            className={cn(
                              'rack-terminal-stack-row',
                              index === activeService &&
                                'rack-terminal-row-active',
                            )}
                          >
                            <span>{name}</span>
                            <span>{state}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rack-terminal-module rack-terminal-bay">
                    <div className="rack-terminal-bay-grid" aria-hidden="true">
                      {Array.from({ length: 28 }).map((_, index) => (
                        <span key={index} />
                      ))}
                    </div>
                    <div className="rack-terminal-storage">
                      <span>library density</span>
                      <strong>{metrics.density}%</strong>
                    </div>
                    <div className="rack-terminal-storage-bar" aria-hidden="true">
                      <span style={{ width: `${metrics.density}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {tab === 'link' && (
                <div
                  key="link"
                  className="rack-terminal-panel rack-terminal-panel--link is-active"
                >
                  <div className="rack-terminal-module rack-terminal-radar-card">
                    <div className="rack-terminal-radar" key={scan}>
                      <span className="rack-terminal-sweep" />
                      <span className="rack-terminal-blip rack-terminal-blip--one" />
                      <span className="rack-terminal-blip rack-terminal-blip--two" />
                    </div>
                    <p className="rack-terminal-radar-text">
                      scanning local peers / storefront bypassed
                    </p>
                    <button
                      type="button"
                      className="rack-terminal-action"
                      onClick={() => setScan((value) => value + 1)}
                    >
                      Rescan peers
                    </button>
                  </div>

                  <div className="rack-terminal-module rack-terminal-route-card">
                    <p className="rack-terminal-kicker">trusted route map</p>
                    <ul>
                      {ROUTES.map((route) => (
                        <li key={route}>
                          <span />
                          {route}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </main>

            <footer className="rack-terminal-nav">
              {TABS.map((item, index) => (
                <Fragment key={item.id}>
                  <button
                    type="button"
                    className="rack-terminal-tab"
                    data-active={tab === item.id}
                    aria-selected={tab === item.id}
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </button>
                  {index < TABS.length - 1 && (
                    <div className="rack-terminal-line" />
                  )}
                </Fragment>
              ))}
              <div className="rack-terminal-eq" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
