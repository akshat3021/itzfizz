import { hero } from '@/lib/hero-parts'
import { HeroParticles } from './hero-particles'

// Outline widths are in SVG units; the drawing is scaled up ~2x on screen.
const OUTLINE = {
  stroke: 'var(--color-ink)',
  strokeWidth: 2.2,
  strokeLinejoin: 'round',
} as const

// The classic paper plane: two folded wings meeting at a crease, climbing to
// the right. Coordinates are in a 0-233 x 0-199 box.
const WING_BACK = '221,44 12,12 73,90'
const WING_FRONT = '221,44 73,90 66,188'
const INNER_FOLD = '73,90 66,188 151,109'

function PaperPlane() {
  return (
    <svg
      viewBox="0 0 233 199"
      role="img"
      aria-label="A paper plane flying up and to the right"
      className="relative block h-auto w-full overflow-visible"
    >
      {/* Hard offset shadow, in the Itzfizz style */}
      <g transform="translate(4 5)" fill="var(--color-ink)">
        <polygon points={WING_BACK} />
        <polygon points={WING_FRONT} />
      </g>

      <polygon points={WING_BACK} fill="white" {...OUTLINE} />
      <polygon points={WING_FRONT} fill="var(--color-pink)" {...OUTLINE} />
      <polygon points={INNER_FOLD} fill="var(--color-lilac)" {...OUTLINE} />
    </svg>
  )
}

/**
 * Layers, outside in (each is owned by exactly one animation, so intro and
 * scroll never write the same element):
 *   disc          INTRO: yellow disc behind the plane
 *   particles     ticker: pooled dust and speed dashes
 *   plane         SCROLL: horizontal flight (translateX)
 *     trail       SPEED: speed-line trail (scaleX / opacity)
 *     plane-tilt  SCROLL: slow scale-up with progress (timeline tween)
 *       plane-lean  SPEED: banking (rotation, set every frame)
 *         plane-intro  INTRO: entrance (fade / slide)
 *           intro-trail  INTRO: streak during the entrance
 *           rays         SCROLL: sweeps with progress; opacity follows speed
 *           shadow       SPEED: opacity follows speed
 * Scale and bank live on separate elements on purpose: a timeline tween and a
 * per-frame setter must never write the same element's transform.
 */
export function HeroPlane() {
  return (
    <div className="relative -mx-5 h-(--plane-h) [--plane-h:calc(var(--plane-w)*0.856)] [--plane-w:clamp(13rem,min(32vw,58svh),30rem)] sm:-mx-8 lg:-mx-12">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          {...hero('disc')}
          data-intro
          className="size-[calc(var(--plane-h)*1.12)] rounded-full border-[3px] border-ink bg-brand shadow-[6px_6px_0_var(--color-ink)]"
        />
      </div>

      <HeroParticles />

      <div {...hero('plane')} className="absolute top-0 left-0 w-(--plane-w) will-change-transform">
        <div className="pointer-events-none absolute inset-y-0 right-[84%] flex items-center">
          <div
            {...hero('trail')}
            className="relative h-[40%] w-[60vw] origin-right scale-x-0 opacity-0 will-change-[transform,opacity]"
          >
            <div className="absolute inset-x-0 top-0 h-[26%] rounded-full border-2 border-ink bg-brand" />
            <div className="absolute inset-x-[20%] top-[37%] h-[26%] rounded-full border-2 border-ink bg-white" />
            <div className="absolute inset-x-[7%] bottom-0 h-[26%] rounded-full border-2 border-ink bg-brand" />
          </div>
        </div>

        <div {...hero('plane-tilt')}>
          <div {...hero('plane-lean')}>
            <div {...hero('plane-intro')} data-intro className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-[84%] flex items-center">
                <div
                  {...hero('intro-trail')}
                  className="h-[18%] w-[55vw] origin-right scale-x-0 rounded-full border-2 border-ink bg-brand opacity-0"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  {...hero('rays')}
                  className="aspect-square w-[170%] shrink-0 [mask-image:radial-gradient(closest-side,black_15%,transparent_100%)] opacity-25 will-change-transform [background:repeating-conic-gradient(from_0deg,transparent_0deg,rgb(255_243_85/0.7)_3deg,transparent_9deg,transparent_24deg)]"
                />
              </div>

              <div
                {...hero('shadow')}
                className="absolute inset-x-[12%] -bottom-[14%] h-[14%] bg-[radial-gradient(closest-side,rgb(34_34_34/0.35),transparent)] opacity-60"
              />

              <PaperPlane />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
