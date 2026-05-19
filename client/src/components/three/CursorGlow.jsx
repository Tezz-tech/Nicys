import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const dotRef  = useRef(null)
  const glowRef = useRef(null)
  const mouse   = useRef({ x: -100, y: -100 })
  const glowPos = useRef({ x: -100, y: -100 })
  const raf     = useRef(null)
  const isHover = useRef(false)

  useEffect(() => {
    const dot  = dotRef.current
    const glow = glowRef.current
    if (!dot || !glow) return

    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.left = `${e.clientX}px`
      dot.style.top  = `${e.clientY}px`
    }

    const over = (e) => {
      const el = e.target
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) {
        isHover.current = true
        dot.style.transform  = 'translate(-50%,-50%) scale(2.2)'
        dot.style.background = 'rgba(200,164,212,0.15)'
        dot.style.borderColor = '#C8A4D4'
      }
    }

    const out = (e) => {
      const el = e.target
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) {
        isHover.current = false
        dot.style.transform  = 'translate(-50%,-50%) scale(1)'
        dot.style.background = 'transparent'
        dot.style.borderColor = 'rgba(212,165,165,0.7)'
      }
    }

    const down = () => { dot.style.transform = 'translate(-50%,-50%) scale(0.75)' }
    const up   = () => {
      dot.style.transform = isHover.current
        ? 'translate(-50%,-50%) scale(2.2)'
        : 'translate(-50%,-50%) scale(1)'
    }

    const loop = () => {
      const lerp = 0.07
      glowPos.current.x += (mouse.current.x - glowPos.current.x) * lerp
      glowPos.current.y += (mouse.current.y - glowPos.current.y) * lerp
      glow.style.left = `${glowPos.current.x}px`
      glow.style.top  = `${glowPos.current.y}px`
      raf.current = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove',  move)
    document.addEventListener('mouseover',  over)
    document.addEventListener('mouseout',   out)
    document.addEventListener('mousedown',  down)
    document.addEventListener('mouseup',    up)
    raf.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove',  move)
      document.removeEventListener('mouseover',  over)
      document.removeEventListener('mouseout',   out)
      document.removeEventListener('mousedown',  down)
      document.removeEventListener('mouseup',    up)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '14px', height: '14px',
          borderRadius: '50%',
          border: '1.5px solid rgba(212,165,165,0.7)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.15s ease, background 0.2s ease, border-color 0.2s ease',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '40px', height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,165,165,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%,-50%)',
          filter: 'blur(6px)',
        }}
      />
    </>
  )
}
