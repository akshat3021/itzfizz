import { gsap, ScrollTrigger } from '@/lib/gsap'
import { createParticles } from './particles'

/** Scroll distance the hero stays pinned for, as a multiple of its height. */
const PIN_LENGTH = 3
/** Smoothing (seconds) between scroll position and progress. Lower when Lenis
 *  is already smoothing the input, to avoid double-smoothing lag. */
const SCRUB_SMOOTHING = 0.8
const SCRUB_SMOOTHING_WITH_LENIS = 0.3
/** Gentle ease-in/out so the car pulls away and settles like a real vehicle. */
const CAR_EASE = 'power1.inOut'
/** The car starts/ends at least this far off-screen, as a fraction of its width. */
const MIN_BLEED = 0.1
/** The car always travels at least this fraction of the screen width, so the
 *  motion still reads on phones where the car nearly fills the screen. */
const MIN_TRAVEL = 0.7
/** Length of one headline light-up, in timeline units (the full scroll is 1). */
const FLARE_LENGTH = 0.14
/** Car speed (px/s) at which speed-driven effects reach full strength. */
const FULL_SPEED = 700
/** Car grows to this scale by the end of the scroll. */
const END_SCALE = 1.08
/** Maximum lean (degrees) at full speed. */
const MAX_TILT = 2.5
/** God rays: resting opacity, and how far they sweep (degrees) over the scroll. */
const RAYS_IDLE = 0.25
const RAYS_SWEEP = 24
const GLOW_IDLE = 0.6

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** Finds t where ease(t) === target. Eases are monotonic, so bisection works. */
function invertEase(ease: (t: number) => number, target: number) {
  let low = 0
  let high = 1
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    if (ease(mid) < target) low = mid
    else high = mid
  }
  return (low + high) / 2
}

interface SceneOptions {
  /** True when Lenis is smoothing scroll input. */
  smooth?: boolean
}

/**
 * Pins the hero and ties everything to scroll progress (0 -> 1):
 *  - the car travels left to right (translateX, eased), growing slightly
 *  - a yellow tile pops in behind each headline letter as the car passes it
 *  - the grid and the god rays move with the scroll
 *  - streak, rays, ground glow, lean and particles react to the car's
 *    *actual* speed, so they build as it accelerates and fade when it stops
 *
 * Layout is read in exactly two places (`measure` and `placeFlares`), both of
 * which run on ScrollTrigger refresh, never inside a scroll handler or the
 * per-frame ticker (which only uses cached numbers).
 *
 * Returns a cleanup function.
 */
export function createScrollScene(root: HTMLElement, { smooth = false }: SceneOptions = {}): () => void {
  const q = gsap.utils.selector(root)
  const car = q<HTMLElement>('[data-hero="car"]')[0]
  const tilt = q<HTMLElement>('[data-hero="car-tilt"]')[0]
  const lean = q<HTMLElement>('[data-hero="car-lean"]')[0]
  const trail = q<HTMLElement>('[data-hero="trail"]')[0]
  const rays = q<HTMLElement>('[data-hero="rays"]')[0]
  const groundGlow = q<HTMLElement>('[data-hero="ground-glow"]')[0]
  const particlesEl = q<HTMLElement>('[data-hero="particles"]')[0]
  const grid = q<HTMLElement>('[data-hero="grid"]')[0]
  const hint = q<HTMLElement>('[data-hero="hint-label"]')[0]
  const letters = q<HTMLElement>('[data-hero="letter"]')
  if (!car || !tilt || !lean || !trail || !rays || !groundGlow || !grid) return () => {}

  const ease = gsap.parseEase(CAR_EASE)

  // Cached layout numbers, refreshed only on ScrollTrigger refresh.
  let carHeight = car.offsetHeight

  const measure = () => {
    const width = car.offsetWidth
    carHeight = car.offsetHeight
    const stageWidth = root.clientWidth
    // travel = stageWidth - width + 2 * bleed, so solve for the bleed needed.
    const bleed = Math.max(width * MIN_BLEED, (width - stageWidth * (1 - MIN_TRAVEL)) / 2)
    return { width, start: -bleed, end: stageWidth - width + bleed }
  }
  let cachedWidth = measure().width

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${PIN_LENGTH * 100}%`,
      pin: true,
      scrub: smooth ? SCRUB_SMOOTHING_WITH_LENIS : SCRUB_SMOOTHING,
      anticipatePin: 1,
      invalidateOnRefresh: true, // re-run the function-based values on resize
    },
  })

  // 1. The car: the core of the scene, plus a slow scale-up for drama.
  timeline.fromTo(
    car,
    { x: () => measure().start },
    { x: () => measure().end, ease: CAR_EASE, duration: 1 },
    0,
  )
  timeline.fromTo(tilt, { scale: 1 }, { scale: END_SCALE, ease: CAR_EASE, duration: 1 }, 0)

  // 2. Grid drifts opposite to the car (camera-follow); rays sweep with progress.
  timeline.fromTo(
    grid,
    { x: 0 },
    { x: () => -(grid.offsetWidth - root.clientWidth), ease: CAR_EASE, duration: 1 },
    0,
  )
  timeline.fromTo(rays, { rotation: -RAYS_SWEEP / 2 }, { rotation: RAYS_SWEEP / 2, ease: CAR_EASE, duration: 1 }, 0)

  // Decorative doodles turn slowly with the scroll.
  q<SVGElement>('[data-hero="doodle"]').forEach((doodle) => {
    timeline.to(doodle, { rotation: Number(doodle.dataset.spin ?? 45), ease: 'none', duration: 1 }, 0)
  })

  // 3. Scroll hint fades in step with scroll progress (gone by ~15%).
  if (hint) timeline.to(hint, { autoAlpha: 0, duration: 0.15 }, 0)

  // 4. Headline: a yellow tile pops in behind each letter the moment the car's
  //    centre reaches it, and stays. One small timeline per letter; its position
  //    on the main timeline is derived from the letter's real x-position.
  const flares = letters.map((letter) => {
    const pulse = letter.querySelector<HTMLElement>('[data-hero="pulse"]')
    const tile = letter.querySelector<HTMLElement>('[data-hero="glow"]')
    const flare = gsap.timeline({ defaults: { ease: 'none' } })
    flare.to(
      pulse ?? letter,
      {
        keyframes: {
          '45%': { yPercent: -8, scale: 1.08 },
          '100%': { yPercent: 0, scale: 1 },
          easeEach: 'sine.inOut',
        },
        duration: FLARE_LENGTH,
      },
      0,
    )
    // Explicit start values: GSAP then never reads the DOM when this first renders.
    if (tile) {
      flare.fromTo(
        tile,
        { opacity: 0, scale: 0.55 },
        { opacity: 1, scale: 1, ease: 'back.out(2)', duration: FLARE_LENGTH * 0.7 },
        0,
      )
    }
    timeline.add(flare, 0)
    return { letter, flare }
  })

  const placeFlares = () => {
    const { width, start, end } = measure()
    cachedWidth = width
    const stageLeft = root.getBoundingClientRect().left
    for (const { letter, flare } of flares) {
      const rect = letter.getBoundingClientRect()
      const letterCenter = rect.left - stageLeft + rect.width / 2
      const travelled = clamp((letterCenter - width / 2 - start) / (end - start), 0, 1)
      const progress = invertEase(ease, travelled)
      flare.startTime(clamp(progress - FLARE_LENGTH / 2, 0, 1 - FLARE_LENGTH))
    }
  }

  placeFlares()
  ScrollTrigger.addEventListener('refreshInit', placeFlares)
  // Web-font metrics change letter widths, so re-measure once fonts are ready.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh())

  // 5. Speed-driven effects, all from ONE ticker callback using cached numbers
  //    (gsap.getProperty reads GSAP's cache, not the DOM).
  const setStreakScale = gsap.quickSetter(trail, 'scaleX') as (value: number) => void
  const setStreakOpacity = gsap.quickSetter(trail, 'opacity') as (value: number) => void
  const setRaysOpacity = gsap.quickSetter(rays, 'opacity') as (value: number) => void
  const setGlowOpacity = gsap.quickSetter(groundGlow, 'opacity') as (value: number) => void
  // quickTo (not quickSetter): reliably animates `rotation` and adds gentle easing.
  const setLean = gsap.quickTo(lean, 'rotation', { duration: 0.25, ease: 'power2.out' })
  const particles = particlesEl ? createParticles(particlesEl) : null

  let lastX = Number(gsap.getProperty(car, 'x'))
  let smoothedSpeed = 0 // signed: negative when scrolling back
  let lastLean = 0

  const updateEffects = (_time: number, deltaMs: number) => {
    const dt = Math.min(Math.max(deltaMs, 1), 50) / 1000
    const x = Number(gsap.getProperty(car, 'x'))
    smoothedSpeed += ((x - lastX) / dt - smoothedSpeed) * 0.12
    lastX = x

    const signed = clamp(smoothedSpeed / FULL_SPEED, -1, 1)
    const intensity = Math.abs(signed)

    setStreakScale(intensity)
    setStreakOpacity(intensity ** 0.7) // fades in faster than it stretches
    setRaysOpacity(RAYS_IDLE + (1 - RAYS_IDLE) * intensity)
    setGlowOpacity(GLOW_IDLE + (1 - GLOW_IDLE) * intensity)
    const leanTarget = signed * MAX_TILT
    if (Math.abs(leanTarget - lastLean) > 0.005) {
      setLean(leanTarget)
      lastLean = leanTarget
    }
    particles?.update(dt, intensity, x + cachedWidth * 0.08, carHeight)
  }
  gsap.ticker.add(updateEffects)

  return () => {
    gsap.ticker.remove(updateEffects)
    particles?.destroy()
    ScrollTrigger.removeEventListener('refreshInit', placeFlares)
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}
