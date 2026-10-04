import { gsap } from '@/lib/gsap'
import { findPart } from '@/lib/hero-parts'
import { PASS_LENGTH } from './config'
import { clamp, invertEase, measurePlaneTravel } from './geometry'

/**
 * A "pass" is a short reaction that plays when the plane flies over an element:
 * a headline letter lights up, a stat card bounces. Each pass is a small
 * timeline, positioned on the main scroll timeline at the moment the plane's
 * centre reaches the element, so it is scrubbed by scroll like everything else.
 */
export interface PlanePass {
  /** The element whose horizontal position decides *when* the pass plays. */
  element: HTMLElement
  animation: gsap.core.Timeline
}

/** A letter hops, and a yellow sticker tile pops in behind it and stays. */
export function buildLetterPass(letter: HTMLElement) {
  const pulse = findPart(letter, 'pulse')
  const tile = findPart(letter, 'tile')
  const pass = gsap.timeline({ defaults: { ease: 'none' } })

  if (pulse) {
    pass.to(
      pulse,
      {
        keyframes: {
          '45%': { yPercent: -8, scale: 1.08 },
          '100%': { yPercent: 0, scale: 1 },
          easeEach: 'sine.inOut',
        },
        duration: PASS_LENGTH,
      },
      0,
    )
  }
  if (tile) {
    // Explicit start values: GSAP then never has to read the DOM when this first renders.
    pass.fromTo(
      tile,
      { opacity: 0, scale: 0.55 },
      { opacity: 1, scale: 1, ease: 'back.out(2)', duration: PASS_LENGTH * 0.7 },
      0,
    )
  }
  return pass
}

/** A stat card bounces up and tilts, like a button being pressed. */
export function buildStatPass(card: HTMLElement, index: number) {
  const tilt = index % 2 === 0 ? -2 : 2
  return gsap.timeline({ defaults: { ease: 'none' } }).to(
    card,
    {
      keyframes: {
        '40%': { scale: 1.08, yPercent: -7, rotation: tilt },
        '100%': { scale: 1, yPercent: 0, rotation: 0 },
        easeEach: 'sine.inOut',
      },
      duration: PASS_LENGTH,
    },
    0,
  )
}

/**
 * Adds every pass to the timeline and returns a function that (re)positions
 * them. Call it on setup and on every ScrollTrigger refresh: it reads layout,
 * which is why it must never run per frame.
 */
export function addPlanePasses(
  timeline: gsap.core.Timeline,
  stage: HTMLElement,
  plane: HTMLElement,
  passes: PlanePass[],
  ease: (t: number) => number,
) {
  for (const { animation } of passes) timeline.add(animation, 0)

  return function placePasses() {
    const { width, start, end } = measurePlaneTravel(plane, stage)
    const stageLeft = stage.getBoundingClientRect().left

    for (const { element, animation } of passes) {
      const rect = element.getBoundingClientRect()
      const centre = rect.left - stageLeft + rect.width / 2
      // How far (0..1, in eased space) the plane has travelled when it is over this element.
      const travelled = clamp((centre - width / 2 - start) / (end - start), 0, 1)
      const progress = invertEase(ease, travelled)
      animation.startTime(clamp(progress - PASS_LENGTH / 2, 0, 1 - PASS_LENGTH))
    }
  }
}
