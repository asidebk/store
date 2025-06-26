import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { Color, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

export default function Shirt() {
  const { scene, materials } = useGLTF('/models/Shirt.glb')
  const shirtRef = useRef()
  const { camera } = useThree()

  // Load fabric textures
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

  // Apply color/material/texture
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

  // Animate shirt (slow rotation)
  useFrame((_, delta) => {
    if (shirtRef.current) {
      shirtRef.current.rotation.y += delta * 0.3
    }
  })

  // Camera transition on click
  const handleClick = () => {
    camera.position.set(0, 0, 0)
    camera.lookAt(0, 0, 0)
  }

  return (
    <primitive
      ref={shirtRef}
      object={scene}
      scale={[3, 3, 3]}
      position={[0, -0.5, 0]}
      onClick={handleClick}
      dispose={null}
    />
  )
}

useGLTF.preload('/models/Shirt.glb')
