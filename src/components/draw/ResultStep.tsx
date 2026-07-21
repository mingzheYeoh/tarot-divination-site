import { Link } from 'react-router-dom'
import { useReadingSession } from '../../context/ReadingSessionContext'
import TarotCard from './TarotCard'

const ROMAN_NUMERALS = [
  '0',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI',
]

const RANK_LABELS = [
  '',
  'ACE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'PAGE',
  'KNIGHT',
  'QUEEN',
  'KING',
]

const SUIT_LABELS: Record<string, string> = {
  wands: 'WANDS',
  cups: 'CUPS',
  swords: 'SWORDS',
  pentacles: 'PENTACLES',
}

function arcanaCaption(drawnCard: { id: string }): string {
  if (drawnCard.id.startsWith('major_')) {
    return `MAJOR ARCANA ${ROMAN_NUMERALS[Number(drawnCard.id.replace('major_', ''))]}`
  }
  const [suit, numStr] = drawnCard.id.split('_')
  return `${SUIT_LABELS[suit]} · ${RANK_LABELS[Number(numStr)]}`
}

export default function ResultStep() {
  const { drawnCard, question, reset } = useReadingSession()

  if (!drawnCard) {
    return null
  }

  const orientationLabel = drawnCard.orientation === 'upright' ? '正位' : '逆位'

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-20">
      <section className="flex-1 flex flex-col items-center justify-center p-gutter">
        <div className="w-[280px] md:w-[320px] aspect-[2/3.5]">
          <TarotCard card={drawnCard} flipped />
        </div>
        <div className="mt-6 px-6 py-2 rounded-full border border-primary/20 bg-surface-container-low/80 backdrop-blur-md">
          <span className="font-label-caps text-label-caps text-primary">{orientationLabel}</span>
        </div>
      </section>

      <aside className="w-full md:w-[500px] bg-surface-container-lowest/60 backdrop-blur-xl border-l border-primary/20 flex flex-col p-10">
        <div className="space-y-4 mb-stack-lg">
          <span className="font-label-caps text-[12px] tracking-[0.2em] text-primary/70">
            {arcanaCaption(drawnCard)}
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">
            {drawnCard.nameLocal} · {drawnCard.name.toUpperCase()}
          </h1>
          <div className="flex flex-wrap gap-stack-sm pt-2">
            {drawnCard.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-4 py-1.5 rounded-full border border-primary text-primary font-label-caps text-[12px] tracking-widest"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-stack-lg flex-1">
          {question ? (
            <p className="font-tagline-italic text-tagline-italic text-highlight-lavender italic">
              关于「{question}」，星辰的指引是……
            </p>
          ) : null}

          <section>
            <h2 className="font-tagline-italic text-tagline-italic text-highlight-lavender mb-stack-sm italic">
              牌意解读
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {drawnCard.meaning}
            </p>
          </section>

          <section className="bg-surface-container-low/50 p-6 rounded-xl border-l-4 border-primary">
            <h2 className="font-label-caps text-label-caps text-primary mb-stack-sm">给你的建议</h2>
            <p className="font-body-md text-body-md text-on-surface">{drawnCard.advice}</p>
          </section>
        </div>

        <div className="mt-auto pt-stack-lg flex flex-col gap-4">
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
      </aside>
    </div>
  )
}
