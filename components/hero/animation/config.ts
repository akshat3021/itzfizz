/** Tuning values for the hero's animations. Change them here, nowhere else. */

// --- Scroll ---------------------------------------------------------------

/** Scroll distance the hero stays pinned for, as a multiple of its height. */
export const PIN_LENGTH = 3

/** Seconds of smoothing between scroll position and animation progress. */
export const SCRUB_SMOOTHING = 0.8

/** Lower while Lenis already smooths the input, to avoid double-smoothing lag. */
export const SCRUB_SMOOTHING_WITH_LENIS = 0.3

// --- The plane's journey --------------------------------------------------

/** Gentle ease-in/out so the plane pulls away and settles. */
export const PLANE_EASE = 'power1.inOut'

/** The plane starts/ends at least this far off-screen, as a fraction of its width. */
export const MIN_BLEED = 0.1

/** The plane always travels at least this fraction of the screen width, so the
 *  motion still reads on phones where it nearly fills the screen. */
export const MIN_TRAVEL = 0.7

/** The plane grows to this scale by the end of the scroll. */
export const END_SCALE = 1.08

/** How long one "pass" reaction lasts, in timeline units (the full scroll is 1). */
export const PASS_LENGTH = 0.14

// --- Speed-driven effects -------------------------------------------------

/** Plane speed (px/s) at which speed-driven effects reach full strength. */
export const FULL_SPEED = 700

/** Maximum bank angle (degrees) at full speed. */
export const MAX_BANK = 7

/** Sun rays: resting opacity, and how far they sweep (degrees) over the scroll. */
export const RAYS_IDLE_OPACITY = 0.25
export const RAYS_SWEEP = 24

/** The plane's ground shadow: resting opacity. */
export const SHADOW_IDLE_OPACITY = 0.6
