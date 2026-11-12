/*
 * With a mouse, the pointer lights a short trail of squares on a fixed grid behind it. Once it
 * rests, a round patch of squares breathes around it. Neither replaces the system cursor.
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

/** ms the pointer must rest before the patch starts breathing. */
const IDLE = 4000
/** ms for one breath, in and out. */
const BREATH = 2000
/** Patch radius at the top of a breath, in squares. */
const BREATH_RADIUS = 7
/** Patch radius at the bottom of a breath, as a share of the top. */
const BREATH_LOW = 0.45
/** Opacity of the centre square at the top of a breath. */
const BREATH_ALPHA = 0.3
/** Moving less than this, px, doesn't wake the patch: a hand on the mouse is never quite still. */
const JITTER = CELL

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

type Square = [x: number, y: number, alpha: number]

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
  /** Grid cell of the pointer. */
  let last: [x: number, y: number] | null = null
  let raf = 0

  let idleTimer = 0
  /** Where the pointer rests, px, and when the patch started breathing (0 while it isn't). */
  let restAt: [x: number, y: number] = [0, 0]
  let breathStart = 0
  /** The patch as last drawn, and what it was drawn from: an unchanged key skips the redraw. */
  let breath: Square[] = []
  let breathKey = ''

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4d9eea'
    breathKey = ''
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(2, devicePixelRatio || 1)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    breathKey = ''
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

  /** Radius in squares and centre opacity of the patch, `t` ms into its breathing, in steps. */
  const breathAt = (t: number): [radius: number, strength: number] => {
    // 0 at the bottom of a breath, 1 at the top.
    const depth = (1 - Math.cos((2 * Math.PI * t) / BREATH)) / 2
    const radius = BREATH_RADIUS * (BREATH_LOW + (1 - BREATH_LOW) * depth)
    // The first breath in fades the patch in from nothing; after that it never drops below 40%.
    const strength = t < BREATH / 2
      ? depth
      : 0.4 + 0.6 * depth
    return [Math.round(radius * 4) / 4, (BREATH_ALPHA * Math.ceil(strength * 8)) / 8]
  }

  /** The patch's squares around the pointer's cell, dimmer in steps towards the edge. */
  const patch = ([cx, cy]: [number, number], radius: number, strength: number): Square[] => {
    const squares: Square[] = []
    const reach = Math.floor(radius)
    for (let dy = -reach; dy <= reach; dy++) {
      for (let dx = -reach; dx <= reach; dx++) {
        const distance = Math.hypot(dx, dy)
        if (distance <= radius) {
          const level = Math.ceil((1 - distance / radius) * STEPS) / STEPS
          squares.push([cx + dx, cy + dy, strength * level])
        }
      }
    }
    return squares
  }

  const frame = (now: number) => {
    raf = 0
    const breathing = breathStart > 0 && last !== null
    const shape = breathing
      ? breathAt(now - breathStart)
      : null
    const key = shape?.join() ?? ''
    if (!pixels.size && breathing && key === breathKey) {
      raf = requestAnimationFrame(frame)
      return
    }
    breathKey = key

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = color
    for (const [pixelKey, pixel] of pixels) {
      if (now >= pixel.until) {
        pixels.delete(pixelKey)
        continue
      }
      // Every square fades on the same curve, so the narrowing reads as steps in width.
      const left = 1 - (now - pixel.born) / LIFE
      ctx.globalAlpha = pixel.alpha * Math.ceil(Math.min(1, left) * STEPS) / STEPS
      ctx.fillRect(pixel.x * CELL, pixel.y * CELL, SIZE, SIZE)
    }
    breath = shape && last
      ? patch(last, ...shape)
      : []
    for (const [x, y, alpha] of breath) {
      ctx.globalAlpha = alpha
      ctx.fillRect(x * CELL, y * CELL, SIZE, SIZE)
    }
    ctx.globalAlpha = 1
    if (pixels.size || breathing) {
      raf = requestAnimationFrame(frame)
    }
  }

  const kick = () => {
    raf ||= requestAnimationFrame(frame)
  }

  /** Stops the breathing and leaves the patch to fade out like the trail. */
  const wake = () => {
    clearTimeout(idleTimer)
    if (!breathStart) {
      return
    }
    const now = performance.now()
    for (const [x, y, alpha] of breath) {
      light(x, y, now, alpha, LIFE)
    }
    breathStart = 0
    breath = []
    breathKey = ''
    kick()
  }

  const rest = () => {
    clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => {
      if (last) {
        breathStart = performance.now()
        kick()
      }
    }, IDLE)
  }

  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return
    }
    // Some browsers send a fake move at (0, 0) on load.
    if (!last && !event.clientX && !event.clientY) {
      return
    }
    if (breathStart && Math.hypot(event.clientX - restAt[0], event.clientY - restAt[1]) < JITTER) {
      return
    }
    restAt = [event.clientX, event.clientY]
    wake()
    rest()

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
    kick()
  }, { passive: true })

  // A click or a key press counts as activity, so the patch waits again.
  for (const type of ['pointerdown', 'keydown']) {
    addEventListener(type, () => {
      wake()
      rest()
    }, { passive: true })
  }

  // A new trail starts where the pointer comes back, not where it left.
  const forget = () => {
    wake()
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
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      forget()
    }
  })

  // Watch the canvas, not the window: Safari's page zoom resizes it without a resize event.
  new ResizeObserver(() => {
    resize()
    kick()
  }).observe(canvas)
  new MutationObserver(() => {
    readColor()
    kick()
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  readColor()
  resize()
}
