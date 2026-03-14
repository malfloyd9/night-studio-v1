// App.jsx — Night Studio V1
// All assets use full-canvas positioning (1920x1080 natural coordinates).
// Lamp toggle drives scene-lit / scene-dim on root.
// Rain clipped to window via .rain-window-clip in index.css.
// Live elements (clock hands, laptop screen, lava glow) sit BEHIND
// their PNG cutouts — tune positions in Claude Code once running.

import { useState }   from 'react'
import Rain           from './components/Rain'
import ClockHands     from './components/ClockHands'
import LavaLamp       from './components/LavaLamp'
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

      {/* ── L1: City view — behind window (never dimmed for Reflect Mode) ─────────────────── */}
      <img src="/assets/View_v2.png" className="asset-layer asset-city" alt="" draggable={false} />

      {/* ── L2: Rain — clipped to window opening ──────────── */}
      <Rain />

      {/* ── L3a: Lava lamp blobs (behind lamp PNG); glow exception in Reflect Mode ──────── */}
      <LavaLamp lampOn={lampOn} />
      {/* Reflect Mode: blobs light the desk around the lamp via screen blend */}
      <div
        className="lava-blob-ambient"
        style={{ opacity: lampOn ? 0 : 1 }}
        aria-hidden
      />

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

      {/* Warm amber pool — lamp ON only; hidden when lamp OFF */}
      <div className="lamp-warm-overlay" style={{ opacity: lampOn ? 1 : 0 }} />

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
