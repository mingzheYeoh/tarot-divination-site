import { useState } from 'react'
import { useReadingSession } from '../../context/ReadingSessionContext'

export default function IntentionStep() {
  const { setQuestion, beginShuffle } = useReadingSession()
  const [value, setValue] = useState('')

  function handleSubmit() {
    setQuestion(value)
    beginShuffle()
  }

  return (
    <div className="flex flex-col items-center text-center gap-stack-lg px-margin-mobile pt-32 pb-section-padding min-h-screen justify-center">
      <h1 className="font-display-lg text-display-lg text-highlight-lavender drop-shadow-[0_0_10px_rgba(232,223,255,0.5)]">
        静下心来，默念你的问题
      </h1>

      <div className="relative mt-8">
        <div className="absolute inset-0 rounded-full bg-highlight-lavender/10 blur-3xl scale-150 animate-pulse" />
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/20 bg-gradient-to-tr from-background-void via-glow-violet to-highlight-lavender/20 flex items-center justify-center shadow-[inset_0_0_50px_rgba(232,223,255,0.2)] animate-pulse-glow overflow-hidden">
          <div className="w-1/3 h-1/3 bg-highlight-lavender rounded-full blur-2xl opacity-60" />
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-stack-md">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="输入你想问的问题(可选)"
          className="w-full bg-transparent border-b border-primary/40 py-4 px-2 text-center font-tagline-italic text-tagline-italic text-on-surface-variant focus:outline-none focus:border-primary transition-all duration-700 placeholder:opacity-50 placeholder:italic"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="group relative mt-10 px-12 py-4 rounded-full border border-primary/80 bg-background-void overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(235,193,102,0.2)]"
        >
          <span className="relative z-10 font-label-caps text-label-caps text-primary tracking-[0.2em] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            开始洗牌
          </span>
        </button>
      </div>
    </div>
  )
}
