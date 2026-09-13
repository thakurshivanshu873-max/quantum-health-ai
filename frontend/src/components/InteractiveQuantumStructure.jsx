import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function InteractiveQuantumStructure() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let width = container.clientWidth || 500
    let height = container.clientHeight || 340

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 7.5

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Main Group
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const pointLightRed = new THREE.PointLight(0xe53935, 4, 15)
    pointLightRed.position.set(3, 4, 4)
    scene.add(pointLightRed)

    const pointLightWhite = new THREE.PointLight(0xffffff, 2.5, 15)
    pointLightWhite.position.set(-4, -2, 2)
    scene.add(pointLightWhite)

    // ── Generate 3D Molecular / Quantum Lattice Nodes ─────────────
    const nodeCount = 26
    const nodes = []
    const nodeGroup = new THREE.Group()
    mainGroup.add(nodeGroup)

    // Materials
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xe53935,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xe53935,
      emissiveIntensity: 0.6,
    })

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xf8fafc,
      emissiveIntensity: 0.4,
    })

    const nodePositions = []

    for (let i = 0; i < nodeCount; i++) {
      const isRed = i % 3 === 0
      const radius = isRed ? 0.16 : 0.12
      const geo = new THREE.SphereGeometry(radius, 20, 20)
      const mesh = new THREE.Mesh(geo, isRed ? redMat : whiteMat)

      // Random position in a spherical volume
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 1.2 + Math.random() * 1.6

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      mesh.position.set(x, y, z)
      mesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        isRed,
      }

      nodeGroup.add(mesh)
      nodes.push(mesh)
      nodePositions.push(new THREE.Vector3(x, y, z))
    }

    // ── Connect Neighboring Nodes with Dynamic Lines ─────────────
    const maxDistance = 2.0
    const linePairs = []

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j])
        if (dist < maxDistance) {
          linePairs.push({ i, j })
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    const linePos = new Float32Array(linePairs.length * 6)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xe53935,
      transparent: true,
      opacity: 0.35,
      linewidth: 1.5,
    })

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat)
    mainGroup.add(linesMesh)

    // ── Mouse Physics & Scroll Viewport Entry Physics ─────────────
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0
    let autoRotY = 0

    let targetScrollRatio = 0
    let currentScrollRatio = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX = (x / width) * 2 - 1
      mouseY = -(y / height) * 2 + 1

      targetRotX = mouseY * 0.6
      targetRotY = mouseX * 0.6
    }

    const handleMouseLeave = () => {
      targetRotX = 0
      targetRotY = 0
    }

    const handleScroll = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const viewHeight = window.innerHeight
      // Calculate how far the container has entered the viewport [0 to 1]
      const visibleHeight = viewHeight - rect.top
      const ratio = Math.min(Math.max(visibleHeight / (viewHeight + rect.height), 0), 1)
      targetScrollRatio = ratio
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // ── Render Animation Loop ───────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Continuous rotation & lerped mouse inertia
      autoRotY += 0.004
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY + autoRotY - currentRotY) * 0.05

      // Smooth scroll viewport entry lerping
      currentScrollRatio += (targetScrollRatio - currentScrollRatio) * 0.06
      const scrollRotationY = currentScrollRatio * Math.PI * 0.5
      const scrollScale = 0.85 + currentScrollRatio * 0.15

      mainGroup.rotation.x = currentRotX
      mainGroup.rotation.y = currentRotY + scrollRotationY
      mainGroup.scale.set(scrollScale, scrollScale, scrollScale)

      // Subtle floating sine wave motion
      mainGroup.position.y = Math.sin(t * 1.5) * 0.12

      // Node subtle floating & pulsing animation
      const updatedPositions = []
      nodes.forEach((node) => {
        const d = node.userData
        const floatY = d.baseY + Math.sin(t * 2 + d.phase) * 0.08
        const floatX = d.baseX + Math.cos(t * 1.8 + d.phase) * 0.05
        node.position.set(floatX, floatY, d.baseZ)

        // Pulsing glow scale
        const scale = 1 + Math.sin(t * 3 + d.phase) * 0.12
        node.scale.set(scale, scale, scale)

        updatedPositions.push(node.position.clone())
      })

      // Update line connections geometry
      const linePositions = lineGeo.attributes.position.array
      let idx = 0
      linePairs.forEach((pair) => {
        const p1 = updatedPositions[pair.i]
        const p2 = updatedPositions[pair.j]

        linePositions[idx++] = p1.x
        linePositions[idx++] = p1.y
        linePositions[idx++] = p1.z

        linePositions[idx++] = p2.x
        linePositions[idx++] = p2.y
        linePositions[idx++] = p2.z
      })
      lineGeo.attributes.position.needsUpdate = true

      // Dynamic line opacity pulsing
      lineMat.opacity = (0.25 + Math.sin(t * 2) * 0.12) * currentScrollRatio

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
        width: '100%',
        height: '340px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(229, 57, 53, 0.05) 0%, rgba(15, 23, 42, 0.02) 60%, transparent 80%)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
