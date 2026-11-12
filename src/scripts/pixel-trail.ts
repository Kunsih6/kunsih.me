/*
 * With a mouse, the pointer lights a short trail of squares on a fixed grid behind it.
 * It never replaces the system cursor.
 */

/** Grid step, px. */
const CELL = 6
/** Square side inside a cell, px: the gap keeps the squares apart. */
const SIZE = 4
/** Squares across the trail by the pointer. It narrows one square at a time towards its end. */
const WIDTH = 3
/** ms for a square on the pointer's path to fade out. */
const LIFE = 420
/** Opacity levels a square fades through, for a stepped, pixel-like fade. */
const STEPS = 4
const ALPHA = 0.35
/** Chance that a step also lights a square just outside the trail, dimmer and briefer. */
const SCATTER = 0.2
const MAX_PIXELS = 480

/**
 * Offsets across the path, centre first (0, 1, -1, 2, ...). Each one goes out sooner than the
 * one before, so the trail goes from WIDTH squares down to 1.
 */
const ACROSS = Array.from({ length: WIDTH }, (_, k) => Math.ceil(k / 2) * (k % 2 || -1))
const OUTSIDE = Math.floor(WIDTH / 2) + 1

interface Pixel {
  x: number
  y: number
  born: number
  /** When it goes out, ms. */
  until: number
  alpha: number
}

export function startPixelTrail(): void {
  const canvas = document.createElement('canvas')
  canvas.className = 'pixel-trail'
  canvas.setAttribute('aria-hidden', 'true')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  document.body.append(canvas)

  const pixels = new Map<string, Pixel>()
  let dpr = 1
  let color = ''
  let last: [x: number, y: number] | null = null
  let raf = 0

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4d9eea'
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(2, devicePixelRatio || 1)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
  }

  const light = (x: number, y: number, now: number, alpha: number, life: number) => {
    const key = `${x},${y}`
    const lit = pixels.get(key)
    pixels.delete(key)
    let until = now + life
    // Lighting a square that is still lit never dims it or makes it go out sooner.
    if (lit && lit.until > now) {
      until = Math.max(until, lit.until)
      alpha = Math.max(alpha, lit.alpha)
    }
    pixels.set(key, { x, y, born: now, until, alpha })
    if (pixels.size > MAX_PIXELS) {
      pixels.delete(pixels.keys().next().value!)
    }
  }

  const frame = (now: number) => {
    raf = 0
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = color
    for (const [key, pixel] of pixels) {
      if (now >= pixel.until) {
        pixels.delete(key)
        continue
      }
      // Every square fades on the same curve, so the narrowing reads as steps in width.
      const left = 1 - (now - pixel.born) / LIFE
      ctx.globalAlpha = pixel.alpha * Math.ceil(Math.min(1, left) * STEPS) / STEPS
      ctx.fillRect(pixel.x * CELL, pixel.y * CELL, SIZE, SIZE)
    }
    ctx.globalAlpha = 1
    if (pixels.size) {
      raf = requestAnimationFrame(frame)
    }
  }

  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return
    }
    // Some browsers send a fake move at (0, 0) on load.
    if (!last && !event.clientX && !event.clientY) {
      return
    }
    const x = Math.floor(event.clientX / CELL)
    const y = Math.floor(event.clientY / CELL)
    if (!last) {
      last = [x, y]
      return
    }
    const [fromX, fromY] = last
    const steps = Math.max(Math.abs(x - fromX), Math.abs(y - fromY))
    if (!steps) {
      return
    }
    last = [x, y]
    const now = performance.now()
    // The trail widens across the movement: up and down for a mostly horizontal one, sideways otherwise.
    const [acrossX, acrossY] = Math.abs(x - fromX) >= Math.abs(y - fromY)
      ? [0, 1]
      : [1, 0]
    for (let i = 1; i <= steps; i++) {
      const cx = Math.round(fromX + ((x - fromX) * i) / steps)
      const cy = Math.round(fromY + ((y - fromY) * i) / steps)
      ACROSS.forEach((side, k) => {
        light(cx + acrossX * side, cy + acrossY * side, now, ALPHA, (LIFE * (WIDTH - k)) / WIDTH)
      })
      if (Math.random() < SCATTER) {
        const side = Math.random() < 0.5
          ? -OUTSIDE
          : OUTSIDE
        light(cx + acrossX * side, cy + acrossY * side, now, ALPHA / 2, LIFE / WIDTH)
      }
    }
    raf ||= requestAnimationFrame(frame)
  }, { passive: true })

  // A new trail starts where the pointer comes back, not where it left.
  const forget = () => {
    last = null
  }
  document.documentElement.addEventListener('pointerleave', forget)
  // No element to go to: the pointer left the page, also onto Safari's toolbar (no pointerleave).
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      forget()
    }
  })
  addEventListener('blur', forget)

  // Watch the canvas, not the window: Safari's page zoom resizes it without a resize event.
  new ResizeObserver(resize).observe(canvas)
  new MutationObserver(readColor).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  readColor()
  resize()
}
