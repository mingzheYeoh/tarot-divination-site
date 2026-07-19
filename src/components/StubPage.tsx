export default function StubPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-margin-mobile pt-32 pb-section-padding">
      <p className="font-tagline-italic text-tagline-italic text-on-surface-variant">{message}</p>
    </div>
  )
}
