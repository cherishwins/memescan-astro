/**
 * AchievementBurst Effect - Layer 2 (Three.js Magic)
 *
 * Particle explosion triggered when user earns an achievement.
 * Philosophy: Duolingo not Temu - celebrate the win, then fade.
 *
 * Respects prefers-reduced-motion for accessibility.
 * Directive: client:only="react" (triggered on demand, not SSR)
 */
import { useEffect, useRef, useState, useCallback } from 'react'

interface AchievementBurstProps {
  trigger?: boolean
  color?: string
  particleCount?: number
  duration?: number
  onComplete?: () => void
}

export function AchievementBurst({
  trigger = false,
  color = '#00ff88',
  particleCount = 50,
  duration = 2000,
  onComplete,
}: AchievementBurstProps) {
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

  const createParticles = useCallback(() => {
    if (!canvasRef.current) return []

    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2

    return Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6
      const size = 3 + Math.random() * 6

      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: Math.random() > 0.3 ? color : '#06b6d4', // Mix primary with cyan
      }
    })
  }, [particleCount, color])

  useEffect(() => {
    if (!trigger || isAnimating || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas to viewport size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    setIsAnimating(true)
    const particles = createParticles()
    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allDead = true

      for (const p of particles) {
        if (p.alpha <= 0) continue
        allDead = false

        // Update
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.alpha -= p.decay
        p.rotation += p.rotationSpeed

        // Draw
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color

        // Star shape
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
          const outerRadius = p.size
          const innerRadius = p.size * 0.4
          ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius)
          const innerAngle = angle + Math.PI / 5
          ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      if (!allDead) {
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
  }, [trigger, isAnimating, prefersReducedMotion, createParticles, duration, onComplete])

  // Don't render if reduced motion or not animating
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

export default AchievementBurst
