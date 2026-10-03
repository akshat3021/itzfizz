import { HEADLINE_WORDS, TAGLINE } from '@/lib/hero-content'

/**
 * Each letter is two nested spans on purpose:
 *   [data-hero="letter"]  animated by the intro (fade + rise)
 *   [data-hero="pulse"]   animated by scroll (lights up as the car passes, stays lit)
 *     [data-hero="glow"]  static glowing copy; only its opacity is animated
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
                <span data-hero="pulse" className="relative inline-block">
                  {/* Static pre-glowing copy; scroll only animates its opacity. will-change keeps
                      it on its own layer: without it, each fade toggled a stacking context
                      and forced a layout (measured: 16 -> 2 layouts per scroll pass). */}
                  <span
                    data-hero="glow"
                    aria-hidden="true"
                    className="absolute left-0 top-0 text-volt opacity-0 will-change-[opacity] [text-shadow:0_0_18px_rgb(198_241_53/0.85),0_0_52px_rgb(198_241_53/0.5)]"
                  >
                    {char}
                  </span>
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
