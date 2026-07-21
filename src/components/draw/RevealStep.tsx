import { useState } from 'react'
import { useReadingSession, spreadSize } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

export default function RevealStep() {
  const { drawnCard, drawnCards, activeSpread, finishReveal } = useReadingSession()
  const [isFlipped, setIsFlipped] = useState(false)

  const totalPositions = spreadSize(activeSpread)
  const currentPosition = drawnCards.length
  const isLastPosition = currentPosition >= totalPositions

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      {totalPositions > 1 ? (
        <p className="mb-stack-md font-label-caps text-label-caps text-primary tracking-[0.3em]">
          {currentPosition} / {totalPositions}
        </p>
      ) : null}

      <div className="w-72 md:w-80 h-[500px]">
        <TarotCard
          card={drawnCard}
          flipped={isFlipped}
          onClick={() => setIsFlipped(true)}
          ariaLabel={
            isFlipped && drawnCard ? `${drawnCard.nameLocal} · ${drawnCard.name}` : '点击翻牌'
          }
        />
      </div>

      {isFlipped ? (
        <div className="mt-stack-lg">
          <button
            type="button"
            onClick={finishReveal}
            className="relative px-12 py-3 rounded-full border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md text-primary font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary/10 transition-all active:scale-95"
          >
            {isLastPosition ? '查看解读' : '揭示下一张'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
