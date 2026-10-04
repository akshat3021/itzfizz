import { MIN_BLEED, MIN_TRAVEL } from './config'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/** Finds t where ease(t) === target. Eases are monotonic, so bisection works. */
export function invertEase(ease: (t: number) => number, target: number) {
  let low = 0
  let high = 1
  for (let step = 0; step < 24; step++) {
    const mid = (low + high) / 2
    if (ease(mid) < target) low = mid
    else high = mid
  }
  return (low + high) / 2
}

export interface PlaneTravel {
  width: number
  height: number
  /** x of the plane's left edge at the start and end of the scroll, relative to the stage. */
  start: number
  end: number
}

/**
 * Measures where the plane starts and ends. This reads layout, so call it only
 * during setup and ScrollTrigger refreshes, never per frame.
 */
export function measurePlaneTravel(plane: HTMLElement, stage: HTMLElement): PlaneTravel {
  const width = plane.offsetWidth
  const stageWidth = stage.clientWidth
  // travel = stageWidth - width + 2 * bleed, so solve for the bleed that gives MIN_TRAVEL.
  const bleed = Math.max(width * MIN_BLEED, (width - stageWidth * (1 - MIN_TRAVEL)) / 2)
  return { width, height: plane.offsetHeight, start: -bleed, end: stageWidth - width + bleed }
}
