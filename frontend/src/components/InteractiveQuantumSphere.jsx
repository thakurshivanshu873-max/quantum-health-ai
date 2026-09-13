import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const NODES_DATA = [
  { id: 'glucose', label: 'Glucose (mg/dL)', ring: 0, angle: 0, color: '#E53935', val: '125 mg/dL' },
  { id: 'bp', label: 'Blood Pressure', ring: 0, angle: Math.PI * 0.66, color: '#2563EB', val: '120/80 mmHg' },
  { id: 'bmi', label: 'BMI (kg/m²)', ring: 0, angle: Math.PI * 1.33, color: '#10B981', val: '24.2 kg/m²' },
  { id: 'insulin', label: 'Insulin (µU/mL)', ring: 1, angle: Math.PI * 0.25, color: '#7C3AED', val: '85 µU/mL' },
  { id: 'chol', label: 'Cholesterol (mg/dL)', ring: 1, angle: Math.PI * 0.92, color: '#8B5CF6', val: '195 mg/dL' },
  { id: 'hr', label: 'Heart Rate (BPM)', ring: 1, angle: Math.PI * 1.58, color: '#3B82F6', val: '72 BPM' },
]

export default function InteractiveQuantumSphere() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [nodePositions, setNodePositions] = useState([])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let width = container.clientWidth || 550
    let height = container.clientHeight || 480

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 8.5

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Main Group for Mouse Rotation & Scroll Parallax
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ── 1. Lights ───────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const pointLightRed = new THREE.PointLight(0xe53935, 3, 20)
    pointLightRed.position.set(4, 3, 5)
    scene.add(pointLightRed)

    const pointLightViolet = new THREE.PointLight(0x7c3aed, 3, 20)
    pointLightViolet.position.set(-4, -3, -3)
    scene.add(pointLightViolet)

    // ── 2. Central VQC Quantum Core ────────────────────────────────
    const coreGroup = new THREE.Group()
    mainGroup.add(coreGroup)

    // Inner Metallic Core
    const innerGeo = new THREE.SphereGeometry(0.85, 32, 32)
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.4,
    })
    const innerCore = new THREE.Mesh(innerGeo, innerMat)
    coreGroup.add(innerCore)

    // Glowing Wireframe Outer Aura
    const auraGeo = new THREE.IcosahedronGeometry(1.25, 2)
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const outerAura = new THREE.Mesh(auraGeo, auraMat)
    coreGroup.add(outerAura)

    // Secondary Pulsing Shell
    const shellGeo = new THREE.SphereGeometry(1.05, 24, 24)
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xe53935,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
    const shellMesh = new THREE.Mesh(shellGeo, shellMat)
    coreGroup.add(shellMesh)

    // ── 3. Red Orbital Rings ───────────────────────────────────────
    const ringConfigs = [
      { radius: 2.5, tube: 0.018, rotX: Math.PI * 0.38, rotY: Math.PI * 0.1, color: 0xe53935 },
      { radius: 3.2, tube: 0.015, rotX: Math.PI * 0.65, rotY: Math.PI * 0.25, color: 0x7c3aed },
      { radius: 3.8, tube: 0.012, rotX: Math.PI * 0.2, rotY: Math.PI * 0.75, color: 0x2563eb },
    ]

    const rings = []
    ringConfigs.forEach((cfg) => {
      const ringGroup = new THREE.Group()
      ringGroup.rotation.x = cfg.rotX
      ringGroup.rotation.y = cfg.rotY

      const torusGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100)
      const torusMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.65,
      })
      const torusMesh = new THREE.Mesh(torusGeo, torusMat)
      ringGroup.add(torusMesh)

      mainGroup.add(ringGroup)
      rings.push({ group: ringGroup, radius: cfg.radius })
    })

    // ── 4. Glowing Quantum Nodes ──────────────────────────────────
    const nodeMeshes = []
    NODES_DATA.forEach((data) => {
      const ringObj = rings[data.ring]
      const r = ringObj.radius
      const x = Math.cos(data.angle) * r
      const y = Math.sin(data.angle) * r

      const nodeGroup = new THREE.Group()
      nodeGroup.position.set(x, y, 0)

      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(0.2, 24, 24)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.color),
        roughness: 0.2,
        metalness: 0.8,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.7,
      })
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
      sphereMesh.userData = { id: data.id, label: data.label, val: data.val, color: data.color }
      nodeGroup.add(sphereMesh)

      // Outer Halo Ring on Node
      const haloGeo = new THREE.RingGeometry(0.24, 0.3, 32)
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(data.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
      const haloMesh = new THREE.Mesh(haloGeo, haloMat)
      nodeGroup.add(haloMesh)

      ringObj.group.add(nodeGroup)
      nodeMeshes.push({ mesh: sphereMesh, group: nodeGroup, data, ringGroup: ringObj.group, radius: r })
    })

    // ── 5. Orbiting Quantum Swarm Particles ────────────────────────
    const particleCount = 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    const particleSpeed = []

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 2.0 + Math.random() * 2.2

      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePos[i * 3 + 2] = r * Math.cos(phi)

      particleSpeed.push({
        r,
        theta,
        phi,
        speedTheta: (Math.random() - 0.5) * 0.015,
        speedPhi: (Math.random() - 0.5) * 0.015,
      })
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xe53935,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    mainGroup.add(particleSystem)

    // ── 6. Mouse Interaction & Scroll Parallax State ──────────────
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0
    let autoRotY = 0

    let targetScrollY = 0
    let currentScrollY = 0

    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2(-999, -999)

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX = (x / width) * 2 - 1
      mouseY = -(y / height) * 2 + 1

      mouseVec.x = mouseX
      mouseVec.y = mouseY

      targetRotX = mouseY * 0.45
      targetRotY = mouseX * 0.45
    }

    const handleMouseLeave = () => {
      targetRotX = 0
      targetRotY = 0
      mouseVec.set(-999, -999)
      setHoveredNode(null)
    }

    const handleScroll = () => {
      targetScrollY = window.scrollY
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── 7. Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // ── 8. Render Animation Loop ───────────────────────────────────
    let animId
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Continuous Slow Autonomous Rotation
      autoRotY += 0.003

      // Lerp Scroll Position for Subtle Spatial Parallax
      currentScrollY += (targetScrollY - currentScrollY) * 0.05
      const scrollParallaxY = -currentScrollY * 0.0012
      const scrollTiltX = currentScrollY * 0.00035

      // Smooth Mouse Inertia / Lerping
      currentRotX += (targetRotX - currentRotX) * 0.06
      currentRotY += (targetRotY + autoRotY - currentRotY) * 0.06

      mainGroup.rotation.x = currentRotX + scrollTiltX
      mainGroup.rotation.y = currentRotY
      mainGroup.position.y = scrollParallaxY

      // Core Animation
      outerAura.rotation.y = -elapsedTime * 0.3
      shellMesh.rotation.z = elapsedTime * 0.25
      const pulseScale = 1 + Math.sin(elapsedTime * 3) * 0.04
      coreGroup.scale.set(pulseScale, pulseScale, pulseScale)

      // Orbit Nodes Animation
      nodeMeshes.forEach((item) => {
        item.data.angle += 0.004
        const x = Math.cos(item.data.angle) * item.radius
        const y = Math.sin(item.data.angle) * item.radius
        item.group.position.set(x, y, 0)
      })

      // Orbit Swarm Particles
      const positions = particleGeo.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const sp = particleSpeed[i]
        sp.theta += sp.speedTheta
        sp.phi += sp.speedPhi

        positions[i * 3] = sp.r * Math.sin(sp.phi) * Math.cos(sp.theta)
        positions[i * 3 + 1] = sp.r * Math.sin(sp.phi) * Math.sin(sp.theta)
        positions[i * 3 + 2] = sp.r * Math.cos(sp.phi)
      }
      particleGeo.attributes.position.needsUpdate = true

      // Raycasting for Hover Detection
      raycaster.setFromCamera(mouseVec, camera)
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh))

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object
        const data = hitMesh.userData
        setHoveredNode(data)
        container.style.cursor = 'pointer'

        nodeMeshes.forEach((n) => {
          if (n.mesh === hitMesh) {
            n.mesh.scale.set(1.4, 1.4, 1.4)
            n.mesh.material.emissiveIntensity = 1.2
          } else {
            n.mesh.scale.set(1.0, 1.0, 1.0)
            n.mesh.material.emissiveIntensity = 0.7
          }
        })
      } else {
        container.style.cursor = 'default'
        setHoveredNode(null)
        nodeMeshes.forEach((n) => {
          n.mesh.scale.set(1.0, 1.0, 1.0)
          n.mesh.material.emissiveIntensity = 0.7
        })
      }

      // Calculate 2D screen positions for labels
      const newPos = nodeMeshes.map((n) => {
        const worldPos = new THREE.Vector3()
        n.mesh.getWorldPosition(worldPos)
        const projected = worldPos.clone().project(camera)
        const screenX = (projected.x * 0.5 + 0.5) * width
        const screenY = (-projected.y * 0.5 + 0.5) * height
        return {
          id: n.data.id,
          label: n.data.label,
          val: n.data.val,
          color: n.data.color,
          x: screenX,
          y: screenY,
          visible: projected.z < 1,
        }
      })
      setNodePositions(newPos)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(229, 57, 53, 0.06) 0%, rgba(124, 58, 237, 0.03) 45%, rgba(248, 249, 250, 0) 75%)',
        borderRadius: 'var(--radius-lg)',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* 2D Projected Floating Health Parameter Labels */}
      {nodePositions.map((pos) => {
        if (!pos.visible) return null
        const isHovered = hoveredNode?.id === pos.id
        return (
          <div
            key={pos.id}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -130%)',
              pointerEvents: 'none',
              transition: 'all 0.15s ease-out',
              opacity: isHovered ? 1 : 0.85,
              zIndex: isHovered ? 10 : 2,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isHovered ? 'rgba(23, 32, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                color: isHovered ? '#FFFFFF' : 'var(--text-main)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${isHovered ? pos.color : 'rgba(23, 32, 42, 0.12)'}`,
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.73rem',
                fontWeight: 700,
                boxShadow: isHovered ? `0 6px 18px ${pos.color}40` : '0 4px 12px rgba(0,0,0,0.06)',
                scale: isHovered ? '1.1' : '1.0',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: pos.color,
                  boxShadow: `0 0 8px ${pos.color}`,
                }}
              />
              <span>{pos.label}</span>
              {isHovered && (
                <span style={{ fontSize: '0.68rem', opacity: 0.85, color: '#A855F7', marginLeft: '0.2rem' }}>
                  ({pos.val})
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* Central Overlay VQC Label */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#FFFFFF',
            background: 'linear-gradient(135deg, var(--red-bright) 0%, var(--accent-violet) 100%)',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 14px rgba(229, 57, 53, 0.4)',
          }}
        >
          CLINICAL AI ENGINE
        </div>
      </div>
    </div>
  )
}
