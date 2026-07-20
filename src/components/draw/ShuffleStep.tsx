import { useEffect } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'
import './draw.css'

export default function ShuffleStep() {
  const { beginShuffle, finishShuffle } = useReadingSession()

  useEffect(() => {
    beginShuffle()
    const timer = setTimeout(finishShuffle, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="relative">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="rgba(235, 193, 102, 0.1)"
            strokeWidth="0.5"
          />
          <circle
            className="progress-ring-circle"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="#ebc166"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
        <div className="relative z-20 w-48 h-72 rounded-lg bg-card-back border-2 border-primary shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-2 border border-primary/40 rounded-md" />
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-2">
              brightness_high
            </span>
            <span className="font-label-caps text-label-caps text-primary/80">ORACLE</span>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center space-y-4">
        <h2 className="font-display-lg text-display-lg text-primary tracking-[0.2em] animate-pulse">
          命运正在交织...
        </h2>
        <p className="font-tagline-italic text-tagline-italic text-on-surface-variant italic">
          静候星辰的指引，牌阵正在苏醒
        </p>
      </div>
    </div>
  )
}
