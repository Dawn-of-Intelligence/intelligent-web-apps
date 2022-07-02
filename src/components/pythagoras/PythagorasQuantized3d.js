import React, { useState, useRef } from 'react'
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import './PythagorasQuantized.css'

extend({ OrbitControls });

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()
  useFrame(() => {
    orbitRef.current.update()
  })
  return (<orbitControls 
    autoRotate
    // maxPolarAngle={Math.PI / 3}
    // minPolarAngle={Math.PI / 3}
    args={[camera, gl.domElement]}
    ref={orbitRef} />
  )
};

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry args={[500, 500]} />
    <meshPhysicalMaterial color="white" />
  </mesh>
)

const Jewel = (props) => {
  const { nodes, materials } = useLoader(GLTFLoader, "/models/emerald.glb")
  return (
    <group {...props} dispose={null}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={nodes.emerald_mesh.geometry}
        material={materials.Jewel1}
        castShadow
      />
    </group>
  )
}

const OriginBit = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const meshRef = useRef()
  const springProps = useSpring({
    scale: isActive ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: isHovered ? 'hotpink' : 'gray',
  })

  return (
    <animated.mesh
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
      <animated.meshPhysicalMaterial
        color={springProps.color}
        attach="material"
      />
    </animated.mesh>
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
      onCreated={({gl}) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
    }}>
      <fog attach="fog" args={['white', 50, 120]} />
      <spotLight position={[1, 2, 1]} penumbra={1} castShadow />

      <spotLight position={[0.5, 8, 0]} />
      <spotLight position={[-1, 1, 1]}  />
      <spotLight position={[0.3, 1, -0.5]} />
      <spotLight position={[-0.5, 2, 0.7]} />
      <spotLight position={[1, 5, 1]} />
      <spotLight position={[1, 9, -1]} />

      <hemisphereLight args={[0xffffff, 0x080820, 1]} />

      <ambientLight intensity={0.5} />
      <Controls />
      {/*<OriginBit />*/}
      <Jewel />
      <Plane />
    </Canvas>
  )
}

export default PythagorasQuantized3d
