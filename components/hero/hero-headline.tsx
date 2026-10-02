import { HEADLINE_WORDS, TAGLINE } from '@/lib/hero-content'

/**
 * Each letter is two nested spans on purpose:
 *   [data-hero="letter"]  animated by the intro (fade + rise)
 *   [data-hero="pulse"]   animated by scroll (colour flare as the car passes)
 * Intro and scroll never tween the same element, so they can't fight when a
 * user starts scrolling before the intro has finished.
 */
export function HeroHeadline() {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <h1 className="font-expanded flex flex-col items-center gap-[0.25em] text-[min(10.5vw,4.25rem)] font-extrabold leading-none text-white sm:flex-row sm:gap-[1em] sm:text-[min(5vw,5.5rem)]">
        <span className="sr-only">Welcome Itzfizz</span>
        {HEADLINE_WORDS.map((word) => (
          <span key={word} aria-hidden="true" className="flex gap-[0.3em]">
            {[...word].map((char, index) => (
              <span key={`${word}-${index}`} data-hero="letter" data-intro className="inline-block">
                <span data-hero="pulse" className="inline-block">
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
        className="mt-5 max-w-md text-balance text-sm leading-6 text-white/60 sm:mt-7 sm:text-base"
      >
        {TAGLINE}
      </p>
    </div>
  )
}
