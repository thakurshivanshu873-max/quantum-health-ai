import React, { useEffect, useRef } from 'react'

export default function QuantumHeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId
    let width = (canvas.width = canvas.parentElement.offsetWidth || 500)
    let height = (canvas.height = 440)

    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.width = canvas.parentElement.offsetWidth
      height = canvas.height = 440
    }
    window.addEventListener('resize', handleResize)

    // Quantum nodes data
    const nodes = [
      { label: 'Glucose (mg/dL)', angle: 0, r: 130, speed: 0.008, color: '#7C3AED' },
      { label: 'Blood Pressure', angle: 2.1, r: 130, speed: 0.008, color: '#2563EB' },
      { label: 'BMI (kg/m²)', angle: 4.2, r: 130, speed: 0.008, color: '#10B981' },
      { label: '|ψ⟩ Qubit 0', angle: 1.0, r: 75, speed: -0.012, color: '#8B5CF6' },
      { label: '|ψ⟩ Qubit 1', angle: 3.14, r: 75, speed: -0.012, color: '#3B82F6' },
      { label: '|ψ⟩ Qubit 2', angle: 5.2, r: 75, speed: -0.012, color: '#A855F7' },
    ]

    let time = 0

    const render = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      // Draw outer ambient ring
      ctx.beginPath()
      ctx.arc(cx, cy, 175, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.07)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 8])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw Qubit circuit ring
      ctx.beginPath()
      ctx.arc(cx, cy, 130, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw inner core ring
      ctx.beginPath()
      ctx.arc(cx, cy, 75, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.18)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Center Neural Core
      const corePulse = 18 + Math.sin(time * 2) * 3
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 45)
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.9)')
      grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.4)')
      grad.addColorStop(1, 'rgba(9, 13, 22, 0)')

      ctx.beginPath()
      ctx.arc(cx, cy, 45, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, corePulse, 0, Math.PI * 2)
      ctx.fillStyle = '#090D16'
      ctx.fill()
      ctx.strokeStyle = '#8B5CF6'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw Center Symbol
      ctx.font = '700 13px Plus Jakarta Sans, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('VQC', cx, cy)

      // Render Nodes & Connecting Entanglements
      nodes.forEach((node, i) => {
        node.angle += node.speed
        const nx = cx + Math.cos(node.angle) * node.r
        const ny = cy + Math.sin(node.angle) * node.r

        // Lines to core
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = `${node.color}35`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Lines between adjacent nodes (Entanglement)
        const nextNode = nodes[(i + 1) % nodes.length]
        const nnx = cx + Math.cos(nextNode.angle) * nextNode.r
        const nny = cy + Math.sin(nextNode.angle) * nextNode.r
        ctx.beginPath()
        ctx.moveTo(nx, ny)
        ctx.lineTo(nnx, nny)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Node circle
        ctx.beginPath()
        ctx.arc(nx, ny, 6, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()

        // Label pill
        ctx.font = '600 10px Plus Jakarta Sans, sans-serif'
        ctx.fillStyle = '#64748B'
        ctx.textAlign = nx > cx ? 'left' : 'right'
        const offset = nx > cx ? 12 : -12
        ctx.fillText(node.label, nx + offset, ny + 3)
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, rgba(248, 249, 250, 0) 70%)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
