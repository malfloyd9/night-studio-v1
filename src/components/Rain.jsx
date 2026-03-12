// Rain.jsx — painterly streaks, clipped to window region
// 50 streaks, variable length / opacity / speed, 6deg lean

const STREAK_COUNT = 50

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function Rain() {
  const streaks = Array.from({ length: STREAK_COUNT }, (_, i) => ({
    id:       i,
    left:     rand(0, 100),
    duration: rand(1.4, 2.6),
    delay:    rand(0, 4.0),
    height:   rand(8, 18),
    opacity:  rand(0.3, 0.6),
  }))

  return (
    <div className="rain-window-clip">
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
