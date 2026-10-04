import Image from 'next/image'
import carTop from '@/assets/car-top.webp'
import { HeroParticles } from './hero-particles'

/**
 * Ownership map (so intro and scroll never tween the same element):
 *   [data-hero="disc"]         INTRO: yellow disc behind the car (static after)
 *   particles                  pooled dust / speed dashes, moved by the ticker
 *   [data-hero="car"]          SCROLL: horizontal travel (translateX)
 *     [data-hero="trail"]      SCROLL SPEED: speed-line trail (scaleX/opacity)
 *     [data-hero="car-tilt"]   SCROLL: scale-up with progress (timeline tween)
 *       [data-hero="car-lean"] SCROLL SPEED: lean/rotation (per-frame setter)
 *         [data-hero="car-intro"] INTRO: entrance (fade/slide)
 *           [data-hero="intro-trail"] INTRO: streak during the entrance
 *           [data-hero="rays"]   SCROLL: sweeps with progress; opacity by speed
 *           [data-hero="ground-glow"] SCROLL SPEED: shadow opacity pulse
 * Scale and lean live on separate elements on purpose: a timeline tween and a
 * per-frame setter must never write the same element's transform.
 */
export function HeroCar() {
  return (
    <div className="relative -mx-5 h-(--car-h) [--car-h:calc(var(--car-w)*0.488)] [--car-w:clamp(20rem,min(52vw,80svh),56rem)] sm:-mx-8 lg:-mx-12">
      {/* Yellow disc behind the car, like the circles behind Itzfizz's illustrations */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          data-hero="disc"
          data-intro
          className="size-[calc(var(--car-h)*1.12)] rounded-full border-[3px] border-ink bg-brand shadow-[6px_6px_0_var(--color-ink)]"
        />
      </div>

      <HeroParticles />

      <div data-hero="car" className="absolute left-0 top-0 w-(--car-w) will-change-transform">
        {/* Speed-line trail: three outlined pills of different lengths */}
        <div className="pointer-events-none absolute inset-y-0 right-[86%] flex items-center">
          <div
            data-hero="trail"
            className="relative h-[34%] w-[60vw] origin-right scale-x-0 opacity-0 will-change-[transform,opacity]"
          >
            <div className="absolute inset-x-0 top-0 h-[26%] rounded-full border-2 border-ink bg-brand" />
            <div className="absolute inset-x-[20%] top-[37%] h-[26%] rounded-full border-2 border-ink bg-white" />
            <div className="absolute inset-x-[7%] bottom-0 h-[26%] rounded-full border-2 border-ink bg-brand" />
          </div>
        </div>

        <div data-hero="car-tilt">
          <div data-hero="car-lean">
            <div data-hero="car-intro" data-intro className="relative">
              {/* Entrance-only streak, behind the tail */}
              <div className="pointer-events-none absolute inset-y-0 right-[86%] flex items-center">
                <div
                  data-hero="intro-trail"
                  className="h-[20%] w-[55vw] origin-right scale-x-0 rounded-full border-2 border-ink bg-brand opacity-0"
                />
              </div>

              {/* Sun-ray burst behind the car */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  data-hero="rays"
                  className="aspect-square w-[170%] shrink-0 opacity-25 will-change-transform [background:repeating-conic-gradient(from_0deg,transparent_0deg,rgb(255_243_85/0.7)_3deg,transparent_9deg,transparent_24deg)] [mask-image:radial-gradient(closest-side,black_15%,transparent_100%)]"
                />
              </div>

              {/* Soft shadow on the ground */}
              <div
                data-hero="ground-glow"
                className="absolute inset-x-[6%] -bottom-[5%] h-[20%] bg-[radial-gradient(closest-side,rgb(34_34_34/0.4),transparent)] opacity-60"
              />

              <Image
                src={carTop}
                alt="Top-down view of a black sports car with yellow accent lines, driving to the right"
                priority
                sizes="(max-width: 640px) 20rem, (max-width: 1200px) 52vw, 56rem"
                className="relative h-auto w-full select-none"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
