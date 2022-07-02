import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import './PythagorasQuantized.css'
import { useHelper } from '@react-three/drei'

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
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -0.5, 0]}
    receiveShadow
  >
    <planeBufferGeometry args={[500, 500]} />
    <meshPhysicalMaterial color="white" />
  </mesh>
)

const JewelEmerald = ({position, rotation}) => {
  const { nodes, materials } = useLoader(GLTFLoader, "/models/emerald.glb")
  return (
    <mesh
      rotation={rotation}
      scale={[1, 1, 1]}
      position={position}
      geometry={nodes.emerald_mesh.geometry}
      material={materials.Jewel1}
    />
  )
}

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

const TheJewel = () => {

  // I had a memoize generic 3D Spotlight objects in order to set a spotlight target.
  const lightMemo1 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo2 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo3 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo4 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo5 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo6 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo7 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo8 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo9 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo10 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo11 = useMemo(() => new THREE.SpotLight(0xffffff), [])
  const lightMemo12 = useMemo(() => new THREE.SpotLight(0xffffff), [])

  const spotLightRef1 = useRef()
  const spotLightRef2 = useRef()
  const spotLightRef3 = useRef()
  const spotLightRef4 = useRef()
  const spotLightRef5 = useRef()
  const spotLightRef6 = useRef()
  const spotLightRef7 = useRef()
  const spotLightRef8 = useRef()
  const spotLightRef9 = useRef()
  const spotLightRef10 = useRef()
  const spotLightRef11 = useRef()
  const spotLightRef12 = useRef()
  
  /* 
  useHelper(spotLightRef1, THREE.SpotLightHelper, 'teal')
  useHelper(spotLightRef2, THREE.SpotLightHelper, 'red')
  useHelper(spotLightRef3, THREE.SpotLightHelper, 'orange')
  useHelper(spotLightRef4, THREE.SpotLightHelper, 'blue')
  useHelper(spotLightRef5, THREE.SpotLightHelper, 'black')
  useHelper(spotLightRef6, THREE.SpotLightHelper, 'purple')
  useHelper(spotLightRef7, THREE.SpotLightHelper, 'violet')
  useHelper(spotLightRef8, THREE.SpotLightHelper, 'yellow')
  useHelper(spotLightRef9, THREE.SpotLightHelper, 'brown')
  useHelper(spotLightRef10, THREE.SpotLightHelper, 'gray')
  useHelper(spotLightRef11, THREE.SpotLightHelper, 'green')
  useHelper(spotLightRef12, THREE.SpotLightHelper, 'red')
 */
  const lightTargetPosition = [0, -1, 0] 
  const lightTargetPosition2 = [0, -0.2, 0] 
  const intensity = 500

  return (
    <>
      <group position={[0, 1, 0]} dispose={null}>

        <primitive object={lightMemo1} position={[0.3, 0.18, 0.9]} distance={1.2} decay={0.5} intensity={intensity} angle={0.3} ref={spotLightRef1} />
        <primitive object={lightMemo1.target} position={lightTargetPosition}  />

        <primitive object={lightMemo2} position={[-0.8, 0.6, -0.3]} distance={1.5} decay={0.5} intensity={intensity} angle={0.4} ref={spotLightRef2} />
        <primitive object={lightMemo2.target} position={lightTargetPosition}  />

        <primitive object={lightMemo3} position={[-0.6, 0.2, -0.8]} distance={1.4} decay={0.5} intensity={intensity} angle={0.4} ref={spotLightRef3} />
        <primitive object={lightMemo3.target} position={lightTargetPosition}  />

        <primitive object={lightMemo4} position={[-0.5, 0.8, 0.7]} distance={1.5} decay={0.5} intensity={intensity} angle={0.4} ref={spotLightRef4} />
        <primitive object={lightMemo4.target} position={lightTargetPosition}  />

        <primitive object={lightMemo5} position={[0.4, 0.9, 0.4]} distance={1.7} decay={0.5} intensity={intensity} angle={0.2} ref={spotLightRef5} />
        <primitive object={lightMemo5.target} position={lightTargetPosition}  />

        <primitive object={lightMemo6} position={[0.2, 3, -0.2]} distance={3.5} decay={0.5} intensity={intensity} angle={0.1} ref={spotLightRef6} />
        <primitive object={lightMemo6.target} position={lightTargetPosition}  />

        <primitive object={lightMemo7} position={[0.9, 1.1, -0.5]} distance={2.0} decay={0.5} intensity={intensity} angle={0.26} ref={spotLightRef7} />
        <primitive object={lightMemo7.target} position={lightTargetPosition}  />

        <primitive object={lightMemo8} position={[0.2, 0.5, -1.1]} distance={1.3} decay={0.5} intensity={intensity} angle={0.3} ref={spotLightRef8} />
        <primitive object={lightMemo8.target} position={lightTargetPosition}  />

        <primitive object={lightMemo9} position={[0.2, -0.6, -1.1]} distance={1.3} decay={0.5} intensity={intensity} angle={0.5} ref={spotLightRef9} />
        <primitive object={lightMemo9.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo10} position={[0, -0.7, 1]} distance={1.4} decay={0.5} intensity={intensity} angle={0.5} ref={spotLightRef10} />
        <primitive object={lightMemo10.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo11} position={[-1.2, -0.7, 0]} distance={1.3} decay={0.5} intensity={intensity} angle={0.5} ref={spotLightRef11} />
        <primitive object={lightMemo11.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo12} position={[1.2, -0.7, 0]} distance={1.3} decay={0.5} intensity={intensity} angle={0.5} ref={spotLightRef12} />
        <primitive object={lightMemo12.target} position={lightTargetPosition2}  />

        <JewelEmerald position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}/>
      </group>
    </>
  )
}

const SceneLights = () => {
  const spotLightRef = useRef()
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red')

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[-4, 7, -4]} intensity={0.5} penumbra={1} castShadow ref={spotLightRef} />
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
      onCreated={({gl}) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
    }}>
      <fog attach="fog" args={['white', 50, 120]} />    
      <SceneLights />
      <TheJewel />
      <Controls />
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
