/**
 * 2D lava lamp: multiple blobs with CSS keyframes — rise, stretch, break, fall.
 * - Blobs originate at bottom (bulb); varied sizes, delays, speeds so they drift and overlap.
 * - Goo filter makes overlapping blobs look merged; glow layer = blurred copy of blobs.
 * - Color picker hidden; toggle by clicking the lamp area.
 */
import { useState } from 'react'

const VIEWBOX = { w: 180, h: 500 }
const BULB_Y = 455

// Blobs at bottom (bulb); variety of sizes, delays, speeds, wobble — overlap + drift = join/split feel
const BLOBS = [
  { cx: 85,  cy: BULB_Y, r: 16,  delay: 0,   speed: 28, direction: 'normal', wobble: 8,  swayDelay: 0 },
  { cx: 102, cy: BULB_Y, r: 34,  delay: 3,   speed: 34, direction: 'reverse', wobble: 12, swayDelay: 5 },
  { cx: 72,  cy: BULB_Y, r: 22,  delay: 7,   speed: 30, direction: 'normal', wobble: 6,  swayDelay: 11 },
  { cx: 118, cy: BULB_Y, r: 14,  delay: 11,  speed: 26, direction: 'reverse', wobble: 10, swayDelay: 3 },
  { cx: 95,  cy: BULB_Y, r: 30,  delay: 2,   speed: 32, direction: 'normal', wobble: 14, swayDelay: 8 },
  { cx: 62,  cy: BULB_Y, r: 18,  delay: 9,   speed: 29, direction: 'reverse', wobble: 7,  swayDelay: 14 },
  { cx: 108, cy: BULB_Y, r: 26,  delay: 5,   speed: 31, direction: 'normal', wobble: 9,  swayDelay: 2 },
  { cx: 78,  cy: BULB_Y, r: 12,  delay: 14,  speed: 24, direction: 'reverse', wobble: 11, swayDelay: 9 },
  { cx: 90,  cy: BULB_Y, r: 28,  delay: 4,   speed: 33, direction: 'normal', wobble: 5,  swayDelay: 16 },
  { cx: 68,  cy: BULB_Y, r: 20,  delay: 8,   speed: 27, direction: 'reverse', wobble: 13, swayDelay: 6 },
  { cx: 58,  cy: BULB_Y, r: 15,  delay: 6,   speed: 29, direction: 'normal', wobble: 7,  swayDelay: 12 },
  { cx: 125, cy: BULB_Y, r: 19,  delay: 10,  speed: 28, direction: 'reverse', wobble: 9,  swayDelay: 4 },
  { cx: 82,  cy: BULB_Y, r: 24,  delay: 1,   speed: 31, direction: 'normal', wobble: 10, swayDelay: 10 },
  { cx: 112, cy: BULB_Y, r: 17,  delay: 13,  speed: 25, direction: 'reverse', wobble: 6,  swayDelay: 7 },
  { cx: 65,  cy: BULB_Y, r: 21,  delay: 12,  speed: 30, direction: 'normal', wobble: 8,  swayDelay: 13 },
  { cx: 98,  cy: BULB_Y, r: 23,  delay: 15,  speed: 26, direction: 'reverse', wobble: 11, swayDelay: 1 },
]
// LofiLamp-style anchors: only sway (no rise), at pool and top — rising blobs merge into and break away
const ANCHOR_BLOBS = [
  { cx: 90, cy: BULB_Y, r: 38, swayDelay: 0, wobble: 14 },
  { cx: 90, cy: 55, r: 32, swayDelay: 11, wobble: 12 },
]

const LAVA_COLORS = [
  '#4bff91', '#ff4b4b', '#4b9fff', '#a64bff',
  '#ffb84b', '#ff4b9f', '#4bfff0',
]

function BlobCircles({ className }) {
  return (
    <g className={className}>
      {BLOBS.map((blob, i) => (
        <circle
          key={`r-${i}`}
          className="blob"
          cx={blob.cx}
          cy={blob.cy}
          r={blob.r}
          style={{
            ['--delay']: blob.delay,
            ['--speed']: blob.speed,
            ['--direction']: blob.direction,
            ['--wobble']: `${blob.wobble ?? 8}px`,
            ['--sway-delay']: blob.swayDelay ?? 0,
          }}
        />
      ))}
      {ANCHOR_BLOBS.map((blob, i) => (
        <circle
          key={`a-${i}`}
          className="blob blob--anchor"
          cx={blob.cx}
          cy={blob.cy}
          r={blob.r}
          style={{
            ['--wobble']: `${blob.wobble ?? 10}px`,
            ['--sway-delay']: blob.swayDelay ?? 0,
          }}
        />
      ))}
    </g>
  )
}

export default function LavaLamp({ lampOn }) {
  const [fillColor, setFillColor] = useState(LAVA_COLORS[0])
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleLampClick = (e) => {
    e.stopPropagation()
    setShowColorPicker((v) => !v)
  }

  return (
    <div
      className="lava-lamp-blobs"
      style={{
        ['--lava-fill']: fillColor,
      }}
      onClick={handleLampClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowColorPicker((v) => !v); } }}
      aria-label="Lava lamp; click to toggle color picker"
    >
      <svg
        className="lava-lamp__svg"
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="lava-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
              result="glow"
            />
          </filter>
          <filter id="lava-goo" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -5"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" mode="screen" />
          </filter>
        </defs>
        <g className="lava-lamp__glow" filter="url(#lava-glow)">
          <BlobCircles />
        </g>
        <g className="lava-lamp__lava" filter="url(#lava-goo)">
          <BlobCircles />
        </g>
      </svg>

      {showColorPicker && (
        <div className="lava-lamp-colors" onClick={(e) => e.stopPropagation()}>
          {LAVA_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`lava-lamp-color-btn ${fillColor === color ? 'active' : ''}`}
              style={{ background: color }}
              onClick={() => setFillColor(color)}
              title={`Lava color: ${color}`}
              aria-label={`Set lava color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
