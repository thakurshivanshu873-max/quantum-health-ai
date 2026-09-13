import React, { useEffect, useRef, useState } from 'react'
import {
  Activity,
  Target,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

const SECTIONS = [
  { id: 'hero-section', label: 'Overview', icon: Activity, pathRatio: 0.12 },
  { id: 'benchmarks-section', label: 'Clinical Benchmarks', icon: Target, pathRatio: 0.33 },
  { id: 'advantage-section', label: 'Clinical AI Analysis', icon: Cpu, pathRatio: 0.54 },
  { id: 'advantage-section', label: 'Biomedical DNA Helix', icon: Layers, pathRatio: 0.73 },
  { id: 'explainability-section', label: 'Explainability & Data', icon: ShieldCheck, pathRatio: 0.90 },
]

export default function ScrollProgressRail() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState('hero-section')
  const [hoveredId, setHoveredId] = useState(null)

  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(480)
  const [nodePositions, setNodePositions] = useState([])

  const targetDistRef = useRef(0)
  const currentDistRef = useRef(0)

  // 1. Calculate overall scroll progress ratio [0..100%]
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      const clamped = Math.min(Math.max(progress, 0), 100)
      setScrollProgress(clamped)
      targetDistRef.current = (clamped / 100) * pathLength
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathLength])

  // 2. IntersectionObserver for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.15,
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // 3. Compute SVG path length and exact node (x, y) points along curve
  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLen = path.getTotalLength()
    setPathLength(totalLen)

    const calculatedNodes = SECTIONS.map((sec, idx) => {
      const point = path.getPointAtLength(sec.pathRatio * totalLen)
      return {
        ...sec,
        uniqueKey: `${sec.id}-${idx}`,
        x: point.x,
        y: point.y,
      }
    })
    setNodePositions(calculatedNodes)
  }, [])

  // 4. Smooth Animation Loop for Lerped Progress Tracking
  useEffect(() => {
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      currentDistRef.current += (targetDistRef.current - currentDistRef.current) * 0.09
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [pathLength])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    const el = document.getElementById('explainability-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  const activeDashOffset = pathLength - (scrollProgress / 100) * pathLength

  return (
    <aside
      className="no-print scroll-rail-container"
      aria-label="Medical Interface Scroll Control Rail"
      style={{
        position: 'fixed',
        right: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 950,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '52px',
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        {/* ── TOP CONTROL BUTTON ────────────────────────────────────── */}
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll to Top"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(229, 57, 53, 0.2)',
            boxShadow: '0 6px 18px rgba(23, 32, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--red-bright)'
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 0 14px rgba(229, 57, 53, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.transform = 'scale(1.0)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(23, 32, 42, 0.08)'
          }}
        >
          <ArrowUp size={14} />
        </button>

        {/* ── SVG ORGANIC THIN PALE RED CURVED PATH ────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <svg
            width="48"
            height="440"
            viewBox="0 0 48 440"
            style={{ overflow: 'visible', display: 'block' }}
          >
            <defs>
              {/* Soft Red/Pink Gradient */}
              <linearGradient id="railGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E53935" />
                <stop offset="50%" stopColor="#FF6B81" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              {/* Soft Line Glow Filter */}
              <filter id="railGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Organic Thin Curved Line (Pale Red/Pink) */}
            <path
              ref={pathRef}
              d="M 24 15 C 34 75, 14 155, 24 220 C 34 285, 14 365, 24 425"
              fill="none"
              stroke="rgba(229, 57, 53, 0.22)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Animated Scroll Progress Line */}
            <path
              d="M 24 15 C 34 75, 14 155, 24 220 C 34 285, 14 365, 24 425"
              fill="none"
              stroke="url(#railGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={activeDashOffset}
              filter="url(#railGlow)"
              style={{ transition: 'stroke-dashoffset 0.08s linear' }}
            />
          </svg>
        </div>

        {/* ── FLOATING CIRCULAR CONTROL NODES ALONG CURVE ─────────── */}
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            pointerEvents: 'none',
          }}
        >
          {nodePositions.map((node) => {
            const Icon = node.icon
            const isActive = activeSectionId === node.id
            const isHovered = hoveredId === node.uniqueKey
            const showLabel = isActive || isHovered

            return (
              <div
                key={node.uniqueKey}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                  zIndex: 5,
                }}
                onMouseEnter={() => setHoveredId(node.uniqueKey)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Floating Circular Glass Button */}
                <button
                  type="button"
                  onClick={() => scrollToSection(node.id)}
                  aria-label={node.label}
                  style={{
                    width: isActive ? '36px' : '32px',
                    height: isActive ? '36px' : '32px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.90)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${isActive ? 'var(--red-bright)' : 'rgba(229, 57, 53, 0.18)'}`,
                    boxShadow: isActive
                      ? '0 0 18px rgba(229, 57, 53, 0.45), 0 8px 22px rgba(229, 57, 53, 0.25)'
                      : isHovered
                      ? '0 0 12px rgba(229, 57, 53, 0.3), 0 6px 18px rgba(23, 32, 42, 0.1)'
                      : '0 6px 18px rgba(23, 32, 42, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--red-bright)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    scale: isActive ? '1.12' : isHovered ? '1.08' : '1.0',
                    padding: 0,
                  }}
                >
                  <Icon size={isActive ? 16 : 14} />
                </button>

                {/* Floating Section Name Badge (HTML Overlay) */}
                <div
                  className="scroll-rail-label-badge"
                  onClick={() => scrollToSection(node.id)}
                  style={{
                    position: 'absolute',
                    right: '3.2rem',
                    top: '50%',
                    transform: `translateY(-50%) translateX(${showLabel ? '0px' : '10px'})`,
                    opacity: showLabel ? 1 : 0,
                    visibility: showLabel ? 'visible' : 'hidden',
                    pointerEvents: showLabel ? 'auto' : 'none',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(23, 32, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
                    color: isActive ? '#FFFFFF' : 'var(--text-main)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: `1px solid ${isActive ? 'var(--red-bright)' : 'rgba(23, 32, 42, 0.12)'}`,
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 8px 22px rgba(229, 57, 53, 0.28)' : '0 4px 14px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    zIndex: 10,
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--red-bright)',
                        boxShadow: '0 0 6px var(--red-bright)',
                      }}
                    />
                  )}
                  <span>{node.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── BOTTOM CONTROL BUTTON ─────────────────────────────────── */}
        <button
          type="button"
          onClick={scrollToBottom}
          title="Scroll Down"
          aria-label="Scroll Down"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(229, 57, 53, 0.2)',
            boxShadow: '0 6px 18px rgba(23, 32, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--red-bright)'
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 0 14px rgba(229, 57, 53, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
            e.currentTarget.style.transform = 'scale(1.0)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(23, 32, 42, 0.08)'
          }}
        >
          <ArrowDown size={14} />
        </button>
      </div>
    </aside>
  )
}
