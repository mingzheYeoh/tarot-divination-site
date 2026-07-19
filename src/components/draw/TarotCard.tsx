import type { DrawnCard } from '../../lib/drawCard'
import './draw.css'

interface TarotCardProps {
  card?: DrawnCard | null
  flipped: boolean
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

export default function TarotCard({
  card,
  flipped,
  onClick,
  ariaLabel,
  className = '',
}: TarotCardProps) {
  const showFront = Boolean(card) && flipped

  const inner = (
    <div
      className={`card-flip-container w-full h-full ${className}`}
      aria-hidden={onClick ? true : undefined}
    >
      <div className={`card-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="card-face card-face-back rounded-xl bg-card-back border-2 border-primary/40 shadow-xl flex flex-col items-center justify-center overflow-hidden">
          <div className="w-16 h-16 border-2 border-primary/60 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
          </div>
        </div>
        <div className="card-face card-face-front rounded-xl bg-background border border-primary/60 shadow-[0_0_30px_rgba(235,193,102,0.3)] overflow-hidden flex flex-col">
          {showFront && card ? (
            <>
              <img className="w-full flex-1 object-cover" src={card.image} alt={card.name} />
              <div className="py-3 flex flex-col items-center bg-background/50">
                <span className="font-display-md text-[20px] text-primary tracking-widest">
                  {card.nameLocal}
                </span>
                <span className="font-label-caps text-[10px] text-primary/60 tracking-[0.3em] mt-1">
                  {card.name.toUpperCase()}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="block w-full h-full text-left"
      >
        {inner}
      </button>
    )
  }

  return inner
}
