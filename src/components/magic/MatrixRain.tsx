/**
 * Matrix Rain Effect - Layer 2 (Three.js Magic)
 *
 * Adaptive effect that chooses between:
 * - CSS version (default): Lightweight, 60fps on any device
 * - Canvas version: Full effect, only on high-performance devices
 *
 * Respects prefers-reduced-motion for accessibility.
 * Directive: client:idle (ambient effect, can wait)
 */
import { useEffect, useRef, useState } from 'react'

export function MatrixRain() {
  const [useCanvas, setUseCanvas] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // Detect device performance
    const isHighPerformance = (): boolean => {
      // Mobile devices: always use CSS
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return false
      }

      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2
      if (cores < 4) return false

      // Check device memory if available
      const memory = (navigator as { deviceMemory?: number }).deviceMemory
      if (memory && memory < 4) return false

      // Desktop with 4+ cores and 4GB+ RAM: use canvas
      return true
    }

    setUseCanvas(isHighPerformance())

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Skip all animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return null
  }

  // Default to CSS (SSR-safe, lightweight)
  if (!useCanvas) {
    return <MatrixRainCSS />
  }

  return <MatrixRainCanvas />
}

/**
 * CSS-based Matrix Rain (lightweight, for all devices)
 */
function MatrixRainCSS() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20"
      aria-hidden="true"
    >
      {/* Layer 1: Fast falling columns */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 14px,
            rgba(34, 197, 94, 0.15) 14px,
            rgba(34, 197, 94, 0.15) 15px
          )`,
          backgroundSize: '14px 100%',
          animation: 'matrix-fall-1 8s linear infinite',
          opacity: 0.7,
        }}
      />

      {/* Layer 2: Medium speed columns */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 14px,
            rgba(34, 197, 94, 0.12) 14px,
            rgba(34, 197, 94, 0.12) 15px
          )`,
          backgroundSize: '14px 100%',
          backgroundPosition: '7px 0',
          animation: 'matrix-fall-2 12s linear infinite',
          opacity: 0.5,
        }}
      />

      {/* Layer 3: Slow falling columns for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 14px,
            rgba(34, 197, 94, 0.08) 14px,
            rgba(34, 197, 94, 0.08) 15px
          )`,
          backgroundSize: '14px 100%',
          backgroundPosition: '3px 0',
          animation: 'matrix-fall-3 16s linear infinite',
          opacity: 0.3,
        }}
      />

      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <style>{`
        @keyframes matrix-fall-1 {
          0% { background-position-y: -100vh; }
          100% { background-position-y: 100vh; }
        }
        @keyframes matrix-fall-2 {
          0% { background-position-y: -50vh; }
          100% { background-position-y: 150vh; }
        }
        @keyframes matrix-fall-3 {
          0% { background-position-y: 0vh; }
          100% { background-position-y: 200vh; }
        }
      `}</style>
    </div>
  )
}

/**
 * Canvas-based Matrix Rain (heavy, for high-end devices only)
 */
function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas to full screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Matrix characters - including crypto symbols
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン₿ΞTONUSDT$%&'
    const charArray = chars.split('')

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Array to track the y position of each column
    const drops: number[] = Array(columns).fill(1)

    // Colors - primary green with occasional cyan highlights
    const primaryColor = 'rgba(34, 197, 94, ' // green-500
    const accentColor = 'rgba(6, 182, 212, ' // cyan-500

    function draw() {
      // Semi-transparent black to create fade effect
      ctx!.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      ctx!.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)]

        // Occasional bright cyan character for variety
        const isBright = Math.random() > 0.98
        const opacity = isBright ? '1)' : `${0.3 + Math.random() * 0.5})`
        ctx!.fillStyle = isBright ? accentColor + opacity : primaryColor + opacity

        // Draw the character
        ctx!.fillText(char, i * fontSize, drops[i] * fontSize)

        // Reset drop to top randomly after reaching bottom
        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      aria-hidden="true"
    />
  )
}

export default MatrixRain
