'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Small lime dot with a trailing ring. Only active for a precise hover pointer
 * (mouse/trackpad) and when the user has not asked for reduced motion; on
 * touch devices and for reduced-motion users nothing is shown and the native
 * cursor is left alone.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const dotEl = dot.current
      const ringEl = ring.current
      if (!dotEl || !ringEl) return

      gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50 })
      const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
      const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
      const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
      const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })

      let shown = false
      const onMove = (event: PointerEvent) => {
        if (!shown) {
          shown = true
          // First move: jump into place so the cursor doesn't fly in from 0,0.
          gsap.set([dotEl, ringEl], { x: event.clientX, y: event.clientY })
          gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.3 })
          document.documentElement.classList.add('has-custom-cursor')
        }
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
      }

      const interactive = 'a, button, [role="button"]'
      const onOver = (event: PointerEvent) => {
        if (!(event.target as Element | null)?.closest?.(interactive)) return
        gsap.to(ringEl, { scale: 1.7, duration: 0.3, ease: 'power3.out' })
        gsap.to(dotEl, { scale: 0.5, duration: 0.3, ease: 'power3.out' })
      }
      const onOut = (event: PointerEvent) => {
        if (!(event.target as Element | null)?.closest?.(interactive)) return
        gsap.to([ringEl, dotEl], { scale: 1, duration: 0.3, ease: 'power3.out' })
      }
      const onLeave = () => gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.2 })
      const onEnter = () => shown && gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.2 })

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver)
      document.addEventListener('pointerout', onOut)
      document.documentElement.addEventListener('pointerleave', onLeave)
      document.documentElement.addEventListener('pointerenter', onEnter)

      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.removeEventListener('pointerout', onOut)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        document.documentElement.removeEventListener('pointerenter', onEnter)
        document.documentElement.classList.remove('has-custom-cursor')
        gsap.set([dotEl, ringEl], { clearProps: 'all' })
      }
    })
    return () => mm.revert()
  })

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 size-10 rounded-full border-2 border-ink/40"
      />
      <div ref={dot} className="invisible absolute left-0 top-0 size-4 rounded-full border-2 border-ink bg-brand" />
    </div>
  )
}
