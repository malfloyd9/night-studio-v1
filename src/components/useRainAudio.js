// useRainAudio.js — Howler scaffold
// Drop rain.mp3 into /public/audio/ to activate
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'

const DEFAULT_VOLUME = 0.6
const FADE_MS        = 1200

export default function useRainAudio() {
  const rainRef    = useRef(null)
  const [isOn, setIsOn]       = useState(false)
  const [volume, setVolume]   = useState(DEFAULT_VOLUME)

  useEffect(() => {
    rainRef.current = new Howl({
      src:     ['/audio/Rain_v1.mp3'],
      format:  ['mp3'],
      loop:    true,
      volume:  0,
      html5:   true, // use HTML5 <audio> to avoid Web Audio decode issues
      preload: true,
      onloaderror: (id, err) => {
        console.warn('[Night Studio] Rain_v1.mp3 load error — check /public/audio/Rain_v1.mp3', err)
      },
    })
    return () => rainRef.current?.unload()
  }, [])

  useEffect(() => {
    if (!rainRef.current) return
    rainRef.current.volume(volume)
  }, [volume])

  const ensureStarted = () => {
    if (!rainRef.current) return
    if (!rainRef.current.playing()) {
      rainRef.current.play()
    }
  }

  const toggleOnOff = () => {
    if (!rainRef.current) return
    ensureStarted()
    if (!isOn) {
      const target = volume === 0 ? DEFAULT_VOLUME : volume
      if (volume === 0) setVolume(DEFAULT_VOLUME)
      rainRef.current.fade(rainRef.current.volume(), target, FADE_MS)
      setIsOn(true)
    } else {
      rainRef.current.fade(rainRef.current.volume(), 0, FADE_MS)
      setIsOn(false)
    }
  }

  const changeVolume = (next) => {
    const v = Math.min(1, Math.max(0, next))
    setVolume(v)
    if (!rainRef.current || !isOn) return
    rainRef.current.fade(rainRef.current.volume(), v, FADE_MS)
  }

  return { isOn, volume, toggleOnOff, changeVolume, start: ensureStarted }
}
