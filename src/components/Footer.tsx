export default function Footer() {
  return (
    <footer className="relative z-20 w-full py-section-padding bg-background-void border-t border-outline-variant/20">
      <div className="flex flex-col items-center gap-stack-lg max-w-container-max mx-auto text-center px-margin-mobile">
        <div className="font-display-lg text-display-lg text-primary">Midnight Oracle</div>
        <div className="flex gap-stack-lg">
          <a
            className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            隐私政策
          </a>
          <a
            className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            服务条款
          </a>
          <a
            className="font-body-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            联系我们
          </a>
        </div>
        <p className="font-body-md text-on-surface-variant/60 text-sm italic">
          © {new Date().getFullYear()} Midnight Oracle. 愿星辰指引你的道路。
        </p>
      </div>
    </footer>
  )
}
