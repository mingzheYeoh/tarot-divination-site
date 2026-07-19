import { useState } from 'react'

export default function AtmosphereLayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background-void pointer-events-none">
        <div className="absolute inset-0 starfield" />
        <div className="absolute inset-0 nebula" />
        <div className="absolute inset-0 film-grain" />
      </div>
      <button
        type="button"
        onClick={() => setIsPlaying((playing) => !playing)}
        aria-pressed={isPlaying}
        aria-label="氛围音乐"
        className="fixed bottom-8 right-8 z-50 bg-surface-container-lowest/50 backdrop-blur-xl border border-primary/40 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(235,193,102,0.3)] hover:scale-110 hover:shadow-[0_0_20px_rgba(235,193,102,0.5)] transition-all active:rotate-12 animate-pulse-slow"
      >
        <span className="material-symbols-outlined text-primary text-2xl">
          {isPlaying ? 'volume_up' : 'brightness_3'}
        </span>
      </button>
    </>
  )
}
