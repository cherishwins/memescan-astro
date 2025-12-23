/**
 * ConfettiBurst Effect - Layer 2 (Three.js Magic)
 *
 * Colorful confetti rain for big wins (lottery, race wins).
 * Philosophy: Duolingo not Temu - 3 seconds of joy, then done.
 *
 * Respects prefers-reduced-motion for accessibility.
 * Directive: client:only="react" (triggered on demand)
 */
import { useEffect, useRef, useState, useCallback } from 'react'

interface ConfettiBurstProps {
  trigger?: boolean
  duration?: number
  onComplete?: () => void
}

const COLORS = [
  '#00ff88', // Primary green
  '#06b6d4', // Cyan
  '#fbbf24', // Gold
  '#f472b6', // Pink
  '#a78bfa', // Purple
  '#fb923c', // Orange
]

export function ConfettiBurst({
  trigger = false,
  duration = 3000,
  onComplete,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  const createConfetti = useCallback((width: number) => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: -20,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      width: 8 + Math.random() * 8,
      height: 6 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      wobblePhase: Math.random() * Math.PI * 2,
      alpha: 1,
    }))
  }, [])

  useEffect(() => {
    if (!trigger || isAnimating || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    setIsAnimating(true)
    const confetti = createConfetti(canvas.width)
    let animationFrame: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time++

      let allOffScreen = true

      for (const c of confetti) {
        // Update
        c.x += c.vx + Math.sin(time * c.wobbleSpeed + c.wobblePhase) * 2
        c.y += c.vy
        c.rotation += c.rotationSpeed
        c.vy += 0.03 // Gravity

        // Fade out near bottom
        if (c.y > canvas.height - 200) {
          c.alpha = Math.max(0, (canvas.height - c.y) / 200)
        }

        if (c.y < canvas.height + 50) {
          allOffScreen = false

          // Draw
          ctx.save()
          ctx.translate(c.x, c.y)
          ctx.rotate(c.rotation)
          ctx.globalAlpha = c.alpha
          ctx.fillStyle = c.color
          ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height)
          ctx.restore()
        }
      }

      if (!allOffScreen) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        onComplete?.()
      }
    }

    animationFrame = requestAnimationFrame(animate)

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame)
      setIsAnimating(false)
      onComplete?.()
    }, duration)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeout)
    }
  }, [trigger, isAnimating, prefersReducedMotion, createConfetti, duration, onComplete])

  if (prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: isAnimating ? 'block' : 'none' }}
      aria-hidden="true"
    />
  )
}

export default ConfettiBurst
