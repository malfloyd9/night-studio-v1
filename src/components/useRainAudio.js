// useRainAudio.js — Howler scaffold
// Drop rain.mp3 into /public/audio/ to activate
import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

const VOLUME_ON  = 0.5
const VOLUME_OFF = 0.75
const FADE_MS    = 1200

export default function useRainAudio(lampOn) {
  const rainRef    = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    rainRef.current = new Howl({
      src: ['/audio/rain.mp3'],
      loop: true,
      volume: VOLUME_ON,
      onloaderror: (id, err) => console.warn('[Night Studio] rain.mp3 missing — drop into /public/audio/', err),
    })
    return () => rainRef.current?.unload()
  }, [])

  const start = () => {
    if (startedRef.current) return
    startedRef.current = true
    rainRef.current?.play()
  }

  useEffect(() => {
    if (!rainRef.current || !startedRef.current) return
    const target = lampOn ? VOLUME_ON : VOLUME_OFF
    rainRef.current.fade(rainRef.current.volume(), target, FADE_MS)
  }, [lampOn])

  return { start }
}
