import { HEADLINE_WORDS, TAGLINE } from '@/lib/hero-content'
import { hero } from '@/lib/hero-parts'

/**
 * Each letter is nested spans on purpose, so the intro and the scroll never
 * animate the same element (they would fight if a user scrolled mid-intro):
 *   letter  animated by the intro (fade + rise)
 *   pulse   animated by scroll (a little hop as the plane passes)
 *   tile    yellow "sticker tile" behind the letter; scroll pops it in
 */
export function HeroHeadline() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <h1 className="flex flex-col items-center gap-[0.3em] text-[min(10vw,4rem)] leading-none font-extrabold text-ink sm:flex-row sm:gap-[1.1em] sm:text-[min(4.7vw,5.25rem)]">
        <span className="sr-only">Welcome Itzfizz</span>
        {HEADLINE_WORDS.map((word) => (
          <span key={word} aria-hidden="true" className="flex gap-[0.42em]">
            {[...word].map((char, index) => (
              <span
                key={`${word}-${index}`}
                {...hero('letter')}
                data-intro
                className="inline-block"
              >
                <span {...hero('pulse')} className="relative isolate inline-block">
                  {/* will-change keeps the tile on its own layer: without it, each fade
                      toggled a stacking context and forced a layout (measured 16 -> 1
                      layouts per scroll pass). */}
                  <span
                    {...hero('tile')}
                    aria-hidden="true"
                    className="absolute -inset-x-[0.12em] -inset-y-[0.07em] -z-10 rounded-[0.22em] border-[0.06em] border-ink bg-brand opacity-0 shadow-[0.07em_0.07em_0_var(--color-ink)] will-change-[opacity,transform]"
                  />
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <p
        {...hero('tagline')}
        data-intro
        className="mt-5 max-w-xl text-sm leading-6 font-medium text-balance text-ink/75 sm:mt-7 sm:text-base"
      >
        {TAGLINE}
      </p>
    </div>
  )
}
