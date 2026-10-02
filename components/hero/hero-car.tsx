import Image from 'next/image'
import carTop from '@/assets/car-top.webp'

/**
 * Layers, outside in:
 *   [data-hero="car"]        scroll-driven horizontal travel (translateX)
 *     [data-hero="trail"]    light streak behind the car, stretches with speed
 *     [data-hero="car-intro"] intro entrance (fade / slide / scale)
 */
export function HeroCar() {
  return (
    <div
      className="relative -mx-5 h-(--car-h) [--car-h:calc(var(--car-w)*0.488)] [--car-w:clamp(20rem,min(52vw,80svh),56rem)] sm:-mx-8 lg:-mx-12"
    >
      <div
        data-hero="car"
        className="absolute left-0 top-0 w-(--car-w) will-change-transform"
      >
        <div className="pointer-events-none absolute inset-y-0 right-[86%] flex items-center">
          <div
            data-hero="trail"
            className="h-[22%] min-h-6 w-[70vw] origin-right scale-x-0 bg-[linear-gradient(to_right,transparent,rgb(198_241_53/0.7))] opacity-0 [mask-image:linear-gradient(to_bottom,transparent,black_50%,transparent)]"
          />
        </div>

        <div data-hero="car-intro" data-intro className="relative">
          {/* Ground light under the car */}
          <div className="absolute inset-x-[6%] -bottom-[4%] h-[22%] bg-[radial-gradient(closest-side,rgb(198_241_53/0.22),transparent)]" />
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
  )
}
