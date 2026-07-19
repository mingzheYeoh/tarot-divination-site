import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: '首页' },
  { to: '/draw', label: '抽牌占卜' },
  { to: '/encyclopedia', label: '牌意图鉴' },
  { to: '/about', label: '关于' },
]

export default function Nav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_4px_20px_rgba(42,27,61,0.5)]">
      <div className="flex justify-between items-center px-margin-mobile md:px-gutter max-w-container-max mx-auto h-20">
        <div className="font-display-md text-display-md text-primary tracking-widest cursor-pointer">
          MIDNIGHT ORACLE
        </div>
        <nav aria-label="主导航" className="hidden md:flex gap-stack-lg">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'font-label-caps text-label-caps text-primary border-b border-primary pb-1'
                  : 'font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-300'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-primary">
          <button
            type="button"
            className="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim transition-all duration-300 active:scale-95"
            aria-label="设置"
          >
            settings
          </button>
          <button
            type="button"
            className="material-symbols-outlined cursor-pointer hover:text-primary-fixed-dim transition-all duration-300 active:scale-95"
            aria-label="账户"
          >
            account_circle
          </button>
        </div>
      </div>
    </header>
  )
}
