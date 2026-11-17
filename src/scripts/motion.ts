/*
 * Markup hooks:
 * - `data-reveal="up"` fades and lifts the element in when it scrolls into view.
 * - `data-reveal="words" | "chars"` raises the masked parts of a `SplitText` inside it.
 * - `data-reveal-delay` delays either one, in ms.
 * - `data-ghost-x` shifts the hero's echo sideways with a mouse.
 *
 * Effects that follow the scroll position (the reading progress, the profile statement, the hero
 * echo's drift) are CSS scroll-driven animations in their components.
 */
import { startPixelTrail } from './pixel-trail'

const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)'
const EASE_LIFT = 'cubic-bezier(.2, .7, .2, 1)'

const animations = new Set<Animation>()

/** A paused animation that holds its first frame until played, then lets go of its styles. */
function prepare(el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation {
  const animation = el.animate(keyframes, { fill: 'both', ...options })
  animation.pause()
  animation.onfinish = () => {
    animation.cancel()
    animations.delete(animation)
  }
  animations.add(animation)
  return animation
}

function reveals() {
  const pending = new Map<Element, Animation[]>()

  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    // Already on screen (a reload or an anchor link): hiding it now would make it flash.
    if (el.getBoundingClientRect().top < innerHeight) {
      continue
    }
    const delay = Number(el.dataset.revealDelay ?? 0)
    const kind = el.dataset.reveal

    if (kind === 'words' || kind === 'chars') {
      const step = kind === 'words'
        ? 55
        : 50
      const parts = [
        ...el.querySelectorAll('[data-mask] > *'),
      ]
      pending.set(el, parts.map((part, i) => prepare(
        part,
        [
          { transform: 'translateY(110%)' },
          { transform: 'none' },
        ],
        { duration: 740, delay: delay + i * step, easing: EASE_OUT },
      )))
    }
    else {
      pending.set(el, [
        prepare(
          el,
          [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 520, delay, easing: EASE_LIFT },
        ),
      ])
    }
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        pending.get(entry.target)?.forEach(animation => animation.play())
        observer.unobserve(entry.target)
      }
    }
  }, { rootMargin: '0px 0px -40px 0px' })
  pending.forEach((_, el) => observer.observe(el))
}

function ghostFollowsPointer() {
  const ghost = document.querySelector<HTMLElement>('[data-ghost-x]')
  if (!ghost) {
    return
  }
  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return
    }
    const width = document.documentElement.clientWidth || innerWidth
    ghost.style.transform = `translate3d(${((0.5 - event.clientX / width) * 28).toFixed(1)}px, 0, 0)`
  }, { passive: true })

  const center = () => {
    ghost.style.transform = ''
  }
  document.documentElement.addEventListener('pointerleave', center)
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      center()
    }
  })
  addEventListener('blur', center)
}

const canAnimate = matchMedia('(prefers-reduced-motion: no-preference)').matches
  && typeof Element.prototype.animate === 'function'
  && 'IntersectionObserver' in window

if (canAnimate) {
  reveals()
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    ghostFollowsPointer()
    startPixelTrail()
  }
  addEventListener('beforeprint', () => animations.forEach(animation => animation.finish()))
}
