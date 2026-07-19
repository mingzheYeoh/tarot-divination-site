import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const TOTAL_CARDS = 15
const ARC_SPREAD_DEGREES = 50

export default function SelectStep() {
  const { selectCard } = useReadingSession()

  return (
    <div className="flex flex-col items-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      <div className="mb-stack-lg text-center">
        <h1 className="font-display-md text-display-md text-primary mb-2">选择召唤你的那张牌</h1>
        <p className="font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
          静下心来，跟随你直觉的指引
        </p>
      </div>

      <div className="relative w-full max-w-3xl h-[420px] flex items-end justify-center">
        {Array.from({ length: TOTAL_CARDS }, (_, i) => {
          const angle = (i / (TOTAL_CARDS - 1)) * ARC_SPREAD_DEGREES - ARC_SPREAD_DEGREES / 2
          return (
            <button
              key={i}
              type="button"
              onClick={selectCard}
              aria-label="选这张牌"
              className="absolute bottom-0 left-1/2 w-24 h-40 md:w-32 md:h-52 -ml-12 md:-ml-16 transition-transform duration-500 hover:-translate-y-16 hover:z-50"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'bottom center',
                zIndex: i,
              }}
            >
              <TarotCard flipped={false} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
