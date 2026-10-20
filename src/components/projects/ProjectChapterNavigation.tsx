export function ProjectChapterNavigation({ index, total, onChange }: { index: number; total: number; onChange: (index: number) => void }) {
  if (total <= 1) return null
  return <nav className="carousel-controls project-chapter-navigation" aria-label="Project chapters">
    <button aria-label="Previous chapter" disabled={index === 0} onClick={() => onChange(index - 1)}>‹</button>
    <output aria-live="polite" aria-atomic="true">{index + 1}/{total}</output>
    <button aria-label="Next chapter" disabled={index === total - 1} onClick={() => onChange(index + 1)}>›</button>
  </nav>
}
