# Itzfizz Digital — Scroll-driven hero

A hero section where a car drives across the screen as you scroll, built with **Next.js (React), Tailwind CSS, TypeScript and GSAP**.

![Preview](docs/preview.jpg)

**Live demo:** [_add your GitHub Pages URL here_](https://akshat3021.github.io/itzfizz/)

## What it does

| Requirement | Implementation |
|---|---|
| Letter-spaced headline above the fold | `W E L C O M E  I T Z F I Z Z` in Archivo Expanded, centred, with impact stats below |
| Load animation | GSAP timeline: header, staggered letters, tagline, car glide-in, then stats one by one (rule draws, counter ticks up) |
| Scroll-based animation | ScrollTrigger pins the hero for ~3 screens; the car's `translateX` is **scrubbed to scroll progress**, with easing and 0.8s smoothing |
| Smooth and performant | Only `transform` and `opacity` are animated; layout is read only on ScrollTrigger refresh, never in a scroll handler |

Extras tied to the same scroll progress:
- Each headline letter lights up (with a glow) as the car passes and stays lit; it resets when you scroll back.
- The car scales up (to 1.08) and leans slightly with its speed.
- A thick glowing trail, god rays, ground glow and a small pool of dust/light-streak particles all react to the car's *actual* speed and fade when it stops.
- The background grid drifts the opposite way; Lenis gives inertial smooth scrolling.
- Entrance order on load: headline letters, then the car glides in from the left, then the stats.
- Small details: "Scroll to accelerate" hint tied to scroll, custom cursor (mouse only), subtle film grain.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build        # static export to ./out
```

## Structure

```
app/                      layout (self-hosted font), page, global styles
components/hero/          presentational components (markup only)
  animation/
    intro.ts              time-based load animation
    scroll-scene.ts       pinned, scroll-scrubbed scene
    particles.ts          recycled particle pool (no per-frame allocation)
    use-hero-animation.ts wires both up; handles prefers-reduced-motion
components/custom-cursor.tsx   mouse-only cursor
lib/smooth-scroll.ts      Lenis wired into GSAP's ticker
lib/gsap.ts               plugin registration (one place)
lib/hero-content.ts       all copy and stats: edit here
assets/car-top.webp       transparent, cropped car cut-out
```

Markup and animation are decoupled through `data-hero="…"` attributes, so styling changes never break the GSAP code.

## Design decisions worth knowing

- **Intro and scroll never tween the same element.** Each letter is two nested spans (intro on the outer, scroll flare on the inner), so scrolling during the intro can't corrupt either animation.
- **Flare timing is computed, not hand-tuned.** On each refresh, every letter's position on the timeline is derived from its real x-position and the car's easing curve (inverted numerically), so it stays correct at any screen size.
- **Accessibility:** one real `<h1>` with screen-reader text; decorative letters are `aria-hidden`; visible focus rings; pinch-zoom allowed. Users with `prefers-reduced-motion` get no intro and no pinning, just the final state. With JavaScript off, everything is visible.
- **One owner per element property.** Scale (timeline tween) and lean (per-frame setter) live on separate wrappers; mixing them on one element silently broke both.
- **Layout cost measured, not assumed:** the letter glow layers use `will-change: opacity`, which cut layouts per scroll pass from 16 to 1.
- **No flash on load:** a tiny inline script adds a `js` class before first paint so intro elements start hidden only when GSAP will reveal them.

## Tuning

Constants at the top of `components/hero/animation/scroll-scene.ts`: `PIN_LENGTH` (scroll distance), `SCRUB_SMOOTHING`, `CAR_EASE`, `MIN_TRAVEL`, `FLARE_LENGTH`.

## Deploy to GitHub Pages

1. Push to a GitHub repo on the `main` branch.
2. **Settings → Pages → Source: GitHub Actions.**
3. The workflow in `.github/workflows/deploy.yml` builds and publishes. The base path is taken from the repo name automatically.

