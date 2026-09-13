import React, { useEffect, useRef, useState } from 'react'

export default function QuantumCircuitVisualizer() {
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const numQubits = 6
    const wireYPositions = []
    const paddingX = 75
    const paddingY = 40

    const updateDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth || 700
      canvas.height = 250
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const computeQubitPositions = () => {
      const stepY = (canvas.height - paddingY * 2) / (numQubits - 1)
      wireYPositions.length = 0
      for (let i = 0; i < numQubits; i++) {
        wireYPositions.push(paddingY + i * stepY)
      }
    }

    computeQubitPositions()

    const particles = []
    for (let i = 0; i < 14; i++) {
      particles.push({
        qubit: i % numQubits,
        x: paddingX + Math.random() * (canvas.width - paddingX * 2),
        speed: 0.9 + Math.random() * 1.1,
        size: 3.5,
      })
    }

    let t = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      computeQubitPositions()
      const W = canvas.width
      const H = canvas.height

      // White background fill
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, W, H)

      // Qubit Wires
      for (let i = 0; i < numQubits; i++) {
        const y = wireYPositions[i]

        ctx.beginPath()
        ctx.moveTo(paddingX, y)
        ctx.lineTo(W - paddingX, y)
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Qubit Label
        ctx.font = '700 12px "Plus Jakarta Sans", sans-serif'
        ctx.fillStyle = '#7C3AED'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillText(`|q${i}⟩`, paddingX - 14, y)
      }

      // Circuit Gate Layers
      const layerWidth = (W - paddingX * 2.2) / 4

      // Layer 1: Hadamard Gates (H)
      const l1X = paddingX + layerWidth * 0.7
      for (let i = 0; i < numQubits; i++) {
        drawGate(ctx, l1X, wireYPositions[i], 'H', '#7C3AED')
      }

      // Layer 2: Angle Rotation Gates Rx(θ)
      const l2X = paddingX + layerWidth * 1.6
      for (let i = 0; i < numQubits; i++) {
        const thetaVal = (Math.sin(t * 0.02 + i * 0.8) * Math.PI).toFixed(2)
        drawGate(ctx, l2X, wireYPositions[i], `Rx(${thetaVal})`, '#2563EB')
      }

      // Layer 3: CNOT Entanglement Bridges
      const l3X = paddingX + layerWidth * 2.6
      const entanglePairs = [[0, 1], [2, 3], [4, 5], [1, 2]]
      entanglePairs.forEach(([control, target]) => {
        const cy = wireYPositions[control]
        const ty = wireYPositions[target]

        ctx.beginPath()
        ctx.moveTo(l3X, cy)
        ctx.lineTo(l3X, ty)
        ctx.strokeStyle = '#7C3AED'
        ctx.lineWidth = 2
        ctx.stroke()

        // Control dot
        ctx.beginPath()
        ctx.arc(l3X, cy, 4.5, 0, Math.PI * 2)
        ctx.fillStyle = '#7C3AED'
        ctx.fill()

        // Target circle
        ctx.beginPath()
        ctx.arc(l3X, ty, 7, 0, Math.PI * 2)
        ctx.strokeStyle = '#7C3AED'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Layer 4: Measurement Gates
      const l4X = paddingX + layerWidth * 3.5
      for (let i = 0; i < numQubits; i++) {
        drawGate(ctx, l4X, wireYPositions[i], 'M', '#090D16')
      }

      // Waveform Particles
      if (isPlaying) {
        t += 1
        particles.forEach((p) => {
          p.x += p.speed
          if (p.x > W - paddingX) {
            p.x = paddingX
            p.qubit = Math.floor(Math.random() * numQubits)
          }

          const py = wireYPositions[p.qubit]
          ctx.beginPath()
          ctx.arc(p.x, py, p.size, 0, Math.PI * 2)
          ctx.fillStyle = '#8B5CF6'
          ctx.fill()
        })
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isPlaying])

  const drawGate = (ctx, x, y, label, color) => {
    const gateW = label.length > 3 ? 56 : 28
    const gateH = 24

    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5

    ctx.beginPath()
    ctx.roundRect(x - gateW / 2, y - gateH / 2, gateW, gateH, 6)
    ctx.fill()
    ctx.stroke()

    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#090D16'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x, y)
  }

  return (
    <div className="card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Quantum Feature Encoding & Circuit Wire Map</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            6-Qubit PennyLane Variational Quantum Circuit (R_x(θ) Feature Rotation + Strongly Entangling Layers)
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause Particles' : 'Resume Simulation'}
        </button>
      </div>

      <div style={{ width: '100%', minHeight: '250px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
