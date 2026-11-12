/**
 * A dot that replaces the mouse cursor, with a short fading trail, drawn on a fixed canvas.
 * Over selectable text it narrows into a caret. Over links and buttons it grows 25%,
 * turns solid and pulses.
 *
 * While the dot is shown, `data-cursor` on <html> hides the system cursor (src/styles/motion.css).
 * It is removed whenever the dot is (pointer out of the window, blur, hidden tab), so
 * there is always one cursor. The canvas never takes pointer events.
 */

/** What is under the pointer: plain page, selectable text or a control. */
type Shape = 'dot' | 'caret' | 'pulse'

type Point = [x: number, y: number]

/** ms for a trail segment to fade out. */
const LIFE = 320
/** Dot radius, px. */
const DOT = 7.2
/** How much the dot grows over a control. */
const CONTROL_SCALE = 1.25
/** Caret width over text, px. */
const CARET = 3
/** ms between pulses over a control. */
const PULSE = 1600
const CONTROLS = 'a[href], button, summary, label, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'

/** The text position under a point, from whichever API the browser has. */
function caretRange(x: number, y: number): Range | null {
  try {
    if ('caretPositionFromPoint' in document) {
      const position = document.caretPositionFromPoint(x, y)
      if (!position) {
        return null
      }
      const range = document.createRange()
      range.setStart(position.offsetNode, position.offset)
      return range
    }
    const legacy = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null }
    return legacy.caretRangeFromPoint?.(x, y) ?? null
  }
  catch {
    return null
  }
}

export function startCursorTrail(): void {
  const canvas = document.createElement('canvas')
  canvas.className = 'cursor-trail'
  canvas.setAttribute('aria-hidden', 'true')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  document.body.append(canvas)

  const root = document.documentElement
  let dpr = 1
  let color = ''
  /** Pointer position, where the dot is drawn: as the only cursor, it never lags behind. */
  let target: Point | null = null
  /** Recent dot positions with their time, for the trail. */
  const trail: [x: number, y: number, time: number][] = []
  /** Area painted in the previous frame: only that is cleared. */
  let dirty: [left: number, top: number, right: number, bottom: number] | null = null
  let raf = 0
  let last = 0
  let shape: Shape = 'dot'
  /** The shape under the pointer needs checking again. */
  let probe = false
  let caretHeight = 20
  let width = DOT * 2
  let height = DOT * 2
  let hoverStart = 0

  const readColor = () => {
    color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4d9eea'
  }

  const shapeAt = (x: number, y: number): Shape => {
    const el = document.elementFromPoint(x, y)
    if (!el) {
      return 'dot'
    }
    if (el.closest(CONTROLS)) {
      return 'pulse'
    }
    // Selectable text: a letter right under the pointer.
    const range = caretRange(x, y)
    const node = range?.startContainer
    if (!range || !(node instanceof Text) || !node.parentElement) {
      return 'dot'
    }
    const style = getComputedStyle(node.parentElement)
    if (style.userSelect === 'none') {
      return 'dot'
    }
    const from = Math.max(0, range.startOffset - 1)
    const to = Math.min(node.length, range.startOffset + 1)
    if (from === to) {
      return 'dot'
    }
    const letters = document.createRange()
    letters.setStart(node, from)
    letters.setEnd(node, to)
    for (const rect of letters.getClientRects()) {
      if (x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top && y <= rect.bottom) {
        caretHeight = Math.max(14, Math.min(56, (Number.parseFloat(style.fontSize) || 16) * 1.25))
        return 'caret'
      }
    }
    return 'dot'
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(2, devicePixelRatio || 1)
    if (rect.width * rect.height * dpr * dpr > 9e6) {
      dpr = 1
    }
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    dirty = null
  }

  const frame = (now: number) => {
    raf = 0
    const dt = last
      ? Math.min(64, now - last)
      : 16.7
    last = now
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (dirty) {
      ctx.clearRect(dirty[0], dirty[1], dirty[2] - dirty[0], dirty[3] - dirty[1])
    }
    dirty = null

    if (!target) {
      trail.length = 0
      last = 0
      shape = 'dot'
      width = height = DOT * 2
      return
    }
    const head = target
    if (probe) {
      probe = false
      const was = shape
      shape = shapeAt(target[0], target[1])
      if (shape === 'pulse' && was !== 'pulse') {
        hoverStart = now
      }
    }

    // The shape morphs between dot, caret and the larger control dot in ~150ms.
    const dotSize = shape === 'pulse'
      ? DOT * 2 * CONTROL_SCALE
      : DOT * 2
    const targetWidth = shape === 'caret'
      ? CARET
      : dotSize
    const targetHeight = shape === 'caret'
      ? caretHeight
      : dotSize
    const morph = 1 - 0.6 ** (dt / 16.7)
    width += (targetWidth - width) * morph
    height += (targetHeight - height) * morph
    const morphing = Math.abs(targetWidth - width) + Math.abs(targetHeight - height) > 0.2
    if (!morphing) {
      width = targetWidth
      height = targetHeight
    }

    const tip = trail.at(-1)
    if (!tip || Math.abs(tip[0] - head[0]) + Math.abs(tip[1] - head[1]) > 0.4) {
      trail.push([head[0], head[1], now])
    }
    while (trail.length && now - trail[0][2] > LIFE) {
      trail.shift()
    }

    let [left, top] = head
    let [right, bottom] = head
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineCap = 'butt'

    // Trail: each segment is thinner and fainter the older it is.
    for (let i = 1; i < trail.length; i++) {
      const [ax, ay] = trail[i - 1]
      const [bx, by, time] = trail[i]
      const k = 1 - (now - time) / LIFE
      if (k <= 0) {
        continue
      }
      ctx.globalAlpha = 0.3 * k * k
      ctx.lineWidth = Math.max(0.6, width * k)
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()
      left = Math.min(left, ax)
      right = Math.max(right, ax)
      top = Math.min(top, ay)
      bottom = Math.max(bottom, ay)
    }
    const newest = trail.at(-1)
    if (newest && trail.length > 1) {
      ctx.globalAlpha = 0.3
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(newest[0], newest[1])
      ctx.lineTo(head[0], head[1])
      ctx.stroke()
    }

    // Over a control: a disc grows from the dot and fades, once per pulse.
    if (shape === 'pulse') {
      const phase = ((now - hoverStart) % PULSE) / (PULSE * 0.7)
      if (phase < 1) {
        const grow = 1 - (1 - phase) ** 4
        ctx.globalAlpha = 0.4 * (1 - grow)
        ctx.beginPath()
        ctx.arc(head[0], head[1], (width / 2) * (1 + 1.8 * grow), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Solid over a control.
    ctx.globalAlpha = shape === 'pulse'
      ? 1
      : 0.9
    ctx.beginPath()
    ctx.roundRect(head[0] - width / 2, head[1] - height / 2, width, height, Math.min(width, height) / 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // Covers the widest pulse (2.8 × the dot radius) and the tallest caret.
    const margin = Math.max((width / 2) * 2.8, height / 2) + 4
    dirty = [
      Math.floor(left - margin),
      Math.floor(top - margin),
      Math.ceil(right + margin),
      Math.ceil(bottom + margin),
    ]

    // Keep drawing while something changes; with the pointer still away from a control, stop.
    if (trail.length || morphing || shape === 'pulse') {
      raf = requestAnimationFrame(frame)
    }
    else {
      last = 0
    }
  }

  const kick = () => {
    raf ||= requestAnimationFrame(frame)
  }
  const hide = () => {
    target = null
    root.removeAttribute('data-cursor')
    kick()
  }

  addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return
    }
    // Some browsers send a fake move at (0, 0) on load.
    if (!target && !event.clientX && !event.clientY) {
      return
    }
    if (!target) {
      root.setAttribute('data-cursor', '')
    }
    target = [event.clientX, event.clientY]
    probe = true
    kick()
  }, { passive: true })
  // Scrolling changes what is under a still pointer.
  addEventListener('scroll', () => {
    if (target) {
      probe = true
      kick()
    }
  }, { passive: true })
  // The canvas buffer must match its size on screen, or everything drawn is scaled and shifted.
  // Watch the canvas itself rather than the window: Safari's page zoom changes it with no resize event.
  new ResizeObserver(() => {
    resize()
    kick()
  }).observe(canvas)
  // Moving the window to a screen with another pixel density changes only devicePixelRatio.
  const watchDensity = () => {
    matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener('change', () => {
      resize()
      kick()
      watchDensity()
    }, { once: true })
  }
  watchDensity()

  document.documentElement.addEventListener('pointerleave', hide)
  // A mouseout with no element to go to also means the pointer left the page. It covers exits
  // that may send no pointerleave to <html>, like moving onto Safari's toolbar over the page.
  document.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) {
      hide()
    }
  })
  addEventListener('blur', hide)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hide()
    }
  })

  // A theme switch repaints the dot in the new accent right away.
  new MutationObserver(() => {
    readColor()
    if (target) {
      cancelAnimationFrame(raf)
      frame(performance.now())
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  readColor()
  resize()
}
