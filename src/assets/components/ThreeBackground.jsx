import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    // Particles
    const count = 1200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 20
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    group.add(particles)

    // Torus knot
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 160, 24)
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.6,
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    knot.position.set(3.2, 1.2, -2)
    knot.scale.set(0, 0, 0)
    group.add(knot)

    // Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(0.9, 1)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(-3.4, -1.4, -1.5)
    sphere.scale.set(0, 0, 0)
    group.add(sphere)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const point = new THREE.PointLight(0xffffff, 1.2)
    point.position.set(5, 5, 5)
    scene.add(point)

    // GSAP intro
    gsap.to(knot.scale, { x: 1, y: 1, z: 1, duration: 2, ease: 'elastic.out(1, 0.5)' })
    gsap.to(sphere.scale, { x: 1, y: 1, z: 1, duration: 2, delay: 0.3, ease: 'elastic.out(1, 0.5)' })
    gsap.to(knot.position, { y: 1.6, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to(sphere.position, { y: -1.8, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })

    // Mouse parallax with GSAP
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(group.rotation, { x: y * 0.25, y: x * 0.25, duration: 1.2, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let frameId
    const animate = () => {
      knot.rotation.x += 0.004
      knot.rotation.y += 0.006
      sphere.rotation.x -= 0.003
      sphere.rotation.y += 0.005
      particles.rotation.y += 0.0008
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf([knot.scale, sphere.scale, knot.position, sphere.position, group.rotation])
      particleGeo.dispose(); particleMat.dispose()
      knotGeo.dispose(); knotMat.dispose()
      sphereGeo.dispose(); sphereMat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />
}

export default ThreeBackground