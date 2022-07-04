import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import './PythagorasQuantized.css'
import { /* useHelper, */ OrbitControls } from '@react-three/drei'
import TheJewel from './TheJewel'

const Plane = () => (
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -0.5, 0]}
    receiveShadow
  >
    <planeBufferGeometry args={[500, 500]} />
    <meshPhysicalMaterial color="white" />
  </mesh>
)

const QuantumBlock = (props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const meshRef = useRef()
  const springProps = useSpring({
    scale: isActive ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: isHovered ? 'hotpink' : 'gray',
  })

  return (
    <animated.mesh
      {...props}
      ref={meshRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => setIsActive(!isActive)}
      scale={springProps.scale}
      castShadow
    >
      <boxBufferGeometry
        args={[1, 1, 1]}
      />
   
      <animated.meshMatcapMaterial
        color={springProps.color}
      />
    </animated.mesh>
  )
}

const SceneLights = () => {
  const spotLightRef = useRef()
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red')
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[-4, 7, -4]} intensity={5.5} penumbra={1} castShadow ref={spotLightRef} />
      <hemisphereLight args={[0xffffff, 0x080820, 1]} />
    </>
  )
}

const PythagorasQuantized3d = ({
  hypotenuseLength,
  isBluntCorners,
  isDiagonalHypotenuse,
}) => {

  return (
    <Canvas
      className="Pythagoras-container-3d"
      shadows
    >
      <fog attach="fog" args={['white', 50, 120]} />    
      <SceneLights />
      <TheJewel />
      <OrbitControls
        autoRotate
        maxPolarAngle={Math.PI / 2.25}
        // minPolarAngle={Math.PI / 3}
        enableDamping
        dampingFactor = {0.1}
        enablePan={true}
       />
      <QuantumBlock position={[1, 0, 0]}  />
      <QuantumBlock position={[2, 0, 0]}  />
      <QuantumBlock position={[3, 0, 0]}  />
      <QuantumBlock position={[0, 0, 1]}  />
      <QuantumBlock position={[0, 0, 2]}  />
      <QuantumBlock position={[0, 0, 3]}  />
      <Plane />
    </Canvas>
  )
}

export default PythagorasQuantized3d
