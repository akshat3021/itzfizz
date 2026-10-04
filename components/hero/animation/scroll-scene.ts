import { gsap, ScrollTrigger } from '@/lib/gsap'
import { findParts, findPart, requirePart } from '@/lib/hero-parts'
import {
  END_SCALE,
  PIN_LENGTH,
  PLANE_EASE,
  RAYS_SWEEP,
  SCRUB_SMOOTHING,
  SCRUB_SMOOTHING_WITH_LENIS,
} from './config'
import { measurePlaneTravel } from './geometry'
import { addPlanePasses, buildLetterPass, buildStatPass, type PlanePass } from './plane-passes'
import { createSpeedEffects } from './speed-effects'

interface SceneOptions {
  /** True when Lenis is smoothing scroll input. */
  smooth?: boolean
}

/**
 * Pins the hero and ties everything to scroll progress (0 -> 1):
 *  - the plane flies left to right (translateX, eased) and grows slightly
 *  - letters and stat cards react as the plane passes over them
 *  - the grid, sun rays and doodles move with the scroll
 *  - speed-driven effects (see speed-effects.ts) follow the plane's real speed
 *
 * Layout is only read in `measurePlaneTravel` and `placePasses`, which run on
 * setup and on ScrollTrigger refresh, never in a scroll handler or per frame.
 *
 * Returns a cleanup function.
 */
export function createScrollScene(stage: HTMLElement, { smooth = false }: SceneOptions = {}) {
  const plane = requirePart(stage, 'plane')
  const tilt = requirePart(stage, 'plane-tilt')
  const rays = requirePart(stage, 'rays')
  const grid = requirePart(stage, 'grid')

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: `+=${PIN_LENGTH * 100}%`,
      pin: true,
      scrub: smooth ? SCRUB_SMOOTHING_WITH_LENIS : SCRUB_SMOOTHING,
      anticipatePin: 1,
      invalidateOnRefresh: true, // re-run the function-based values on resize
    },
  })

  // The journey itself. Function-based values are re-measured on every refresh.
  timeline
    .fromTo(
      plane,
      { x: () => measurePlaneTravel(plane, stage).start },
      { x: () => measurePlaneTravel(plane, stage).end, ease: PLANE_EASE, duration: 1 },
      0,
    )
    .fromTo(tilt, { scale: 1 }, { scale: END_SCALE, ease: PLANE_EASE, duration: 1 }, 0)
    .fromTo(
      grid,
      { x: 0 },
      { x: () => -(grid.offsetWidth - stage.clientWidth), ease: PLANE_EASE, duration: 1 },
      0,
    )
    .fromTo(
      rays,
      { rotation: -RAYS_SWEEP / 2 },
      { rotation: RAYS_SWEEP / 2, ease: PLANE_EASE, duration: 1 },
      0,
    )

  // Doodles turn slowly; the hint fades out in step with scroll progress.
  for (const doodle of findParts<SVGElement>(stage, 'doodle')) {
    timeline.to(doodle, { rotation: Number(doodle.dataset.spin ?? 45), duration: 1 }, 0)
  }
  const hint = findPart(stage, 'hint-label')
  if (hint) timeline.to(hint, { autoAlpha: 0, duration: 0.15 }, 0)

  // Reactions as the plane passes over each letter and each stat card.
  const passes: PlanePass[] = [
    ...findParts(stage, 'letter').map((letter) => ({
      element: letter,
      animation: buildLetterPass(letter),
    })),
    ...findParts(stage, 'stat').map((stat, index) => ({
      element: stat,
      animation: buildStatPass(requirePart(stat, 'stat-card'), index),
    })),
  ]
  const placePasses = addPlanePasses(timeline, stage, plane, passes, gsap.parseEase(PLANE_EASE))

  // Measurements the per-frame code is allowed to use; refreshed with ScrollTrigger.
  let travel = measurePlaneTravel(plane, stage)
  const refreshMeasurements = () => {
    travel = measurePlaneTravel(plane, stage)
    placePasses()
  }
  refreshMeasurements()
  ScrollTrigger.addEventListener('refreshInit', refreshMeasurements)
  // Web-font metrics change letter widths, so re-measure once fonts are ready.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh())

  const stopSpeedEffects = createSpeedEffects(
    {
      plane,
      trail: requirePart(stage, 'trail'),
      lean: requirePart(stage, 'plane-lean'),
      rays,
      shadow: requirePart(stage, 'shadow'),
      particles: findPart(stage, 'particles'),
    },
    () => travel,
  )

  return function stop() {
    stopSpeedEffects()
    ScrollTrigger.removeEventListener('refreshInit', refreshMeasurements)
    timeline.scrollTrigger?.kill()
    timeline.kill()
  }
}
