import { HEADLINE_WORDS, TAGLINE } from '@/lib/hero-content'

/**
 * Each letter is nested spans on purpose:
 *   [data-hero="letter"]  animated by the intro (fade + rise)
 *   [data-hero="pulse"]   animated by scroll (a little pop as the car passes)
 *     [data-hero="glow"]  yellow "sticker tile" behind the letter; scroll fades
 *                         and scales it in, and it stays
 * Intro and scroll never tween the same element, so they can't fight when a
 * user starts scrolling before the intro has finished.
 */
export function HeroHeadline() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <h1 className="flex flex-col items-center gap-[0.3em] text-[min(10vw,4rem)] font-extrabold leading-none text-ink sm:flex-row sm:gap-[1.1em] sm:text-[min(4.7vw,5.25rem)]">
        <span className="sr-only">Welcome Itzfizz</span>
        {HEADLINE_WORDS.map((word) => (
          <span key={word} aria-hidden="true" className="flex gap-[0.42em]">
            {[...word].map((char, index) => (
              <span key={`${word}-${index}`} data-hero="letter" data-intro className="inline-block">
                <span data-hero="pulse" className="relative isolate inline-block">
                  {/* will-change keeps the tile on its own layer: without it, each fade
                      toggled a stacking context and forced a layout (measured 16 -> 1
                      layouts per scroll pass). */}
                  <span
                    data-hero="glow"
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
        data-hero="tagline"
        data-intro
        className="mt-5 max-w-xl text-balance text-sm font-medium leading-6 text-ink/75 sm:mt-7 sm:text-base"
      >
        {TAGLINE}
      </p>
    </div>
  )
}
