import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONTACT_HREF } from '@/lib/hero-content'

export function HeroHeader() {
  return (
    <header
      data-hero="header"
      data-intro
      className="relative z-20 flex items-center justify-between"
    >
      <a href="#top" className="group flex items-center gap-3" aria-label="Itzfizz Digital home">
        <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform group-hover:rotate-12">
          <Sparkles className="size-4" strokeWidth={2.5} />
        </span>
        <span className="text-sm font-semibold tracking-[0.12em]">
          ITZFIZZ<span className="text-volt">.</span>
        </span>
      </a>

      <p className="hidden text-xs text-white/60 md:block">Independent digital agency, est. 2016</p>

      <Button
        nativeButton={false}
        render={<a href={CONTACT_HREF} />}
        variant="outline"
        className="h-9 rounded-full border-white/20 bg-white/5 px-4 text-xs font-semibold text-white hover:border-volt hover:bg-volt hover:text-ink"
      >
        Start a project
        <ArrowUpRight data-icon="inline-end" />
      </Button>
    </header>
  )
}
