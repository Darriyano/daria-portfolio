import type { AnchorHTMLAttributes } from 'react'
import { navigateTo } from '../../routing/navigation'

export function InternalLink({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} onClick={event => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank' || props.download) return
    if (!props.href || new URL(props.href, location.href).origin !== location.origin) return
    event.preventDefault()
    navigateTo(props.href)
  }} />
}
