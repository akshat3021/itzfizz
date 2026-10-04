import { gsap } from '@/lib/gsap'
import { findParts, requirePart } from '@/lib/hero-parts'

/** When each beat of the entrance begins, in seconds. Total is roughly 4.5s. */
const AT = {
  decorations: 0.5,
  headline: 0.15,
  tagline: 1.0,
  plane: 1.35,
  stats: 2.55,
}

type Timeline = gsap.core.Timeline

/**
 * Time-based entrance, played once on load, in this order:
 *   1. header, headline letters, disc and doodles
 *   2. the plane glides in from off-screen left, with a streak behind it
 *   3. stats appear one by one (card slides up, rule draws, counter ticks up)
 *
 * Elements touched here are never touched by the scroll scene, so scrolling
 * during the intro is safe. Returns a cleanup function that also restores the
 * real stat numbers.
 */
export function createIntro(stage: HTMLElement) {
  const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })

  introHeadline(timeline, stage)
  introPlane(timeline, stage)
  introStats(timeline, stage)
  timeline.from(findParts(stage, 'hint'), { autoAlpha: 0, duration: 0.8 }, AT.stats + 0.9)

  return function stop() {
    timeline.kill()
    for (const number of findParts(stage, 'stat-number')) {
      number.textContent = number.dataset.value ?? ''
    }
  }
}

function introHeadline(timeline: Timeline, stage: HTMLElement) {
  timeline
    .from(findParts(stage, 'header'), { autoAlpha: 0, y: -16, duration: 0.9 }, 0)
    .from(
      findParts(stage, 'letter'),
      { autoAlpha: 0, yPercent: 70, duration: 1.1, stagger: 0.055 },
      AT.headline,
    )
    .from(findParts(stage, 'tagline'), { autoAlpha: 0, y: 14, duration: 0.9 }, AT.tagline)
    .from(
      findParts(stage, 'disc'),
      { autoAlpha: 0, scale: 0.6, duration: 1.2, ease: 'back.out(1.6)' },
      AT.decorations,
    )
    .from(
      findParts(stage, 'doodle-intro'),
      { autoAlpha: 0, scale: 0.4, duration: 0.9, stagger: 0.12, ease: 'back.out(2)' },
      AT.decorations + 0.4,
    )
}

function introPlane(timeline: Timeline, stage: HTMLElement) {
  const plane = requirePart(stage, 'plane')
  const streak = findParts(stage, 'intro-trail')

  timeline
    // Starts one plane-width to the left, so it begins entirely out of view.
    .from(
      findParts(stage, 'plane-intro'),
      { autoAlpha: 0, x: () => -plane.offsetWidth, duration: 1.7, ease: 'power3.out' },
      AT.plane,
    )
    .fromTo(
      streak,
      { opacity: 0, scaleX: 0.2 },
      { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' },
      AT.plane + 0.1,
    )
    .to(streak, { opacity: 0, scaleX: 0.25, duration: 1.1, ease: 'power2.inOut' }, AT.plane + 1.1)
}

function introStats(timeline: Timeline, stage: HTMLElement) {
  findParts(stage, 'stat').forEach((stat, index) => {
    const startAt = AT.stats + index * 0.18
    const rule = requirePart(stat, 'stat-rule')
    const number = requirePart(stat, 'stat-number')

    // Zero the number *now*, so the card never flashes its final value while
    // it is fading in, before the counter has started.
    number.textContent = '0'

    timeline
      .from(stat, { autoAlpha: 0, y: 26, scale: 0.96, duration: 0.9 }, startAt)
      .from(rule, { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, startAt)
      .to(
        number,
        {
          textContent: Number(number.dataset.value),
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
        },
        startAt + 0.1,
      )
  })
}
