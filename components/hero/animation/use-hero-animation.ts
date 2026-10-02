import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { createIntro } from './intro'
import { createScrollScene } from './scroll-scene'

/**
 * Wires up the hero's animations. `scope` is the hero's root element; all
 * lookups are scoped to it via `data-hero` attributes.
 *
 * Users who prefer reduced motion get no intro and no pinned scroll scene:
 * the markup is already in its final, fully visible state (see globals.css).
 */
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const stopIntro = createIntro(root)
        const stopScene = createScrollScene(root)
        return () => {
          stopScene()
          stopIntro()
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}
