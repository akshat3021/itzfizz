/**
 * Recycled dust / light-streak particles trailing the car.
 *
 * - Elements come from a fixed pool rendered by <HeroParticles />; nothing is
 *   created or destroyed per frame.
 * - Only transform and opacity are written, via inline styles, from the
 *   scene's single ticker callback. No layout is ever read here.
 * - Spawning stops when the car is slow; live particles then finish fading.
 */
interface Particle {
  el: HTMLElement
  life: number
  maxLife: number
  x: number
  y: number
  vx: number
  vy: number
}

const SPAWN_THRESHOLD = 0.06
const SPAWNS_PER_SECOND = 40 // at full intensity
const MOBILE_POOL = 10

export function createParticles(container: HTMLElement) {
  const elements = Array.from(container.children) as HTMLElement[]
  const isSmall = window.matchMedia('(max-width: 640px)').matches
  const active = elements.slice(0, isSmall ? MOBILE_POOL : elements.length)

  // Every third particle is a thin horizontal streak, the rest are dots.
  const pool: Particle[] = active.map((el, index) => {
    const streak = index % 3 === 0
    el.style.width = `${streak ? 26 + (index % 5) * 9 : 2 + (index % 3)}px`
    el.style.height = streak ? '1.5px' : `${2 + (index % 3)}px`
    return { el, life: 0, maxLife: 1, x: 0, y: 0, vx: 0, vy: 0 }
  })

  let budget = 0

  return {
    /** tailX / laneHeight are cached numbers: no DOM reads happen here. */
    update(dt: number, intensity: number, tailX: number, laneHeight: number) {
      if (intensity > SPAWN_THRESHOLD) {
        budget += intensity * SPAWNS_PER_SECOND * dt
        while (budget >= 1) {
          budget -= 1
          const particle = pool.find((p) => p.life <= 0)
          if (!particle) break
          particle.maxLife = particle.life = 0.5 + Math.random() * 0.7
          particle.x = tailX + (Math.random() - 0.2) * 50
          particle.y = laneHeight * (0.18 + Math.random() * 0.64)
          particle.vx = -(40 + Math.random() * 180) * (0.4 + intensity)
          particle.vy = (Math.random() - 0.5) * 36
        }
      } else {
        budget = 0
      }

      for (const p of pool) {
        if (p.life <= 0) continue
        p.life -= dt
        if (p.life <= 0) {
          p.el.style.opacity = '0'
          continue
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.el.style.opacity = String((p.life / p.maxLife) * 0.9)
        p.el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0)`
      }
    },
    destroy() {
      for (const p of pool) {
        p.el.style.opacity = '0'
        p.el.style.transform = ''
      }
    },
  }
}
