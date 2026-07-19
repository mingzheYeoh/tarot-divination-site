import { useState } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

export default function RevealStep() {
  const { drawnCard, finishReveal } = useReadingSession()
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="w-72 md:w-80 h-[500px]">
        <TarotCard
          card={drawnCard}
          flipped={isFlipped}
          onClick={isFlipped ? undefined : () => setIsFlipped(true)}
          ariaLabel="点击翻牌"
        />
      </div>

      {isFlipped ? (
        <div className="mt-stack-lg">
          <button
            type="button"
            onClick={finishReveal}
            className="relative px-12 py-3 rounded-full border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md text-primary font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary/10 transition-all active:scale-95"
          >
            查看解读
          </button>
        </div>
      ) : null}
    </div>
  )
}
