import { useReadingSession } from '../../context/ReadingSessionContext'

export default function SpreadSelectStep() {
  const { selectSpread } = useReadingSession()

  return (
    <div className="flex flex-col items-center text-center gap-stack-lg px-margin-mobile pt-32 pb-section-padding min-h-screen justify-center">
      <h1 className="font-display-lg text-display-lg text-highlight-lavender drop-shadow-[0_0_10px_rgba(232,223,255,0.5)]">
        选择你的牌阵
      </h1>

      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-stack-md mt-8">
        <button
          type="button"
          onClick={() => selectSpread('single')}
          className="flex-1 rounded-2xl border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md px-8 py-10 text-center transition-all duration-500 hover:scale-105 hover:border-primary active:scale-95"
        >
          <span className="block font-display-md text-display-md text-primary mb-stack-sm">
            单张指引
          </span>
          <span className="block font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
            抽一张牌，获得当下的直接指引
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectSpread('three-card')}
          className="flex-1 rounded-2xl border border-primary/40 bg-surface-container-lowest/30 backdrop-blur-md px-8 py-10 text-center transition-all duration-500 hover:scale-105 hover:border-primary active:scale-95"
        >
          <span className="block font-display-md text-display-md text-primary mb-stack-sm">
            三牌阵 · 过去现在未来
          </span>
          <span className="block font-tagline-italic text-tagline-italic text-on-surface-variant italic opacity-80">
            抽三张牌，展开一段完整的时间线索
          </span>
        </button>
      </div>
    </div>
  )
}
