import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Color, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

export default function Shirt() {
  const { scene, materials } = useGLTF('/models/Shirt.glb')
  const shirtRef = useRef()
  const { camera, viewport } = useThree()

  const isMobile = window.innerWidth < 768 // Tailwind/Bootstrap mobile breakpoint

  // Dynamic model position/scale based on screen size
  const modelPosition = isMobile ? [0, -1.2, 0] : [0, -0.5, 0]
  const modelScale = isMobile ? [2.5, 2.5, 2.5] : [3, 3, 3]

  // Load textures
  const fabrics = {
    Cotton: useLoader(TextureLoader, '/textures/1.jpg'),
    Leather: useLoader(TextureLoader, '/textures/2.jpg'),
    Carbon: useLoader(TextureLoader, '/textures/3.jpg'),
    Native: useLoader(TextureLoader, '/textures/4.jpg'),
  }

  const { shirtColor, fabricType, roughness, metalness } = useControls('Shirt Customizer', {
    shirtColor: '#ff0000',
    fabricType: { options: ['Cotton', 'Leather', 'Carbon', 'Native'] },
    roughness: { value: 0.8, min: 0, max: 1 },
    metalness: { value: 0.2, min: 0, max: 1 },
  })

  const color = useMemo(() => new Color(shirtColor), [shirtColor])

  useEffect(() => {
    Object.values(materials).forEach((mat) => {
      if (mat.isMeshStandardMaterial) {
        mat.color.set(color)
        mat.roughness = roughness
        mat.metalness = metalness
        mat.map = fabrics[fabricType]
        mat.map.repeat.set(2, 2)
        mat.map.wrapS = mat.map.wrapT = 1000 // RepeatWrapping
        mat.needsUpdate = true
      }
    })
  }, [color, roughness, metalness, fabricType, materials, fabrics])

  useFrame((_, delta) => {
    if (shirtRef.current) {
      shirtRef.current.rotation.y += delta * 0.3
    }
  })

  const handleClick = () => {
    camera.position.set(0, 0, 0)
    camera.lookAt(0, 0, 0)
  }

  return (
    <primitive
      ref={shirtRef}
      object={scene}
      scale={modelScale}
      position={modelPosition}
      onClick={handleClick}
      dispose={null}
    />
  )
}

useGLTF.preload('/models/Shirt.glb')
