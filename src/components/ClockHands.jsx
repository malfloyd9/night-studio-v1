import { useState, useEffect } from 'react'

export default function ClockHands() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const h = time.getHours() % 12
  const m = time.getMinutes()
  const s = time.getSeconds()
  const hourDeg   = (h * 30) + (m * 0.5)
  const minuteDeg = (m * 6)  + (s * 0.1)
  return (
    <div className="clock-face">
      <div className="clock-hand clock-hand-hour"   style={{ transform: `rotate(${hourDeg}deg)`   }} />
      <div className="clock-hand clock-hand-minute" style={{ transform: `rotate(${minuteDeg}deg)` }} />
    </div>
  )
}
