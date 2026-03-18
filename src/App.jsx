// App.jsx — Night Studio V1
// All assets use full-canvas positioning (1920x1080 natural coordinates).
// Lamp toggle drives scene-lit / scene-dim on root.
// Rain clipped to window via .rain-window-clip in index.css.
// Live elements (clock hands, laptop screen, lava glow) sit BEHIND
// their PNG cutouts — tune positions in Claude Code once running.

import { useState, useEffect, useRef } from 'react'
import Rain                     from './components/Rain'
import ClockHands               from './components/ClockHands'
import LavaLamp                 from './components/LavaLamp'
import useRainAudio             from './components/useRainAudio'

const KNOB_MIN_DEG = -135
const KNOB_MAX_DEG = 135
const DIAL_STEPS   = 10

function WeatherConsole({
  isRainActive,
  rainVolume,
  onToggleRain,
  onChangeVolume,
  onClose,
}) {
  const tickAudioRef = useRef(null)
  const uiClickAudioRef = useRef(null)

  // Snap current volume to nearest dial index (0–10)
  const currentIndex = Math.min(
    DIAL_STEPS,
    Math.max(0, Math.round((rainVolume ?? 0) * DIAL_STEPS)),
  )
  const angle =
    KNOB_MIN_DEG +
    ((KNOB_MAX_DEG - KNOB_MIN_DEG) * currentIndex) / DIAL_STEPS

  const playTick = () => {
    if (!tickAudioRef.current && typeof Audio !== 'undefined') {
      tickAudioRef.current = new Audio('/audio/Tick.mp3')
    }
    if (tickAudioRef.current) {
      tickAudioRef.current.currentTime = 0
      tickAudioRef.current.play().catch(() => {})
    }
  }

  const playUiClick = () => {
    if (!uiClickAudioRef.current && typeof Audio !== 'undefined') {
      uiClickAudioRef.current = new Audio('/audio/UI_Click.mp3')
    }
    if (uiClickAudioRef.current) {
      uiClickAudioRef.current.currentTime = 0
      uiClickAudioRef.current.play().catch(() => {})
    }
  }

  const handleToggleClick = () => {
    playUiClick()
    // Toggle ON/OFF based on current state
    if (isRainActive) {
      onToggleRain()
      // Smoothly glide back to hotspot 0 (volume 0)
      onChangeVolume(0)
    } else {
      onToggleRain()
    }
  }

  const handleCloseClick = () => {
    playUiClick()
    onClose()
  }

  const handleHotspotClick = (index) => {
    if (index !== currentIndex) {
      playTick()
    }

    if (index > 0 && !isRainActive) {
      onToggleRain()
    }

    onChangeVolume(index / DIAL_STEPS)
  }

  const bgSrc = isRainActive
    ? '/assets/Rain_On_v1.png'
    : '/assets/Rain_Off_v1.png'

  return (
    <div className="weather-app-body">
      <div className="weather-console">
        <img
          src={bgSrc}
          alt=""
          draggable={false}
          className="weather-console-bg"
        />

        {[...Array(DIAL_STEPS + 1)].map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`weather-knob-hotspot weather-knob-hotspot-${idx}`}
            onClick={() => handleHotspotClick(idx)}
            aria-label={`Rain level ${idx}`}
          />
        ))}

        <button
          type="button"
          className="weather-console-off-hit"
          onClick={handleToggleClick}
          aria-label="Toggle rain"
        />

        <button
          type="button"
          className="weather-console-close-hit"
          onClick={handleCloseClick}
          aria-label="Close weather app"
        />

        <div className="weather-knob-hitarea">
          <div
            className="weather-knob-needle"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          >
            <svg
              className="weather-knob-svg"
              viewBox="0 0 6 20"
              aria-hidden="true"
            >
              <polygon points="3,0 0,20 6,20" fill="#333333" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [lampOn, setLampOn] = useState(true)
  const [sceneState, setSceneState] = useState('desk') // 'desk' | 'transitioning' (pivot+zoom) | 'focused'
  const [pivotActive, setPivotActive] = useState(false) // true during Phase 1 (1800ms)
  const {
    isOn:       isRainActive,
    volume:     rainVolume,
    toggleOnOff: toggleRain,
    changeVolume,
  } = useRainAudio()
  const [activeApp, setActiveApp] = useState(null) // 'Cloud' | 'Home' | etc.
  const uiClickAudioRef = useRef(null)
  const lampTickAudioRef = useRef(null)

  const playUiClick = () => {
    if (!uiClickAudioRef.current && typeof Audio !== 'undefined') {
      uiClickAudioRef.current = new Audio('/audio/UI_Click.mp3')
    }
    if (uiClickAudioRef.current) {
      uiClickAudioRef.current.currentTime = 0
      uiClickAudioRef.current.play().catch(() => {})
    }
  }

  const handleLampToggle = () => {
    if (!lampTickAudioRef.current && typeof Audio !== 'undefined') {
      lampTickAudioRef.current = new Audio('/audio/Tick.mp3')
    }
    if (lampTickAudioRef.current) {
      lampTickAudioRef.current.currentTime = 0
      lampTickAudioRef.current.play().catch(() => {})
    }
    setLampOn(v => !v)
  }

  const handleReturnToDesk = () => {
    // Phase 3: Home icon — fade out laptop view, fade desk back in
    setPivotActive(false)
    setSceneState('desk')
  }

  const handleAppIconClick = (appName) => {
    playUiClick()
    if (appName === 'Home') {
      handleReturnToDesk()
      setActiveApp(null)
    } else if (appName === 'Cloud') {
      setActiveApp(current => (current === 'Cloud' ? null : 'Cloud'))
    } else {
      // Placeholder interactions for other apps
      console.log(`${appName} app clicked`)
    }
  }

  const handleLaptopPivot = (e) => {
    e.stopPropagation()
    if (sceneState !== 'desk' || pivotActive) return
    playUiClick()
    setPivotActive(true)
    setSceneState('transitioning')
  }

  // Unmount #desk-scene after 1800ms (600ms delay + 1200ms fade = pivot and zoom both done)
  useEffect(() => {
    if (sceneState !== 'transitioning') return
    const id = setTimeout(() => {
      setSceneState('focused')
      setPivotActive(false)
    }, 1800)
    return () => clearTimeout(id)
  }, [sceneState])

  // Reveal laptop-view one frame after transitioning starts so opacity 0→1 animates
  const [zoomLayerReveal, setZoomLayerReveal] = useState(false)
  useEffect(() => {
    if (sceneState === 'transitioning' || sceneState === 'focused') {
      const id = requestAnimationFrame(() => setZoomLayerReveal(true))
      return () => cancelAnimationFrame(id)
    }
    if (sceneState === 'desk') setZoomLayerReveal(false)
  }, [sceneState])

  // Hard-kill any Pinterest hover buttons injected into the page
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const removePinterestButtons = () => {
      const nodes = document.querySelectorAll('[data-test-id="pinterest-save-button"]')
      nodes.forEach(node => node.remove())
    }

    // Remove anything that already exists
    removePinterestButtons()

    // Watch for future injections and remove them immediately
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return

          if (node.matches('[data-test-id="pinterest-save-button"]')) {
            node.remove()
            return
          }

          const descendants = node.querySelectorAll('[data-test-id="pinterest-save-button"]')
          descendants.forEach(el => el.remove())
        })
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  const sceneClass = [
    'scene-root',
    lampOn ? 'scene-lit' : 'scene-dim',
    !lampOn ? 'scene-window-emphasis' : '',
  ].join(' ')

  const isZoomed = sceneState === 'transitioning' || sceneState === 'focused'

  return (
    <div className={sceneClass}>
      {/* Laptop zoom: rain between BG and View (only when zoomed) */}
      {isZoomed && isRainActive && (
        <Rain zoomed={true} zoomLayerReveal={zoomLayerReveal} />
      )}

      {/* Desk world: cross-fade out (opacity only) over 1000ms; unmounted when focused */}
      {sceneState !== 'focused' && (
        <div
          id="desk-scene"
          className={`desk-scene ${sceneState === 'transitioning' ? 'desk-scene-zoom-out' : ''}`}
        >
      {/* ── L1: City view ───────────────────────────────────────────────────────────── */}
      <img src="/assets/View_v2.png" className="asset-layer asset-city" alt="" draggable={false} />

      {/* ── L2: Rain behind room so it shows through the window only ────────────────── */}
      {isRainActive && <Rain />}

      {/* ── L3a: Lava lamp blobs ───────────────────────────────────────────────────── */}
      <LavaLamp lampOn={lampOn} />
      {/* Reflect Mode: blobs light the desk around the lamp via screen blend */}
      <div
        className="lava-blob-ambient"
        style={{ opacity: lampOn ? 0 : 1 }}
        aria-hidden
      />

      {/* ── L3b: Clock hands (behind PNG cutout) ───────────── */}
      {/* Tune: .clock-face top / left / width / height in CSS  */}
      <ClockHands />

      {/* ── L4: Room — window frame + desk surface ─────────── */}
      <img src="/assets/Room_v1.png" className="asset-layer asset-room" alt="" draggable={false} />

      {/* ── L5: Desk objects ──────────────────────────────── */}

      <img
        src="/assets/Plant_v1.png"
        className="asset-layer asset-desk plant-sway"
        alt="" draggable={false}
      />

      <img
        src="/assets/Lava_Lamp_v1.png"
        className="asset-layer asset-desk asset-lava"
        alt="" draggable={false}
      />

      <img
        src="/assets/Succulent_v1.png"
        className="asset-layer asset-desk"
        alt="" draggable={false}
      />

      <img
        src="/assets/Notebook_v1.png"
        className="asset-layer asset-desk asset-notebook"
        alt="" draggable={false}
      />

      <img
        src="/assets/Sticky_Note_v1.png"
        className="asset-layer asset-desk asset-sticky"
        alt="" draggable={false}
      />

      {/* Clock frame — hands render behind this */}
      <img
        src="/assets/Clock_v1.png"
        className="asset-layer asset-desk asset-clock"
        alt=""
        draggable={false}
      />

      {/* Phase 1: Pivot wrap (pointer-events: none); only the hitbox triggers transition so background clicks do nothing */}
      <div className="laptop-pivot-wrap">
        <div
          className="laptop-pivot-hitbox"
          onClick={handleLaptopPivot}
          title="Focus laptop"
          aria-label="Focus laptop view"
        />
        <img
          src="/assets/Laptop_Angle_Screen1_v1.png"
          className={`laptop-pivot-img laptop-pivot-part-a ${pivotActive || sceneState === 'transitioning' ? 'laptop-pivot-part-a-fade-out' : ''}`}
          alt=""
          draggable={false}
        />
        <img
          src="/assets/Laptop_Angle_Screen2_v1.png"
          className={`laptop-pivot-img laptop-pivot-part-b ${pivotActive || sceneState === 'transitioning' ? 'laptop-pivot-part-b-fade-out' : ''}`}
          alt=""
          draggable={false}
        />
        <img
          src="/assets/Laptop_Center_Screen_v1.png"
            className={`laptop-pivot-img laptop-pivot-center ${pivotActive || sceneState === 'transitioning' ? 'laptop-pivot-fade-in' : ''}`}
          alt=""
          draggable={false}
        />
      </div>

      {/* Desk lamp image (visual only) */}
      <img
        src="/assets/Desk_Lamp_v1.png"
        className="asset-layer asset-lamp asset-desk-lamp"
        alt="Desk lamp"
        draggable={false}
      />

      {/* Lit bulb asset + glow — only when lamp is on */}
      <img
        src="/assets/Lightbulb_v1.png"
        className="asset-layer asset-lamp asset-lamp-bulb"
        alt=""
        draggable={false}
        style={{ opacity: lampOn ? 1 : 0 }}
      />

      {/* Small hitbox over lamp that handles clicks */}
      <div
        className="lamp-hitbox"
        onClick={handleLampToggle}
        title={lampOn ? 'Turn off lamp' : 'Turn on lamp'}
      />

      {/* ── L6: Lighting overlays ─────────────────────────── */}

      {/* Warm amber pool — lamp ON only */}
      <div className="lamp-warm-overlay" style={{ opacity: lampOn ? 1 : 0 }} />
        </div>
      )}

      {/* Laptop zoom stack: BG, then rain (same component visible in both scenes), then View */}
      {isZoomed && (
        <>
          <div className={`laptop-view-bg-layer ${zoomLayerReveal ? 'laptop-view-bg-layer-visible' : ''}`}>
            <img src="/assets/Laptop_View_BG.png" className="laptop-view-bg-img" alt="" draggable={false} />
          </div>
          <div className={`laptop-view-layer ${zoomLayerReveal ? 'laptop-view-layer-visible' : ''}`}>
            <div className="laptop-screen-content" aria-hidden={false}>
              <div className={`laptop-screen-grid ${activeApp ? 'laptop-screen-grid--hidden' : ''}`}>
                <button
                  type="button"
                  className="laptop-screen-icon"
                  onClick={() => handleAppIconClick('Home')}
                >
                  <img src="/assets/Home_Icon.png" alt="Home app" draggable={false} />
                </button>
                <button
                  type="button"
                  className="laptop-screen-icon"
                  onClick={() => handleAppIconClick('Log')}
                >
                  <img src="/assets/Log_Icon.png" alt="Log app" draggable={false} />
                </button>
                <button
                  type="button"
                  className="laptop-screen-icon"
                  onClick={() => handleAppIconClick('Mug')}
                >
                  <img src="/assets/Mug_Icon.png" alt="Mug app" draggable={false} />
                </button>
                <button
                  type="button"
                  className={`laptop-screen-icon ${isRainActive ? 'laptop-screen-icon--cloud-active' : ''}`}
                  onClick={() => handleAppIconClick('Cloud')}
                >
                  <img src="/assets/Cloud_Icon.png" alt="Cloud app" draggable={false} />
                </button>
                <button
                  type="button"
                  className="laptop-screen-icon"
                  onClick={() => handleAppIconClick('Radio')}
                >
                  <img src="/assets/Radio_Icon.png" alt="Radio app" draggable={false} />
                </button>
                <button
                  type="button"
                  className="laptop-screen-icon"
                  onClick={() => handleAppIconClick('Wrench')}
                >
                  <img src="/assets/Wrench_Icon.png" alt="Wrench app" draggable={false} />
                </button>
              </div>
              {activeApp === 'Cloud' && (
                <div className="weather-app-window" onClick={e => e.stopPropagation()}>
                  <WeatherConsole
                    isRainActive={isRainActive}
                    rainVolume={rainVolume}
                    onToggleRain={toggleRain}
                    onChangeVolume={changeVolume}
                    onClose={() => setActiveApp(null)}
                  />
                </div>
              )}
            </div>
            <img src="/assets/Laptop_View_v1.png" className="laptop-view-img" alt="" draggable={false} />
          </div>
        </>
      )}

    </div>
  )
}
