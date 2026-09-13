import React, { useEffect, useRef, useState } from 'react'

export default function AnatomicalQuantumModel({ selectedDisease = 'heart', onSelectDisease }) {
  const canvasRef = useRef(null)
  const [pulse, setPulse] = useState(72)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let t = 0

    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth || 480
      canvas.height = 360
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2 - 10
      t += 0.04

      // Subtle pulse expansion factor
      const pulseScale = 1 + Math.sin(t * 3) * 0.035

      // Ambient radial glow behind heart
      const radGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 160)
      radGrad.addColorStop(0, 'rgba(255, 51, 102, 0.25)')
      radGrad.addColorStop(0.5, 'rgba(255, 51, 102, 0.08)')
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = radGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(pulseScale, pulseScale)

      // Draw stylized 3D Anatomical Heart & Vessels using Canvas curves
      // Aorta & Main Artery Arches
      ctx.beginPath()
      ctx.moveTo(-15, -45)
      ctx.bezierCurveTo(-35, -110, 45, -110, 30, -40)
      ctx.lineWidth = 22
      ctx.strokeStyle = '#e11d48'
      ctx.lineCap = 'round'
      ctx.stroke()

      // Pulmonary Veins (Blue accents)
      ctx.beginPath()
      ctx.moveTo(-35, -30)
      ctx.bezierCurveTo(-65, -75, -15, -85, -20, -25)
      ctx.lineWidth = 14
      ctx.strokeStyle = '#0284c7'
      ctx.stroke()

      // Superior Vena Cava
      ctx.beginPath()
      ctx.moveTo(18, -45)
      ctx.lineTo(22, -85)
      ctx.lineWidth = 12
      ctx.strokeStyle = '#0284c7'
      ctx.stroke()

      // Main Heart Body (Left & Right Ventricles / Atria)
      const heartGrad = ctx.createLinearGradient(-60, -40, 60, 90)
      heartGrad.addColorStop(0, '#ff4d6d')
      heartGrad.addColorStop(0.4, '#c9184a')
      heartGrad.addColorStop(0.8, '#800f2f')
      heartGrad.addColorStop(1, '#590d22')

      ctx.beginPath()
      ctx.moveTo(0, 85)
      // Left ventricle curve
      ctx.bezierCurveTo(-75, 45, -85, -35, -25, -55)
      ctx.bezierCurveTo(0, -65, 0, -45, 0, -45)
      ctx.bezierCurveTo(0, -45, 0, -65, 25, -55)
      // Right ventricle curve
      ctx.bezierCurveTo(85, -35, 75, 45, 0, 85)
      ctx.closePath()

      ctx.fillStyle = heartGrad
      ctx.shadowColor = 'rgba(255, 51, 102, 0.4)'
      ctx.shadowBlur = 24
      ctx.fill()
      ctx.shadowBlur = 0

      // Coronary Artery Vessels (Branching network over heart surface)
      ctx.beginPath()
      ctx.moveTo(-5, -35)
      ctx.quadraticCurveTo(-15, 10, -35, 45)
      ctx.moveTo(-15, 10)
      ctx.quadraticCurveTo(-35, 20, -50, 30)
      ctx.moveTo(-5, -35)
      ctx.quadraticCurveTo(15, 15, 25, 55)
      ctx.moveTo(15, 15)
      ctx.quadraticCurveTo(35, 25, 45, 35)

      ctx.lineWidth = 3
      ctx.strokeStyle = '#ffb3c1'
      ctx.stroke()

      // Cyan Quantum Entanglement Orbit Rays over organ
      for (let i = 0; i < 3; i++) {
        const orbitAngle = t * 0.8 + (i * Math.PI) / 1.5
        const rx = 85 + i * 15
        const ry = 40 + i * 10
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, orbitAngle, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 + i * 0.1})`
        ctx.lineWidth = 1.2
        ctx.setLineDash([6, 8])
        ctx.stroke()
        ctx.setLineDash([])

        // Particle on orbit
        const px = Math.cos(t * 1.5 + i) * rx
        const py = Math.sin(t * 1.5 + i) * ry
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#00f2fe'
        ctx.shadowColor = '#00f2fe'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [selectedDisease])

  return (
    <div className="spatial-organ-card">
      {/* Model Title & Health Ring */}
      <div className="spatial-organ-header">
        <div>
          <h2 className="spatial-title">Overview</h2>
          <h2 className="spatial-title-sub">Patient Health</h2>
        </div>

        {/* Circular Metric Ring Widget */}
        <div className="spatial-ring-badge">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="21" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" />
            <circle
              cx="26" cy="26" r="21"
              stroke="#00e676" strokeWidth="4" fill="none"
              strokeDasharray="131" strokeDashoffset="28"
              strokeLinecap="round"
              transform="rotate(-90 26 26)"
            />
          </svg>
          <span className="ring-text">98%</span>
        </div>
      </div>

      {/* Anatomical Heart Canvas Container */}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />

        {/* Floating Telemetry Tag 1: SpO2 Line Graph */}
        <div className="floating-telemetry-tag tag-spo2">
          <div className="tag-header">
            <span className="tag-label">SpO2</span>
            <span className="tag-val">98.5%</span>
          </div>
          <svg width="100" height="24" viewBox="0 0 100 24" style={{ overflow: 'visible' }}>
            <path
              d="M 0 16 Q 15 18, 30 10 T 60 14 T 80 4 T 100 12"
              fill="none"
              stroke="#00f2fe"
              strokeWidth="2"
            />
            <circle cx="100" cy="12" r="3" fill="#00f2fe" />
          </svg>
          <div className="tag-sub">Normal Range · 100% Peak</div>
        </div>

        {/* Floating Telemetry Tag 2: Doctor Schedule / Patient Appointment */}
        <div className="floating-telemetry-tag tag-appointment">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
              alt="Doctor"
              className="tag-avatar"
            />
            <div>
              <div className="tag-date">14 May · Today</div>
              <div className="tag-time">Monday 10:00–11:30</div>
              <div className="tag-doctor">Pulmonary & Cardiac Specialist</div>
            </div>
          </div>
        </div>

        {/* Floating Tag 3: Quantum VQC Telemetry */}
        <div className="floating-telemetry-tag tag-quantum-qubit">
          <span className="qubit-dot"></span>
          <span>PennyLane VQC 6-Qubit State Active</span>
        </div>
      </div>

      {/* Model Selection Tabs below Organ */}
      <div className="organ-model-selector">
        {[
          { id: 'heart', label: '❤️ Coronary Heart', color: '#ff3366' },
          { id: 'diabetes', label: '🩸 Type-2 Diabetes', color: '#00d4ff' },
          { id: 'cancer', label: '🎗️ Breast Cancer', color: '#9d4edd' },
        ].map(m => (
          <button
            key={m.id}
            className={`organ-tab ${selectedDisease === m.id ? 'active' : ''}`}
            onClick={() => onSelectDisease && onSelectDisease(m.id)}
            style={{ '--tab-color': m.color }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
