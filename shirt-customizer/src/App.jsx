import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'

// Lazy load the Shirt component
const Shirt = React.lazy(() => import('./components/Shirt'))

// Optional: Lazy load a second component if needed
// const MyLazyComponent = React.lazy(() => import('./MyLazyComponent'))

export default function App() {
  const [customize, setCustomize] = useState(false)

  const handleCustomize = () => {
    setCustomize(true)
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {!customize && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            zIndex: 10,
            color: '#fff',
          }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Design Your Custom Shirt
          </h1>
          <p
            style={{
              maxWidth: '400px',
              fontSize: '1.2rem',
              marginBottom: '2rem',
            }}
          >
            Choose from different fabrics, colors, and styles to make your
            perfect shirt.
          </p>
          <button
            onClick={handleCustomize}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Customize
          </button>
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="studio" />
        <OrbitControls enableZoom={false} />

        <Suspense fallback={null}>
          <Shirt active={customize} />
          {/* <MyLazyComponent /> ← You can add this here if needed */}
        </Suspense>
      </Canvas>
    </div>
  )
}
 
