import React, { useEffect, useRef } from 'react'

export default function RiskGauge({ probability = 0, label = null, accentColor = null }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const displayW = 260
    const displayH = 150
    canvas.width = displayW * dpr
    canvas.height = displayH * dpr
    canvas.style.width = `${displayW}px`
    canvas.style.height = `${displayH}px`
    ctx.scale(dpr, dpr)

    const cx = displayW / 2
    const cy = displayH * 0.82
    const R = displayW * 0.36

    let current = 0
    const target = Math.min(Math.max(probability, 0), 1)
    const totalSteps = 40
    let step = 0

    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const draw = (val) => {
      ctx.clearRect(0, 0, displayW, displayH)

      // Base Track arc (Light Gray)
      ctx.beginPath()
      ctx.arc(cx, cy, R, Math.PI, 0)
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)'
      ctx.lineWidth = 12
      ctx.lineCap = 'round'
      ctx.stroke()

      // Color scheme based on risk
      let strokeColor = '#10B981' // Green
      if (val >= 0.65) strokeColor = '#EF4444' // Red
      else if (val >= 0.35) strokeColor = '#F97316' // Orange

      if (accentColor) strokeColor = accentColor

      // Filled Progress Arc
      if (val > 0) {
        const angle = Math.PI + val * Math.PI
        ctx.beginPath()
        ctx.arc(cx, cy, R, Math.PI, angle)
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 12
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // Needle calculation
      const needleAngle = Math.PI + val * Math.PI
      const nx = cx + (R - 6) * Math.cos(needleAngle)
      const ny = cy + (R - 6) * Math.sin(needleAngle)

      // Needle line
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(nx, ny)
      ctx.strokeStyle = '#090D16'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.stroke()

      // Center pivot
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Percentage text
      const pctText = `${(val * 100).toFixed(1)}%`
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif'
      ctx.fillStyle = '#090D16'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(pctText, cx, cy - R * 0.35)

      // Label text
      if (label) {
        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif'
        ctx.fillStyle = '#64748B'
        ctx.fillText(label.toUpperCase(), cx, cy - R * 0.7)
      }
    }

    const animate = () => {
      step++
      const t = easeOut(step / totalSteps)
      current = t * target
      draw(current)
      if (step < totalSteps) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [probability, label, accentColor])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
