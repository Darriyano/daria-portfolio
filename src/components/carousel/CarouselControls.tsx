export function CarouselControls({ index, total, onChange }: { index: number; total: number; onChange: (index: number) => void }) {
  return <div className="carousel-controls" aria-label="Project navigation">
    <button aria-label="Previous project" disabled={total <= 1} onClick={() => onChange(index - 1)}>‹</button>
    <output aria-live="polite" aria-atomic="true">{index + 1}/{total}</output>
    <button aria-label="Next project" disabled={total <= 1} onClick={() => onChange(index + 1)}>›</button>
  </div>
}
