// App.jsx — Night Studio V1
// All assets use full-canvas positioning (1920x1080 natural coordinates).
// Lamp toggle drives scene-lit / scene-dim on root.
// Rain clipped to window via .rain-window-clip in index.css.
// Live elements (clock hands, laptop screen, lava glow) sit BEHIND
// their PNG cutouts — tune positions in Claude Code once running.

import { useState }   from 'react'
import Rain           from './components/Rain'
import ClockHands     from './components/ClockHands'
import useRainAudio   from './components/useRainAudio'

export default function App() {
  const [lampOn, setLampOn] = useState(true)
  const { start, isOn: rainOn, volume: rainVolume, toggleOnOff: toggleRain, changeVolume } = useRainAudio()

  const handleLampToggle = () => {
    setLampOn(v => !v)
  }

  const sceneClass = [
    'scene-root',
    lampOn ? 'scene-lit' : 'scene-dim',
    !lampOn ? 'scene-window-emphasis' : '',
  ].join(' ')

  return (
    <div className={sceneClass} onClick={start}>

      {/* ── L1: City view — behind window ─────────────────── */}
      <img src="/assets/View_v1.png" className="asset-layer" alt="" draggable={false} />

      {/* ── L2: Rain — clipped to window opening ──────────── */}
      <Rain />

      {/* ── L3a: Lava lamp interior glow (behind PNG) ──────── */}
      <div className="lava-lamp-glow" style={{ opacity: lampOn ? 1 : 0.4 }}>
        <div className="lava-glow-inner" />
      </div>

      {/* ── L3b: Laptop screen div (behind PNG cutout) ─────── */}
      {/* Tune: top / left / width / height in Claude Code      */}
      <div className="laptop-screen">
        <div className="cursor-blink" />
      </div>

      {/* ── L3c: Clock hands (behind PNG cutout) ───────────── */}
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

      {/* Laptop — screen div renders behind this */}
      <img
        src="/assets/Laptop_v1.png"
        className="asset-layer asset-desk asset-near-lamp"
        alt=""
        draggable={false}
      />

      {/* Desk lamp image (visual only) */}
      <img
        src="/assets/Desk_Lamp_v1.png"
        className="asset-layer asset-lamp asset-desk-lamp"
        alt="Desk lamp"
        draggable={false}
      />

      {/* Small hitbox over lamp that handles clicks */}
      <div
        className="lamp-hitbox"
        onClick={handleLampToggle}
        title={lampOn ? 'Turn off lamp' : 'Turn on lamp'}
      />

      {/* ── L6: Lighting overlays ─────────────────────────── */}

      {/* Warm amber pool — lamp ON */}
      <div className="lamp-warm-overlay" style={{ opacity: lampOn ? 1 : 0 }} />

      {/* Cool dark wash — lamp OFF */}
      <div className="desk-dim-overlay" style={{ opacity: lampOn ? 0 : 1 }} />

      {/* Rain audio controls (simple overlay) */}
      <div className="rain-controls" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={toggleRain}>
          {rainOn ? 'Rain: On' : 'Rain: Off'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={rainVolume}
          onChange={e => changeVolume(parseFloat(e.target.value))}
        />
      </div>

    </div>
  )
}
