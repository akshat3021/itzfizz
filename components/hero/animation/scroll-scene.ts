import { gsap, ScrollTrigger } from '@/lib/gsap'

/** Scroll distance the hero stays pinned for, as a multiple of its height. */
const PIN_LENGTH = 3
/** Smoothing (seconds) between scroll position and animation progress. */
const SCRUB_SMOOTHING = 0.8
/** Gentle ease-in/out so the car pulls away and settles like a real vehicle. */
const CAR_EASE = 'power1.inOut'
/** The car starts/ends at least this far off-screen, as a fraction of its width. */
const MIN_BLEED = 0.1
/** The car always travels at least this fraction of the screen width, so the
 *  motion still reads on phones where the car nearly fills the screen. */
const MIN_TRAVEL = 0.7
/** Length of one headline flare, in timeline units (the full scroll is 1). */
const FLARE_LENGTH = 0.14
/** Car speed (px/s) at which the light streak reaches full length. */
const FULL_STREAK_SPEED = 700

const VOLT = '#c6f135'
const WHITE = '#ffffff'

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

/**
 * Pins the hero and ties everything to scroll progress (0 -> 1):
 *  - the car travels left to right (translateX, eased)
 *  - each headline letter flares as the car passes it
 *  - the grid drifts the other way, selling the sense of speed
 *  - a light streak behind the car stretches with its *actual* speed
 *
 * Layout is read in exactly two places (`measure` and `placeFlares`), both of
 * which run on ScrollTrigger refresh, never inside a scroll handler.
 *
 * Returns a cleanup function.
 */
export function createScrollScene(root: HTMLElement): () => void {
  const q = gsap.utils.selector(root)
  const car = q<HTMLElement>('[data-hero="car"]')[0]
  const trail = q<HTMLElement>('[data-hero="trail"]')[0]
  const grid = q<HTMLElement>('[data-hero="grid"]')[0]
  const hint = q<HTMLElement>('[data-hero="hint-label"]')[0]
  const letters = q<HTMLElement>('[data-hero="letter"]')
  if (!car || !trail || !grid) return () => {}

  const ease = gsap.parseEase(CAR_EASE)

  const measure = () => {
    const width = car.offsetWidth
    const stageWidth = root.clientWidth
    // travel = stageWidth - width + 2 * bleed, so solve for the bleed needed.
    const bleed = Math.max(width * MIN_BLEED, (width - stageWidth * (1 - MIN_TRAVEL)) / 2)
    return { width, start: -bleed, end: stageWidth - width + bleed }
  }

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: `+=${PIN_LENGTH * 100}%`,
      pin: true,
      scrub: SCRUB_SMOOTHING,
      anticipatePin: 1,
      invalidateOnRefresh: true, // re-run the function-based values on resize
    },
  })

  // 1. The car: the core of the scene.
  timeline.fromTo(
    car,
    { x: () => measure().start },
    { x: () => measure().end, ease: CAR_EASE, duration: 1 },
    0,
  )

  // 2. Grid drifts opposite to the car (camera-follow feel).
  timeline.fromTo(
    grid,
    { x: 0 },
    { x: () => -(grid.offsetWidth - root.clientWidth), ease: CAR_EASE, duration: 1 },
    0,
  )

  // 3. Scroll hint fades as soon as the user starts.
  if (hint) timeline.to(hint, { autoAlpha: 0, duration: 0.05 }, 0)

  // 4. Headline flares. One tween per letter; its position on the timeline is
  //    the moment the car's centre reaches that letter.
  const flares = letters.map((letter) => {
    const pulse = letter.querySelector<HTMLElement>('[data-hero="pulse"]')
    const tween = gsap.to(pulse ?? letter, {
      keyframes: {
        '50%': { color: VOLT, yPercent: -10, scale: 1.08 },
        '100%': { color: WHITE, yPercent: 0, scale: 1 },
        easeEach: 'sine.inOut',
      },
      duration: FLARE_LENGTH,
    })
    timeline.add(tween, 0)
    return { letter, tween }
  })

  const placeFlares = () => {
    const { width, start, end } = measure()
    const stageLeft = root.getBoundingClientRect().left
    for (const { letter, tween } of flares) {
      const rect = letter.getBoundingClientRect()
      const letterCenter = rect.left - stageLeft + rect.width / 2
      const travelled = clamp((letterCenter - width / 2 - start) / (end - start), 0, 1)
      const progress = invertEase(ease, travelled)
      tween.startTime(clamp(progress - FLARE_LENGTH / 2, 0, 1 - FLARE_LENGTH))
    }
  }

  placeFlares()
  ScrollTrigger.addEventListener('refreshInit', placeFlares)
  // Web-font metrics change letter widths, so re-measure once fonts are ready.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh())

  // 5. Speed streak: follows the car's smoothed on-screen speed, so it grows as
  //    the car accelerates and fades when it stops, whatever the scroll input.
  const setStreakScale = gsap.quickSetter(trail, 'scaleX') as (value: number) => void
  const setStreakOpacity = gsap.quickSetter(trail, 'opacity') as (value: number) => void
  let lastX = Number(gsap.getProperty(car, 'x'))
  let smoothedSpeed = 0

  const updateStreak = (_time: number, deltaMs: number) => {
    const x = Number(gsap.getProperty(car, 'x'))
    const speed = Math.abs(x - lastX) / (Math.max(deltaMs, 1) / 1000)
    lastX = x
    smoothedSpeed += (speed - smoothedSpeed) * 0.12
    const intensity = clamp(smoothedSpeed / FULL_STREAK_SPEED, 0, 1)
    setStreakScale(intensity)
    setStreakOpacity(intensity ** 0.7) // fades in faster than it stretches
  }
  gsap.ticker.add(updateStreak)

  return () => {
    gsap.ticker.remove(updateStreak)
    ScrollTrigger.removeEventListener('refreshInit', placeFlares)
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}
