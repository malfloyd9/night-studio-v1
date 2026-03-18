// Rain.jsx — visible in both desk (window clip) and laptop zoom (between BG and View)
// SFX is in App (useRainAudio); this component only handles visuals

const STREAK_COUNT = 120

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function Rain({ zoomed = false, zoomLayerReveal = false }) {
  const streaks = Array.from({ length: STREAK_COUNT }, (_, i) => ({
    id:       i,
    left:     rand(0, 100),
    duration: rand(.4, 1.2),
    delay:    rand(0, 4.0),
    height:   rand(10, 20),
    opacity:  rand(0.3, 0.6),
  }))

  const clipClass = 'rain-window-clip' + (zoomed ? ' rain-zoomed' : '') + (zoomed && zoomLayerReveal ? ' rain-zoomed-visible' : '')

  return (
    <div className={clipClass}>
      <div className="rain-container">
        {streaks.map(s => (
          <div
            key={s.id}
            className="rain-streak"
            style={{
              left:              `${s.left}%`,
              height:            `${s.height}px`,
              opacity:           s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay:    `-${s.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
