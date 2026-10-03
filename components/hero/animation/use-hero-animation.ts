import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { startSmoothScroll } from '@/lib/smooth-scroll'
import { createIntro } from './intro'
import { createScrollScene } from './scroll-scene'

/**
 * Wires up the hero's animations. `scope` is the hero's root element; all
 * lookups are scoped to it via `data-hero` attributes.
 *
 * Users who prefer reduced motion get no intro, no smooth scrolling and no
 * pinned scroll scene: the markup is already in its final, fully visible state
 * (see globals.css).
 */
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const stopSmoothScroll = startSmoothScroll()
        const stopIntro = createIntro(root)
        const stopScene = createScrollScene(root, { smooth: true })
        return () => {
          stopScene()
          stopIntro()
          stopSmoothScroll()
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}
