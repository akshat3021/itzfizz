'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isFinePointer || isReducedMotion) {
      return
    }

    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const xDotTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const yDotTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const xRingTo = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power2.out' })
    const yRingTo = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power2.out' })
    const scaleRingTo = gsap.quickTo(ring, 'scale', { duration: 0.2, ease: 'power2.out' })
    const scaleDotTo = gsap.quickTo(dot, 'scale', { duration: 0.2, ease: 'power2.out' })
    const opacityToDot = gsap.quickTo(dot, 'opacity', { duration: 0.15 })
    const opacityToRing = gsap.quickTo(ring, 'opacity', { duration: 0.15 })

    let hasMoved = false

    const onPointerMove = (e: PointerEvent) => {
      if (!hasMoved) {
        hasMoved = true
        opacityToDot(1)
        opacityToRing(1)
      }
      xDotTo(e.clientX)
      yDotTo(e.clientY)
      xRingTo(e.clientX)
      yRingTo(e.clientY)

      const target = e.target as HTMLElement | null
      const isInteractive = target?.closest('a, button, [role="button"], input, select, textarea, label')
      if (isInteractive) {
        scaleRingTo(1.5)
        scaleDotTo(0.75)
      } else {
        scaleRingTo(1)
        scaleDotTo(1)
      }
    }

    const onPointerLeave = () => {
      opacityToDot(0)
      opacityToRing(0)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer soft ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-volt/50 bg-volt/10 opacity-0 will-change-transform"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt opacity-0 shadow-[0_0_8px_#c6f135] will-change-transform"
      />
    </div>
  )
}
