'use client'

import { useEffect } from 'react'
import { initSmoothScroll } from '@/lib/smooth-scroll'

export function SmoothScroll() {
  useEffect(() => {
    return initSmoothScroll()
  }, [])

  return null
}
