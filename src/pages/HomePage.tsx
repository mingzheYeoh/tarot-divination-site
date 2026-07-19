import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-[20%] left-[10%] w-32 h-56 bg-card-back rounded-lg border border-primary/20 floating-card parallax-deep opacity-30 blur-[2px] hidden md:block">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/30 text-4xl">star</span>
          </div>
        </div>
        <div className="absolute bottom-[15%] right-[15%] w-40 h-72 bg-card-back rounded-lg border border-primary/30 floating-card parallax-mid opacity-40 blur-[1px] hidden md:block">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/40 text-5xl">auto_awesome</span>
          </div>
        </div>
        <div className="absolute top-[60%] left-[5%] w-28 h-48 bg-card-back rounded-lg border border-primary/10 floating-card parallax-front opacity-20 blur-[3px]">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/20 text-3xl">brightness_7</span>
          </div>
        </div>
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-margin-mobile text-center pt-20">
        <div className="relative w-full max-w-[800px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 ornate-emblem opacity-60 animate-pulse-slow" />
          <div className="relative z-30 flex flex-col items-center gap-stack-md pt-stack-lg">
            <h1 className="font-display-lg text-[64px] md:text-display-lg text-primary tracking-[0.2em] drop-shadow-[0_0_15px_rgba(235,193,102,0.5)]">
              夜语塔罗
            </h1>
            <p className="font-tagline-italic text-tagline-italic text-highlight-lavender opacity-80 mt-4 italic tracking-wider">
              "在午夜时分，倾听命运的回响"
            </p>
            <div className="mt-stack-lg group">
              <Link
                to="/draw"
                className="relative px-12 py-4 rounded-full border-2 border-primary bg-background-void text-primary font-label-caps text-label-caps tracking-widest overflow-hidden transition-all duration-500 hover:text-on-primary-container active:scale-95 group shadow-[0_0_15px_rgba(235,193,102,0.2)] inline-flex items-center"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-background-void">
                  开始占卜
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                </span>
                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center bg-card-back shadow-lg group-hover:rotate-45 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[12px] text-primary">ac_unit</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-section-padding flex items-center justify-center gap-8 opacity-40 w-full max-w-md">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-primary to-primary" />
          <span className="material-symbols-outlined text-primary">nights_stay</span>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-primary to-primary" />
        </div>
      </main>
    </>
  )
}
