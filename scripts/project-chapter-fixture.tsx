// Dev-only fixture: never imported by the production app or project catalog.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ProjectChapterNavigation } from '../src/components/projects/ProjectChapterNavigation'
// This module also exposes the imperative dev-only fixture mount.
// eslint-disable-next-line react-refresh/only-export-components
function Fixture() {
  const [index, setIndex] = useState(0)
  const [total, setTotal] = useState(3)
  return <><button onClick={() => { setIndex(0); setTotal(1) }}>Single chapter</button><p data-testid="fixture-chapter">Chapter {index + 1}</p><ProjectChapterNavigation index={index} total={total} onChange={setIndex} /></>
}
export function render() {
  const element = document.createElement('div')
  element.id = 'chapter-fixture'
  element.style.cssText = 'position:fixed;inset:0;background:#121212;padding:40px;z-index:200'
  document.body.append(element)
  createRoot(element).render(<Fixture />)
}
