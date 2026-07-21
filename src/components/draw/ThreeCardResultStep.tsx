import { Link } from 'react-router-dom'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const POSITION_LABELS = ['过去', '现在', '未来']

export default function ThreeCardResultStep() {
  const { drawnCards, question, reset } = useReadingSession()

  if (drawnCards.length < 3) {
    return null
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-margin-mobile pt-32 pb-section-padding">
      {question ? (
        <p className="mb-stack-lg font-tagline-italic text-tagline-italic text-highlight-lavender italic">
          关于「{question}」，星辰的指引是……
        </p>
      ) : null}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        {drawnCards.map((card, index) => {
          const orientationLabel = card.orientation === 'upright' ? '正位' : '逆位'
          return (
            <div key={card.id} className="flex flex-col items-center text-center">
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-stack-sm">
                {POSITION_LABELS[index]}
              </span>
              <div className="w-40 md:w-48 aspect-[2/3.5] mb-stack-sm">
                <TarotCard card={card} flipped />
              </div>
              <h2 className="font-display-md text-display-md text-primary mb-1">
                {card.nameLocal} · {card.name.toUpperCase()}
              </h2>
              <span className="font-label-caps text-[11px] text-primary/70 tracking-[0.2em] mb-stack-sm">
                {orientationLabel}
              </span>
              <div className="flex flex-wrap justify-center gap-2 mb-stack-sm">
                {card.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 rounded-full border border-primary text-primary font-label-caps text-[11px] tracking-widest"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-stack-sm">
                {card.meaning}
              </p>
              <p className="font-body-md text-body-md text-on-surface bg-surface-container-low/50 p-4 rounded-xl border-l-4 border-primary w-full">
                {card.advice}
              </p>
            </div>
          )
        })}
      </div>

      <section className="w-full max-w-3xl mt-stack-lg bg-surface-container-low/50 p-6 rounded-xl border-l-4 border-primary">
        <h2 className="font-label-caps text-label-caps text-primary mb-stack-sm">整体指引</h2>
        <p className="font-body-md text-body-md text-on-surface">
          过去的{drawnCards[0].keywords[0]}，与现在的{drawnCards[1].keywords[0]}交织，指向未来的
          {drawnCards[2].keywords[0]}。
        </p>
      </section>

      <div className="mt-stack-lg flex flex-col gap-4 w-full max-w-md">
        <button
          type="button"
          onClick={reset}
          className="w-full py-5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95"
        >
          再抽一张
        </button>
        <Link
          to="/login"
          className="w-full py-5 rounded-full border border-primary/40 font-label-caps text-label-caps text-primary tracking-[0.2em] transition-all hover:bg-primary/5 active:scale-95 text-center"
        >
          保存此次占卜
        </Link>
      </div>
    </div>
  )
}
