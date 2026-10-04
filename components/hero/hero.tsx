'use client'

import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useHeroAnimation } from './animation/use-hero-animation'
import { HeroBackdrop } from './hero-backdrop'
import { HeroCar } from './hero-car'
import { HeroDoodles } from './hero-doodles'
import { HeroHeader } from './hero-header'
import { HeroHeadline } from './hero-headline'
import { HeroStats } from './hero-stats'

export function Hero() {
  const stage = useRef<HTMLElement>(null)
  useHeroAnimation(stage)

  return (
    <section
      id="top"
      ref={stage}
      aria-label="Welcome to Itzfizz Digital"
      className="relative h-svh min-h-[640px] overflow-hidden bg-white selection:bg-brand selection:text-ink"
    >
      <HeroBackdrop />
      <HeroDoodles />

      <div className="relative flex h-full flex-col px-5 pb-4 pt-5 sm:px-8 sm:pt-6 lg:px-12">
        <HeroHeader />

        <div className="flex flex-1 flex-col justify-center gap-2 sm:gap-4">
          <HeroHeadline />
          <HeroCar />
          <HeroStats />
        </div>

        <div
          data-hero="hint"
          data-intro
          aria-hidden="true"
          className="flex justify-center text-xs font-semibold text-ink/60"
        >
          <span data-hero="hint-label" className="flex items-center gap-2">
            Scroll to accelerate <ChevronDown className="size-3.5 animate-bounce text-ink" />
          </span>
        </div>
      </div>
    </section>
  )
}
