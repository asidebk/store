import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { Color, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { animated, useSpring } from '@react-spring/three'

export default function Shirt({ active }) {
  const { scene, materials } = useGLTF('/models/Shirt.glb')
  const shirtRef = useRef()
  const { camera, size } = useThree()

  const isMobile = size.width < 768
  const basePos = isMobile ? [0, -1.2, 0] : [0, -0.5, 0]

  // Animate position from offscreen to center when "Customize" is clicked
  const { position } = useSpring({
    position: active ? [0, 0, 0] : basePos,
    config: { tension: 120, friction: 14 },
  })

  const scale = isMobile ? [2.5, 2.5, 2.5] : [3, 3, 3]

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
        mat.map.wrapS = mat.map.wrapT = 1000
        mat.needsUpdate = true
      }
    })
  }, [color, roughness, metalness, fabricType, materials, fabrics])

  useFrame((_, delta) => {
    if (shirtRef.current) {
      shirtRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <animated.primitive
      ref={shirtRef}
      object={scene}
      scale={scale}
      position={position}
      dispose={null}
    />
  )
}

useGLTF.preload('/models/Shirt.glb')
