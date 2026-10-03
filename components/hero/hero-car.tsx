import Image from 'next/image'
import carTop from '@/assets/car-top.webp'
import { HeroParticles } from './hero-particles'

/**
 * Ownership map (so intro and scroll never tween the same element):
 *   particles                  pooled dust/light streaks, moved by the ticker
 *   [data-hero="car"]          SCROLL: horizontal travel (translateX)
 *     [data-hero="trail"]      SCROLL SPEED: glowing streak (scaleX/opacity)
 *     [data-hero="car-tilt"]   SCROLL: scale-up with progress (timeline tween)
 *       [data-hero="car-lean"] SCROLL SPEED: lean/rotation (per-frame setter)
 *         [data-hero="car-intro"] INTRO: entrance (fade/slide)
 *           [data-hero="intro-trail"] INTRO: streak during the entrance
 *           [data-hero="rays"]   SCROLL: sweeps with progress; opacity by speed
 *           [data-hero="ground-glow"] SCROLL SPEED: opacity pulse
 * Scale and lean live on separate elements on purpose: a timeline tween and a
 * per-frame setter must never write the same element's transform.
 */
export function HeroCar() {
  return (
    <div className="relative -mx-5 h-(--car-h) [--car-h:calc(var(--car-w)*0.488)] [--car-w:clamp(20rem,min(52vw,80svh),56rem)] sm:-mx-8 lg:-mx-12">
      <HeroParticles />

      <div
        data-hero="car"
        className="absolute left-0 top-0 w-(--car-w) will-change-transform"
      >
        {/* Speed trail: bright core + wide soft halo (static gradients, only scale/opacity move) */}
        <div className="pointer-events-none absolute inset-y-0 right-[86%] flex items-center">
          <div
            data-hero="trail"
            className="relative h-[46%] w-[70vw] origin-right scale-x-0 opacity-0 will-change-[transform,opacity]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgb(198_241_53/0.4))] blur-2xl" />
            <div className="absolute inset-x-0 top-[28%] bottom-[28%] bg-[linear-gradient(to_right,transparent,rgb(198_241_53/0.55))] blur-md" />
            <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[linear-gradient(to_right,transparent,rgb(255_255_255/0.9)_85%,#c6f135)]" />
          </div>
        </div>

        <div data-hero="car-tilt">
          <div data-hero="car-lean">
          <div data-hero="car-intro" data-intro className="relative">
            {/* Entrance-only streak, behind the tail */}
            <div className="pointer-events-none absolute inset-y-0 right-[86%] flex items-center">
              <div
                data-hero="intro-trail"
                className="h-[30%] w-[60vw] origin-right scale-x-0 bg-[linear-gradient(to_right,transparent,rgb(198_241_53/0.75))] opacity-0 blur-sm"
              />
            </div>

            {/* God rays: conic beams radiating from the car, faded outward */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                data-hero="rays"
                className="aspect-square w-[170%] shrink-0 opacity-25 will-change-transform [background:repeating-conic-gradient(from_0deg,transparent_0deg,rgb(198_241_53/0.16)_3deg,transparent_8deg,transparent_22deg)] [mask-image:radial-gradient(closest-side,black_15%,transparent_100%)]"
              />
            </div>

            {/* Ground light under the car */}
            <div
              data-hero="ground-glow"
              className="absolute inset-x-[4%] -bottom-[6%] h-[28%] bg-[radial-gradient(closest-side,rgb(198_241_53/0.4),transparent)] opacity-60"
            />

            <Image
              src={carTop}
              alt="Top-down view of a black sports car with lime accent lines, driving to the right"
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
