import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const CALLOUTS = [
  { id: 'genomic', title: 'Health Insights', sub: 'AI-Powered Feature Mapping', basePairIdx: 4, side: 'top' },
  { id: 'detection', title: 'Early Detection', sub: 'Sub-200ms Inference', basePairIdx: 11, side: 'bottom' },
  { id: 'precision', title: 'Precision Medicine', sub: 'Personalized Clinical Care', basePairIdx: 18, side: 'top' },
  { id: 'risk', title: 'Risk Assessment', sub: 'Data-Driven Healthcare Insights', basePairIdx: 25, side: 'bottom' },
]

export default function InteractiveDNA() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [calloutPositions, setCalloutPositions] = useState([])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let width = container.clientWidth || 800
    let height = container.clientHeight || 420

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, 0, 11)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Main DNA Container Group (Handles Mouse Tilt & Scroll Parallax)
    const dnaMainGroup = new THREE.Group()
    scene.add(dnaMainGroup)

    // Sub-group for DNA Rotation & Floating
    const dnaHelixGroup = new THREE.Group()
    dnaMainGroup.add(dnaHelixGroup)

    // Slight angle tilt for dramatic 3D perspective
    dnaHelixGroup.rotation.z = -Math.PI * 0.08

    // ── 1. Lights ───────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const lightRed = new THREE.PointLight(0xe53935, 4, 25)
    lightRed.position.set(6, 4, 6)
    scene.add(lightRed)

    const lightViolet = new THREE.PointLight(0x7c3aed, 3.5, 25)
    lightViolet.position.set(-6, -4, 4)
    scene.add(lightViolet)

    const lightWhite = new THREE.DirectionalLight(0xffffff, 1.2)
    lightWhite.position.set(0, 5, 10)
    scene.add(lightWhite)

    // ── 2. DNA Double Helix Geometry Generation ───────────────────
    const basePairCount = 30
    const helixRadius = 1.65
    const strandLength = 12.5
    const stepX = strandLength / basePairCount

    // Reusable Materials & Geometries for Optimal Performance
    const sphereGeo = new THREE.SphereGeometry(0.18, 20, 20)

    const redMat = new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0xe53935,
      emissiveIntensity: 0.5,
    })

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0xf8fafc,
      emissiveIntensity: 0.3,
    })

    const violetMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.5,
    })

    const rungMatA = new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
    })

    const rungMatB = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    })

    const strandAPoints = []
    const strandBPoints = []
    const basePairNodes = []

    for (let i = 0; i < basePairCount; i++) {
      const x = -strandLength / 2 + i * stepX
      const angle = i * 0.42

      const yA = Math.cos(angle) * helixRadius
      const zA = Math.sin(angle) * helixRadius

      const yB = Math.cos(angle + Math.PI) * helixRadius
      const zB = Math.sin(angle + Math.PI) * helixRadius

      const ptA = new THREE.Vector3(x, yA, zA)
      const ptB = new THREE.Vector3(x, yB, zB)

      strandAPoints.push(ptA)
      strandBPoints.push(ptB)

      // Nucleotide Node Spheres
      const isRedNode = i % 2 === 0
      const nodeA = new THREE.Mesh(sphereGeo, isRedNode ? redMat : whiteMat)
      nodeA.position.copy(ptA)
      dnaHelixGroup.add(nodeA)

      const nodeB = new THREE.Mesh(sphereGeo, isRedNode ? whiteMat : violetMat)
      nodeB.position.copy(ptB)
      dnaHelixGroup.add(nodeB)

      // Horizontal Base-Pair Rung (Connecting Strand A to Strand B)
      const midpoint = new THREE.Vector3().addVectors(ptA, ptB).multiplyScalar(0.5)
      const rungDist = ptA.distanceTo(ptB)

      // Segment 1 (A to Center)
      const rungGeoA = new THREE.CylinderGeometry(0.045, 0.045, rungDist / 2, 12)
      const rungMeshA = new THREE.Mesh(rungGeoA, rungMatA)
      rungMeshA.position.addVectors(ptA, midpoint).multiplyScalar(0.5)
      rungMeshA.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(midpoint, ptA).normalize())
      dnaHelixGroup.add(rungMeshA)

      // Segment 2 (Center to B)
      const rungGeoB = new THREE.CylinderGeometry(0.045, 0.045, rungDist / 2, 12)
      const rungMeshB = new THREE.Mesh(rungGeoB, rungMatB)
      rungMeshB.position.addVectors(midpoint, ptB).multiplyScalar(0.5)
      rungMeshB.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(ptB, midpoint).normalize())
      dnaHelixGroup.add(rungMeshB)

      // Store node reference for 2D Callout overlay positioning
      basePairNodes.push({ index: i, ptA, ptB, midpoint })
    }

    // Smooth Backbone Tubes winding around the double helix
    const curveA = new THREE.CatmullRomCurve3(strandAPoints)
    const tubeGeoA = new THREE.TubeGeometry(curveA, 120, 0.06, 12, false)
    const tubeMatA = new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xe53935,
      emissiveIntensity: 0.35,
    })
    const tubeA = new THREE.Mesh(tubeGeoA, tubeMatA)
    dnaHelixGroup.add(tubeA)

    const curveB = new THREE.CatmullRomCurve3(strandBPoints)
    const tubeGeoB = new THREE.TubeGeometry(curveB, 120, 0.06, 12, false)
    const tubeMatB = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0xf8fafc,
      emissiveIntensity: 0.25,
    })
    const tubeB = new THREE.Mesh(tubeGeoB, tubeMatB)
    dnaHelixGroup.add(tubeB)

    // ── 3. Ambient Orbiting Quantum Particles Swarm ──────────────
    const particleCount = 140
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 15
      const py = (Math.random() - 0.5) * 4.5
      const pz = (Math.random() - 0.5) * 4.5
      particlePos[i * 3] = px
      particlePos[i * 3 + 1] = py
      particlePos[i * 3 + 2] = pz
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xe53935,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    dnaHelixGroup.add(particleSystem)

    // ── 4. Mouse Physics & Scroll Entry State ────────────────────
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0

    let targetScrollRatio = 0
    let currentScrollRatio = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX = (x / width) * 2 - 1
      mouseY = -(y / height) * 2 + 1

      targetRotY = mouseX * 0.45
      targetRotX = mouseY * 0.35
    }

    const handleMouseLeave = () => {
      targetRotX = 0
      targetRotY = 0
    }

    const handleScroll = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const viewHeight = window.innerHeight
      const visibleHeight = viewHeight - rect.top
      const ratio = Math.min(Math.max(visibleHeight / (viewHeight + rect.height), 0), 1)
      targetScrollRatio = ratio
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // ── 5. Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // ── 6. Render Animation Loop ───────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Continuous Slow Helix Rotation along its X-axis
      dnaHelixGroup.rotation.x = t * 0.35

      // Lerp Mouse Interaction Inertia
      currentRotX += (targetRotX - currentRotX) * 0.06
      currentRotY += (targetRotY - currentRotY) * 0.06

      dnaMainGroup.rotation.x = currentRotX
      dnaMainGroup.rotation.y = currentRotY

      // Subtle Vertical Sine Wave Floating
      dnaHelixGroup.position.y = Math.sin(t * 1.4) * 0.15

      // Smooth Scroll Viewport Entry Lerping
      currentScrollRatio += (targetScrollRatio - currentScrollRatio) * 0.06
      const scrollScale = 0.85 + currentScrollRatio * 0.15
      dnaMainGroup.scale.set(scrollScale, scrollScale, scrollScale)

      // Project 3D Callout Positions to Screen Space
      const newCalloutPos = CALLOUTS.map((c) => {
        const bp = basePairNodes[c.basePairIdx]
        if (!bp) return null

        const targetVec = c.side === 'top' ? bp.ptA : bp.ptB
        const worldPos = targetVec.clone()
        // Apply group transforms
        worldPos.applyMatrix4(dnaHelixGroup.matrixWorld)

        const projected = worldPos.clone().project(camera)
        const screenX = (projected.x * 0.5 + 0.5) * width
        const screenY = (-projected.y * 0.5 + 0.5) * height

        return {
          ...c,
          x: screenX,
          y: screenY,
          visible: projected.z < 1,
        }
      }).filter(Boolean)

      setCalloutPositions(newCalloutPos)

      renderer.render(scene, camera)
    }

    animate()

    // ── 7. Disposal & Cleanup ─────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      sphereGeo.dispose()
      redMat.dispose()
      whiteMat.dispose()
      violetMat.dispose()
      rungMatA.dispose()
      rungMatB.dispose()
      tubeGeoA.dispose()
      tubeGeoB.dispose()
      tubeMatA.dispose()
      tubeMatB.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(229, 57, 53, 0.06) 0%, rgba(124, 58, 237, 0.03) 45%, transparent 75%)',
        borderRadius: 'var(--radius-lg)',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Floating 2D Screen-Projected Information Callout Badges */}
      {calloutPositions.map((c) => {
        if (!c.visible) return null
        const isTop = c.side === 'top'

        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: `${c.x}px`,
              top: `${c.y}px`,
              transform: `translate(-50%, ${isTop ? '-120%' : '30%'})`,
              pointerEvents: 'none',
              transition: 'all 0.1s ease-out',
              zIndex: 5,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.94)',
                color: 'var(--text-main)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(229, 57, 53, 0.25)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px -6px rgba(23, 32, 42, 0.12), 0 0 12px rgba(229, 57, 53, 0.08)',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--red-bright)',
                  boxShadow: '0 0 8px var(--red-bright)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {c.sub}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
