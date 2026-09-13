import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function InteractiveMedicalScene() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let width = container.clientWidth || 920
    let height = container.clientHeight || 300

    // ── Scene, Camera, Renderer ──────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000)
    camera.position.set(0, 0, 8.2)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Main Group for Parallax & Inertia
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // ── 1. Soft Medical Studio Lighting ──────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    // Key Light (Warm Soft Studio Overhead)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
    keyLight.position.set(5, 8, 7)
    scene.add(keyLight)

    // Fill Light (Cool Slate Fill)
    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.8)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    // Rim Light (Subtle Pinkish Red Backlight)
    const rimLight = new THREE.DirectionalLight(0xfecdd3, 0.65)
    rimLight.position.set(0, 5, -6)
    scene.add(rimLight)

    // ── 2. Materials ────────────────────────────────────────────────
    // Medical Glossy Red (For Heart Icon / Cross Accent / Capsule Cap)
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.14,
      metalness: 0.15,
      emissive: 0x991b1b,
      emissiveIntensity: 0.1,
    })

    // Polished Chrome / Slate Metal
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.14,
      metalness: 0.86,
    })

    // Dark Slate OLED Display & Bezel
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.2,
    })

    // Satin White Ceramic Body
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.08,
    })

    // Clinical Off-White Monitor Casing
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.16,
      metalness: 0.06,
    })

    // Glowing Red ECG Waveform Line
    const ecgLineMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.95,
      roughness: 0.1,
    })

    // Micro Red Indicator LED Material
    const microRedMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.2,
      metalness: 0.2,
    })

    // Soft Contact Shadow Disc Texture
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 128
    shadowCanvas.height = 128
    const sCtx = shadowCanvas.getContext('2d')
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.25)')
    grad.addColorStop(0.45, 'rgba(15, 23, 42, 0.07)')
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)')
    sCtx.fillStyle = grad
    sCtx.fillRect(0, 0, 128, 128)
    const shadowTex = new THREE.CanvasTexture(shadowCanvas)
    const shadowGeo = new THREE.PlaneGeometry(1.5, 1.5)

    // ── 3. Centered Base Coordinates for 4 Objects ──────────────────
    const objectGroups = []
    const objectMeshes = []
    const shadowDiscs = []

    const basePositions = [
      { x: -3.6, y: 0, z: 0 }, // 1. Classic 3D Heart Icon (❤️)
      { x: -1.2, y: 0, z: 0 }, // 2. Medical Cross (✚)
      { x: 1.2, y: 0, z: 0 },  // 3. Capsule (💊)
      { x: 3.6, y: 0, z: 0 },  // 4. ECG Monitor (📟)
    ]

    // ── OBJECT 1: ❤️ PREMIUM CLASSIC 3D HEART ICON (x = -3.6) ───────────
    const heartGroup = new THREE.Group()
    heartGroup.position.set(basePositions[0].x, basePositions[0].y, basePositions[0].z)

    // Classic Symmetrical Heart Silhouette (❤️)
    const heartShape = new THREE.Shape()
    const hx = 0, hy = 0.1
    heartShape.moveTo(hx, hy + 0.25) // Center top indentation
    heartShape.bezierCurveTo(hx, hy + 0.52, hx - 0.52, hy + 0.52, hx - 0.52, hy + 0.25) // Upper left lobe
    heartShape.bezierCurveTo(hx - 0.52, hy - 0.02, hx, hy - 0.36, hx, hy - 0.58) // Left curve to bottom tip
    heartShape.bezierCurveTo(hx, hy - 0.36, hx + 0.52, hy - 0.02, hx + 0.52, hy + 0.25) // Right curve down from tip
    heartShape.bezierCurveTo(hx + 0.52, hy + 0.52, hx, hy + 0.52, hx, hy + 0.25) // Upper right lobe to top center

    const heartExtrude = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    })
    heartExtrude.center()
    const heartMesh = new THREE.Mesh(heartExtrude, redMat)
    heartGroup.add(heartMesh)

    heartGroup.scale.set(0.85, 0.85, 0.85)

    mainGroup.add(heartGroup)
    objectGroups.push(heartGroup)
    objectMeshes.push(heartMesh)

    // ── OBJECT 2: ➕ Premium 3D Medical Cross (x = -1.2) ───────────────
    const crossGroup = new THREE.Group()
    crossGroup.position.set(basePositions[1].x, basePositions[1].y, basePositions[1].z)

    // Outer White Satin Body
    const cw = 0.26, ch = 0.8
    const crossShape = new THREE.Shape()
    crossShape.moveTo(-cw, ch)
    crossShape.lineTo(cw, ch)
    crossShape.lineTo(cw, cw)
    crossShape.lineTo(ch, cw)
    crossShape.lineTo(ch, -cw)
    crossShape.lineTo(cw, -cw)
    crossShape.lineTo(cw, -ch)
    crossShape.lineTo(-cw, -ch)
    crossShape.lineTo(-cw, -cw)
    crossShape.lineTo(-ch, -cw)
    crossShape.lineTo(-ch, cw)
    crossShape.lineTo(-cw, cw)
    crossShape.closePath()

    const crossGeo = new THREE.ExtrudeGeometry(crossShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    })
    crossGeo.center()
    const outerCrossMesh = new THREE.Mesh(crossGeo, whiteMat)
    crossGroup.add(outerCrossMesh)

    // Inner Red Inset Emblem Face
    const ciw = 0.18, cih = 0.64
    const insetShape = new THREE.Shape()
    insetShape.moveTo(-ciw, cih)
    insetShape.lineTo(ciw, cih)
    insetShape.lineTo(ciw, ciw)
    insetShape.lineTo(cih, ciw)
    insetShape.lineTo(cih, -ciw)
    insetShape.lineTo(ciw, -ciw)
    insetShape.lineTo(ciw, -cih)
    insetShape.lineTo(-ciw, -cih)
    insetShape.lineTo(-ciw, -ciw)
    insetShape.lineTo(-cih, -ciw)
    insetShape.lineTo(-cih, ciw)
    insetShape.lineTo(-ciw, ciw)
    insetShape.closePath()

    const insetGeo = new THREE.ExtrudeGeometry(insetShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    })
    insetGeo.center()
    const insetFront = new THREE.Mesh(insetGeo, redMat)
    insetFront.position.z = 0.125
    crossGroup.add(insetFront)

    crossGroup.scale.set(0.78, 0.78, 0.78)

    mainGroup.add(crossGroup)
    objectGroups.push(crossGroup)
    objectMeshes.push(outerCrossMesh)

    // ── OBJECT 3: 💊 3D Pharmaceutical Capsule (x = 1.2) ───────────────
    const capGroup = new THREE.Group()
    capGroup.position.set(basePositions[2].x, basePositions[2].y, basePositions[2].z)
    capGroup.rotation.z = Math.PI * 0.22

    // Top Red Half
    const capTopDome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), redMat)
    capTopDome.position.y = 0.32
    capGroup.add(capTopDome)

    const capTopCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.32, 32, 1, true), redMat)
    capTopCyl.position.y = 0.16
    capGroup.add(capTopCyl)

    // Bottom White Half
    const capBotDome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), whiteMat)
    capBotDome.position.y = -0.32
    capGroup.add(capBotDome)

    const capBotCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.32, 32, 1, true), whiteMat)
    capBotCyl.position.y = -0.16
    capGroup.add(capBotCyl)

    // Interlocking Ridge Seam
    const seamMesh = new THREE.Mesh(new THREE.TorusGeometry(0.345, 0.018, 16, 32), metalMat)
    seamMesh.rotation.x = Math.PI / 2
    capGroup.add(seamMesh)

    capGroup.scale.set(0.88, 0.88, 0.88)

    mainGroup.add(capGroup)
    objectGroups.push(capGroup)
    objectMeshes.push(capTopCyl)

    // ── OBJECT 4: 📟 3D ECG Patient Monitor Device (x = 3.6) ───────────
    const monitorGroup = new THREE.Group()
    monitorGroup.position.set(basePositions[3].x, basePositions[3].y, basePositions[3].z)

    // Enclosure
    const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.88, 0.24), casingMat)
    monitorGroup.add(caseMesh)

    // Dark Recessed Display Screen Bezel
    const screenMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 0.04), darkMat)
    screenMesh.position.z = 0.11
    monitorGroup.add(screenMesh)

    // Glowing ECG Waveform Line
    const ecgPoints = [
      new THREE.Vector3(-0.48, 0, 0.14),
      new THREE.Vector3(-0.32, 0, 0.14),
      new THREE.Vector3(-0.26, 0.07, 0.14),  // P wave
      new THREE.Vector3(-0.21, 0, 0.14),
      new THREE.Vector3(-0.16, -0.12, 0.14), // Q dip
      new THREE.Vector3(-0.08, 0.25, 0.14),  // R peak
      new THREE.Vector3(-0.02, -0.18, 0.14), // S dip
      new THREE.Vector3(0.04, 0, 0.14),
      new THREE.Vector3(0.14, 0.11, 0.14),   // T wave
      new THREE.Vector3(0.24, 0, 0.14),
      new THREE.Vector3(0.48, 0, 0.14),
    ]
    const ecgCurve = new THREE.CatmullRomCurve3(ecgPoints)
    const ecgMesh = new THREE.Mesh(new THREE.TubeGeometry(ecgCurve, 64, 0.022, 8, false), ecgLineMat)
    monitorGroup.add(ecgMesh)

    // Status LED & Physical Buttons
    const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), microRedMat)
    ledMesh.position.set(0.45, 0.29, 0.14)
    monitorGroup.add(ledMesh)

    const btn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16), metalMat)
    btn1.position.set(0.45, 0.1, 0.14)
    btn1.rotation.x = Math.PI / 2
    monitorGroup.add(btn1)

    const btn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16), metalMat)
    btn2.position.set(0.45, -0.06, 0.14)
    btn2.rotation.x = Math.PI / 2
    monitorGroup.add(btn2)

    monitorGroup.scale.set(0.85, 0.85, 0.85)

    mainGroup.add(monitorGroup)
    objectGroups.push(monitorGroup)
    objectMeshes.push(caseMesh)

    // ── Soft Contact Shadow Discs Below Each Object ────────────────────
    basePositions.forEach((pos) => {
      const sMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      })
      const shadowMesh = new THREE.Mesh(shadowGeo, sMat)
      shadowMesh.rotation.x = -Math.PI / 2
      shadowMesh.position.set(pos.x, -1.25, pos.z)
      mainGroup.add(shadowMesh)
      shadowDiscs.push(shadowMesh)
    })

    // ── 4. Mouse Parallax & Raycasting Hover Physics ─────────────────
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0

    let targetScrollRatio = 0
    let currentScrollRatio = 0

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

      targetRotY = mouseX * 0.14
      targetRotX = mouseY * 0.11
    }

    const handleMouseLeave = () => {
      targetRotX = 0
      targetRotY = 0
      mouseVec.set(-999, -999)
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

    // ── 5. Responsive Resize Handler ───────────────────────────────
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)

      if (width < 640) {
        mainGroup.scale.set(0.65, 0.65, 0.65)
      } else if (width < 960) {
        mainGroup.scale.set(0.82, 0.82, 0.82)
      } else {
        mainGroup.scale.set(1.0, 1.0, 1.0)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // ── 6. Render Animation Loop ───────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Cursor Parallax Lerping
      currentRotX += (targetRotX - currentRotX) * 0.045
      currentRotY += (targetRotY - currentRotY) * 0.045
      mainGroup.rotation.x = currentRotX
      mainGroup.rotation.y = currentRotY

      // Scroll Viewport Entry Scale
      currentScrollRatio += (targetScrollRatio - currentScrollRatio) * 0.05
      const scrollScale = 0.92 + currentScrollRatio * 0.08
      const responsiveFactor = width < 640 ? 0.65 : (width < 960 ? 0.82 : 1.0)
      mainGroup.scale.set(scrollScale * responsiveFactor, scrollScale * responsiveFactor, scrollScale * responsiveFactor)

      // Classic Heart Icon pulse animation (Subtle rhythmic pulse)
      const cardiacPulse = 1.0 + (Math.sin(t * 3.2) > 0 ? Math.sin(t * 3.2) ** 3 * 0.04 : 0)

      // Independent Organic Floating Physics & Rotations
      objectGroups.forEach((grp, idx) => {
        const base = basePositions[idx]
        const shadow = shadowDiscs[idx]
        const floatY = Math.sin(t * 1.3 + idx * 1.2) * 0.075

        grp.position.y = base.y + floatY

        // Unique Rotation Motion per object
        if (idx === 0) {
          grp.scale.set(0.85 * cardiacPulse, 0.85 * cardiacPulse, 0.85 * cardiacPulse)
          grp.rotation.y = Math.sin(t * 0.5) * 0.14 // Heart icon gentle sway
        } else if (idx === 1) grp.rotation.z = Math.sin(t * 0.6) * 0.08 // Cross tilt
        else if (idx === 2) grp.rotation.y = t * 0.22 // Capsule slow spin
        else if (idx === 3) grp.rotation.y = Math.sin(t * 0.7) * 0.1 // Monitor tilt

        // Contact shadow disc scale & opacity response
        if (shadow) {
          const sScale = Math.max(0.75, 1.0 - floatY * 0.5)
          shadow.scale.set(sScale, sScale, sScale)
          shadow.material.opacity = Math.max(0.08, 0.22 - floatY * 0.1)
        }
      })

      // Raycasting Hover Scale Physics
      raycaster.setFromCamera(mouseVec, camera)
      const intersects = raycaster.intersectObjects(objectMeshes)

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object
        container.style.cursor = 'pointer'

        objectGroups.forEach((grp, i) => {
          const m = objectMeshes[i]
          const isHit = m === hitMesh
          const baseS = i === 0 ? 0.85 * cardiacPulse : (i === 1 ? 0.78 : 0.85)
          const targetS = isHit ? baseS * 1.22 : baseS
          grp.scale.set(targetS, targetS, targetS)
        })
      } else {
        container.style.cursor = 'default'
        objectGroups.forEach((grp, i) => {
          const baseS = i === 0 ? 0.85 * cardiacPulse : (i === 1 ? 0.78 : 0.85)
          grp.scale.set(baseS, baseS, baseS)
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // ── 7. Cleanup & Resource Disposal ─────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      redMat.dispose()
      metalMat.dispose()
      darkMat.dispose()
      whiteMat.dispose()
      casingMat.dispose()
      ecgLineMat.dispose()
      microRedMat.dispose()
      shadowTex.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '270px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.03) 0%, rgba(248, 250, 252, 0) 75%)',
        borderRadius: 'var(--radius-md)',
        userSelect: 'none',
        overflow: 'hidden',
        marginTop: '0.75rem',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
