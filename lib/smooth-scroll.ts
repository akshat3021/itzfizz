import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Buttery inertial scrolling, wired into GSAP ScrollTrigger the standard way:
 * Lenis is driven by GSAP's ticker and tells ScrollTrigger about every scroll.
 *
 * Touch devices keep native scrolling (Lenis' default). Returns a cleanup
 * function that fully restores the previous state.
 */
export function startSmoothScroll(): () => void {
  const lenis = new Lenis({
    autoRaf: false, // GSAP's ticker drives it instead
    lerp: 0.1,
    anchors: true, // in-page links like #top scroll smoothly too
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0) // Lenis and ScrollTrigger must stay in lock-step

  return () => {
    gsap.ticker.remove(raf)
    gsap.ticker.lagSmoothing(500, 33) // GSAP's defaults
    lenis.destroy()
  }
}
