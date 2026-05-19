import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function FloatingEnvelope() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const mouseRef  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.clientWidth  || 480
    const H = canvas.clientHeight || 460

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0.2, 4.5)

    // ── Envelope group ────────────────────────────────────────────────
    const group = new THREE.Group()

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.6, 0.06)
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0xFFF8F0, emissive: 0xC8A4D4, emissiveIntensity: 0.04,
      transparent: true, opacity: 0.97,
    })
    group.add(new THREE.Mesh(bodyGeo, bodyMat))

    // Helper to make a triangle flap
    const makeFlapMesh = (pts, z, color, opacity = 0.88) => {
      const shape = new THREE.Shape()
      shape.moveTo(...pts[0])
      pts.slice(1).forEach(p => shape.lineTo(...p))
      shape.closePath()
      const geo = new THREE.ShapeGeometry(shape)
      const mat = new THREE.MeshPhongMaterial({
        color, transparent: true, opacity, side: THREE.DoubleSide,
        emissive: color, emissiveIntensity: 0.08,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.z = z
      return mesh
    }

    // Top flap (slightly open)
    const topFlap = makeFlapMesh([[-1.2, 0], [1.2, 0], [0, 0.78]], 0.04, 0xD4A5A5)
    topFlap.position.y = 0.8
    group.add(topFlap)

    // Bottom flap
    group.add(makeFlapMesh([[-1.2, 0], [1.2, 0], [0, -0.55]], 0.04, 0xF4C2C2, 0.82))
    // Left flap
    group.add(makeFlapMesh([[-1.2, 0.8], [-1.2, -0.8], [0, 0]], 0.035, 0xEDD8D8, 0.8))
    // Right flap
    group.add(makeFlapMesh([[1.2, 0.8], [1.2, -0.8], [0, 0]], 0.035, 0xEDD8D8, 0.8))

    // Wax seal
    const sealGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 32)
    const sealMat = new THREE.MeshPhongMaterial({
      color: 0x2D6A4F, emissive: 0x2D6A4F, emissiveIntensity: 0.35,
    })
    const seal = new THREE.Mesh(sealGeo, sealMat)
    seal.rotation.x = Math.PI / 2
    seal.position.set(0, 0.5, 0.06)
    group.add(seal)

    // Subtle line details on envelope body
    const lineMat = new THREE.LineBasicMaterial({ color: 0xC8A4D4, transparent: true, opacity: 0.3 })
    const addLine = (pts) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)))
      group.add(new THREE.Line(g, lineMat))
    }
    addLine([[-1.2, 0.8, 0.04], [0, 0.08, 0.04], [1.2, 0.8, 0.04]])
    addLine([[-1.2, -0.8, 0.04], [0, -0.07, 0.04], [1.2, -0.8, 0.04]])

    scene.add(group)

    // ── Lighting ──────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const key = new THREE.PointLight(0xC8A4D4, 1.8, 20)
    key.position.set(3, 4, 5)
    scene.add(key)

    const fill = new THREE.PointLight(0xF4C2C2, 0.6, 15)
    fill.position.set(-3, -2, 4)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xffffff, 0.3)
    rim.position.set(0, -3, -2)
    scene.add(rim)

    // ── Mouse ─────────────────────────────────────────────────────────
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      mouseRef.current.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      const nW = canvas.clientWidth
      const nH = canvas.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ───────────────────────────────────────────────────────
    const clock = new THREE.Clock()

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      group.rotation.y = Math.sin(t * 0.35) * 0.22 + mouseRef.current.x * 0.08
      group.rotation.x = Math.sin(t * 0.28) * 0.08 + mouseRef.current.y * 0.04
      group.position.y = Math.sin(t * 0.45) * 0.12

      // Flap subtle breathe
      topFlap.rotation.x = Math.sin(t * 0.6) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize',   onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', minHeight: '380px', display: 'block' }}
    />
  )
}
