import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PALETTE = [0x800000, 0xFFF8F0, 0xD4A5A5, 0xF4C2C2, 0xA30000, 0xFFE4E1]
const COUNT   = 220

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const camTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.z = 8

    const positions  = new Float32Array(COUNT * 3)
    const colors     = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)
    const phases     = new Float32Array(COUNT)
    const sizes      = new Float32Array(COUNT)

    const tmp = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * 24
      positions[i3 + 1] = (Math.random() - 0.5) * 18
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      velocities[i3]     = (Math.random() - 0.5) * 0.005
      velocities[i3 + 1] = Math.random() * 0.007 + 0.002   // upward drift
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.003

      phases[i] = Math.random() * Math.PI * 2
      sizes[i]  = Math.random() * 0.1 + 0.03

      tmp.set(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      colors[i3]     = tmp.r
      colors[i3 + 1] = tmp.g
      colors[i3 + 2] = tmp.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

    const mat = new THREE.PointsMaterial({
      size:            0.1,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.72,
      sizeAttenuation: true,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Secondary smaller layer for depth
    const geo2 = new THREE.BufferGeometry()
    const pos2 = new Float32Array(80 * 3)
    const col2 = new Float32Array(80 * 3)
    for (let i = 0; i < 80; i++) {
      const i3 = i * 3
      pos2[i3]     = (Math.random() - 0.5) * 30
      pos2[i3 + 1] = (Math.random() - 0.5) * 22
      pos2[i3 + 2] = (Math.random() - 0.5) * 5 - 5  // behind main layer
      tmp.set(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      col2[i3] = tmp.r; col2[i3+1] = tmp.g; col2[i3+2] = tmp.b
    }
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3))
    geo2.setAttribute('color',    new THREE.BufferAttribute(col2, 3))
    const mat2 = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.35, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false })
    scene.add(new THREE.Points(geo2, mat2))

    const onMouse  = (e) => { mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2 }
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight) }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('resize',   onResize)

    const clock  = new THREE.Clock()
    const posAttr = points.geometry.attributes.position

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3
        posAttr.array[i3]     += velocities[i3]     + Math.sin(t * 0.4 + phases[i]) * 0.0018
        posAttr.array[i3 + 1] += velocities[i3 + 1]
        posAttr.array[i3 + 2] += velocities[i3 + 2]
        if (posAttr.array[i3 + 1] > 9) {
          posAttr.array[i3 + 1] = -9
          posAttr.array[i3]     = (Math.random() - 0.5) * 24
        }
      }
      posAttr.needsUpdate = true

      // Smooth parallax
      camTarget.current.x += (mouseRef.current.x * 0.45 - camTarget.current.x) * 0.022
      camTarget.current.y += (mouseRef.current.y * 0.45 - camTarget.current.y) * 0.022
      camera.position.x = camTarget.current.x
      camera.position.y = camTarget.current.y
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize',   onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      renderer.dispose(); geo.dispose(); mat.dispose(); geo2.dispose(); mat2.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.95 }}
    />
  )
}
