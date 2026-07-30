export function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-text-muted">
      <p>{label} — content engine arrives in a later phase.</p>
    </div>
  )
}
