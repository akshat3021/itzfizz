/**
 * The hooks that connect the hero's markup to its animation code.
 *
 * Components tag elements with `{...hero('plane')}`; animation code finds them
 * with `findPart(root, 'plane')`. Because both sides use the `HeroPart` type,
 * a typo is a compile error instead of a silently missing animation.
 */
export const HERO_PARTS = [
  'header',
  'grid',
  'doodle-intro',
  'doodle',
  'letter',
  'pulse',
  'tile',
  'tagline',
  'disc',
  'particles',
  'plane',
  'trail',
  'plane-tilt',
  'plane-lean',
  'plane-intro',
  'intro-trail',
  'rays',
  'shadow',
  'stat',
  'stat-card',
  'stat-rule',
  'stat-number',
  'hint',
  'hint-label',
] as const

export type HeroPart = (typeof HERO_PARTS)[number]

/** Spread onto an element to mark it as a hero part. */
export const hero = (part: HeroPart) => ({ 'data-hero': part }) as const

const selector = (part: HeroPart) => `[data-hero="${part}"]`

export function findPart<T extends Element = HTMLElement>(root: ParentNode, part: HeroPart) {
  return root.querySelector<T>(selector(part))
}

export function findParts<T extends Element = HTMLElement>(root: ParentNode, part: HeroPart) {
  return Array.from(root.querySelectorAll<T>(selector(part)))
}

/** Like `findPart`, but a missing part is a bug, so fail loudly. */
export function requirePart<T extends Element = HTMLElement>(root: ParentNode, part: HeroPart) {
  const element = findPart<T>(root, part)
  if (!element) throw new Error(`Hero part "${part}" is missing from the markup`)
  return element
}
