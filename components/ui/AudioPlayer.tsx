'use client'
import { useRef, useState, useEffect } from 'react'
import { formatDuration } from '@/lib/utils'

// Props du lecteur audio accessible
interface AudioPlayerProps {
  src: string
  label: string
}

// Lecteur audio stylisé avec contrôles accessibles clavier
export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Synchronisation de l'état React avec les événements audio natifs
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    function onTimeUpdate() { setCurrentTime(audio!.currentTime) }
    function onDurationChange() { setDuration(audio!.duration || 0) }
    function onEnded() { setIsPlaying(false) }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Bascule lecture / pause
  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  // Positionne la tête de lecture sur la valeur choisie
  function seek(value: number) {
    if (audioRef.current) audioRef.current.currentTime = value
    setCurrentTime(value)
  }

  // Avance ou recule de `delta` secondes (±10s)
  function skip(delta: number) {
    if (!audioRef.current) return
    const next = Math.max(0, Math.min(duration, currentTime + delta))
    audioRef.current.currentTime = next
    setCurrentTime(next)
  }

  return (
    <div
      role="region"
      aria-label={label}
      className="card p-5"
    >
      {/* Titre du lecteur */}
      <h2
        className="text-base font-semibold manuscript-margin mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {label}
      </h2>

      {/* Élément audio natif caché — contrôles custom accessibles ci-dessous */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3 mb-3">
        {/* Bouton Play / Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--teal)', color: 'var(--cream)' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Reculer de 10 secondes */}
        <button
          onClick={() => skip(-10)}
          aria-label="Reculer de 10 secondes (−10)"
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
          style={{ border: '1px solid var(--border)', color: 'var(--ink-soft)' }}
        >
          −10
        </button>

        {/* Avancer de 10 secondes */}
        <button
          onClick={() => skip(10)}
          aria-label="Avancer de 10 secondes (+10)"
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
          style={{ border: '1px solid var(--border)', color: 'var(--ink-soft)' }}
        >
          +10
        </button>

        {/* Indicateur temps courant / durée totale */}
        <span className="text-xs ml-auto" style={{ color: 'var(--ink-soft)' }}>
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
      </div>

      {/* Barre de progression — input[type=range] natif pour navigation clavier */}
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        step={0.1}
        aria-label="Position de lecture"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatDuration(currentTime)} sur ${formatDuration(duration)}`}
        onChange={e => seek(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--teal) ${(currentTime / (duration || 1)) * 100}%, var(--border) 0%)`,
          accentColor: 'var(--teal)',
        }}
      />
    </div>
  )
}
