import { gsap } from '@/lib/gsap'
import { FULL_SPEED, MAX_BANK, RAYS_IDLE_OPACITY, SHADOW_IDLE_OPACITY } from './config'
import { clamp, type PlaneTravel } from './geometry'
import { createParticles } from './particles'

export interface SpeedEffectTargets {
  plane: HTMLElement
  trail: HTMLElement
  lean: HTMLElement
  rays: HTMLElement
  shadow: HTMLElement
  particles: HTMLElement | null
}

/**
 * Effects driven by the plane's *actual* on-screen speed, so they build as it
 * accelerates and fade when it stops, whatever the scroll input was:
 * speed-line trail, sun rays, shadow, banking and particles.
 *
 * Everything runs in one ticker callback using cached numbers: it reads GSAP's
 * property cache and the `travel` measurements, never the DOM.
 */
export function createSpeedEffects(
  { plane, trail, lean, rays, shadow, particles: particlesEl }: SpeedEffectTargets,
  getTravel: () => PlaneTravel,
) {
  const setTrailScale = gsap.quickSetter(trail, 'scaleX') as (value: number) => void
  const setTrailOpacity = gsap.quickSetter(trail, 'opacity') as (value: number) => void
  const setRaysOpacity = gsap.quickSetter(rays, 'opacity') as (value: number) => void
  const setShadowOpacity = gsap.quickSetter(shadow, 'opacity') as (value: number) => void
  // quickTo (not quickSetter): reliably animates `rotation` and adds gentle easing.
  const bankTo = gsap.quickTo(lean, 'rotation', { duration: 0.25, ease: 'power2.out' })
  const particles = particlesEl ? createParticles(particlesEl) : null

  let lastX = Number(gsap.getProperty(plane, 'x'))
  let smoothedSpeed = 0 // signed: negative when scrolling back
  let lastBank = 0

  const tick = (_time: number, deltaMs: number) => {
    const dt = clamp(deltaMs, 1, 50) / 1000
    const x = Number(gsap.getProperty(plane, 'x'))
    smoothedSpeed += ((x - lastX) / dt - smoothedSpeed) * 0.12
    lastX = x

    const signed = clamp(smoothedSpeed / FULL_SPEED, -1, 1)
    const intensity = Math.abs(signed)

    setTrailScale(intensity)
    setTrailOpacity(intensity ** 0.7) // fades in faster than it stretches
    setRaysOpacity(RAYS_IDLE_OPACITY + (1 - RAYS_IDLE_OPACITY) * intensity)
    setShadowOpacity(SHADOW_IDLE_OPACITY + (1 - SHADOW_IDLE_OPACITY) * intensity)

    const bank = signed * MAX_BANK
    if (Math.abs(bank - lastBank) > 0.005) {
      bankTo(bank)
      lastBank = bank
    }

    const { width, height } = getTravel()
    particles?.update(dt, intensity, x + width * 0.08, height)
  }

  gsap.ticker.add(tick)

  return function stop() {
    gsap.ticker.remove(tick)
    particles?.destroy()
  }
}
