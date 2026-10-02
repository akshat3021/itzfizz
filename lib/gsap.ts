import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Plugins are registered once here so every component imports from one place.
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Mobile browsers resize the viewport as the URL bar shows/hides. Without this,
// every such resize would trigger a full ScrollTrigger refresh and make the
// pinned hero jump.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }
