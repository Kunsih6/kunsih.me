/**
 * Scroll and pointer motion from the design, with the Web Animations API and
 * IntersectionObserver. The hero intro, the status pulse and the theme scan are
 * set up in their own components.
 *
 * Nothing here runs with reduced motion, and the page never depends on it: every
 * element is in its final state in the HTML and is only hidden right before it
 * animates in.
 *
 * Markup hooks:
 * - `data-reveal="up"` fades and lifts the element in when it scrolls into view.
 * - `data-reveal="words" | "chars"` raises the masked parts of a `SplitText` inside it.
 * - `data-reveal-delay` delays either one, in ms.
 * - `data-scrub` brightens its word spans as it scrolls through the viewport.
 * - `data-progress` is scaled with the page scroll.
 * - `data-hero` with `data-ghost` drifts the ghost down as the hero scrolls away,
 *   and `data-ghost-x` shifts it sideways with a mouse.
 */
import { startCursorTrail } from './cursor-trail'

const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)'
const EASE_LIFT = 'cubic-bezier(.2, .7, .2, 1)'

const animations = new Set<Animation>()

const clamp = (n: number) => Math.min(1, Math.max(0, n))

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

/** Section content rises in once, the first time it scrolls into view. */
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

/** Effects tied to the scroll position, updated once per frame. */
function scrollLinked() {
  const progress = document.querySelector<HTMLElement>('[data-progress]')
  const scrub = document.querySelector<HTMLElement>('[data-scrub]')
  const words = scrub
    ? [
        ...scrub.querySelectorAll<HTMLElement>(':scope > span'),
      ]
    : []
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  const ghost = hero?.querySelector<HTMLElement>('[data-ghost]')

  let frame = 0
  const update = () => {
    frame = 0
    const viewport = innerHeight
    const max = document.documentElement.scrollHeight - viewport

    if (progress) {
      progress.style.transform = `scaleX(${max > 8
        ? clamp(scrollY / max).toFixed(4)
        : 0})`
    }

    // Words light up one after another as the statement enters: from its top reaching the
    // bottom of the viewport (p = 0) to its bottom reaching 90% of it (p = 1). Every word
    // is lit by p ≈ 0.8, so a statement that is fully on screen is never left dim.
    if (scrub) {
      const { top, height } = scrub.getBoundingClientRect()
      const p = clamp((viewport - top) / (height + viewport * 0.1))
      words.forEach((word, i) => {
        word.style.opacity = (0.2 + 0.8 * clamp(p * (words.length + 3) - i)).toFixed(3)
      })
    }

    if (hero && ghost) {
      const { top, height } = hero.getBoundingClientRect()
      ghost.style.transform = `translate3d(0, ${(clamp(-top / (height || 1)) * 72).toFixed(1)}px, 0)`
    }
  }

  const schedule = () => {
    frame ||= requestAnimationFrame(update)
  }
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule)
  update()
}

/** The hero's ghost leans away from a mouse pointer. */
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
  addEventListener('blur', center)
}

const canAnimate = matchMedia('(prefers-reduced-motion: no-preference)').matches
  && typeof Element.prototype.animate === 'function'
  && 'IntersectionObserver' in window

if (canAnimate) {
  reveals()
  scrollLinked()
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    ghostFollowsPointer()
    startCursorTrail()
  }
  // Printing or saving as PDF shows everything in its final state.
  addEventListener('beforeprint', () => animations.forEach(animation => animation.finish()))
}
