import React, { useState, useRef, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
// import { useSpring, animated } from '@react-spring/three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import { /* useHelper, */ useCursor, Edges } from '@react-three/drei'

const TheJewel = () => {

  const { nodes, materials } = useLoader(GLTFLoader, "/models/emerald.glb")
  const [isHovered, setIsHovered] = useState(false)

  useCursor(isHovered, 'pointer')

  const spotlightColor = isHovered ? 0xffffff : 0xffffff

  // I had a memoize generic 3D Spotlight objects in order to set a spotlight target.
  const lightMemo1 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo2 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo3 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo4 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo5 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo6 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo7 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo8 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo9 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo10 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo11 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])
  const lightMemo12 = useMemo(() => new THREE.SpotLight(spotlightColor), [spotlightColor])

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
  const decay = isHovered ? 0.5 : 1

  return (
    <>
      <group position={[0, 1, 0]} dispose={null}>

        <primitive object={lightMemo1} position={[0.3, 0.18, 0.9]} distance={1.2} decay={decay} intensity={intensity} angle={0.3} ref={spotLightRef1} />
        <primitive object={lightMemo1.target} position={lightTargetPosition}  />

        <primitive object={lightMemo2} position={[-0.8, 0.6, -0.3]} distance={1.5} decay={decay} intensity={intensity} angle={0.4} ref={spotLightRef2} />
        <primitive object={lightMemo2.target} position={lightTargetPosition}  />

        <primitive object={lightMemo3} position={[-0.6, 0.2, -0.8]} distance={1.4} decay={decay} intensity={intensity} angle={0.4} ref={spotLightRef3} />
        <primitive object={lightMemo3.target} position={lightTargetPosition}  />

        <primitive object={lightMemo4} position={[-0.5, 0.8, 0.7]} distance={1.5} decay={decay} intensity={intensity} angle={0.4} ref={spotLightRef4} />
        <primitive object={lightMemo4.target} position={lightTargetPosition}  />

        <primitive object={lightMemo5} position={[0.4, 0.9, 0.4]} distance={1.7} decay={decay} intensity={intensity} angle={0.2} ref={spotLightRef5} />
        <primitive object={lightMemo5.target} position={lightTargetPosition}  />

        <primitive object={lightMemo6} position={[0.2, 3, -0.2]} distance={3.5} decay={decay} intensity={intensity} angle={0.1} ref={spotLightRef6} />
        <primitive object={lightMemo6.target} position={lightTargetPosition}  />

        <primitive object={lightMemo7} position={[0.9, 1.1, -0.5]} distance={2.0} decay={decay} intensity={intensity} angle={0.26} ref={spotLightRef7} />
        <primitive object={lightMemo7.target} position={lightTargetPosition}  />

        <primitive object={lightMemo8} position={[0.2, 0.5, -1.1]} distance={1.3} decay={decay} intensity={intensity} angle={0.3} ref={spotLightRef8} />
        <primitive object={lightMemo8.target} position={lightTargetPosition}  />

        <primitive object={lightMemo9} position={[0.2, -0.6, -1.1]} distance={1.3} decay={decay} intensity={intensity} angle={0.5} ref={spotLightRef9} />
        <primitive object={lightMemo9.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo10} position={[0, -0.7, 1]} distance={1.4} decay={decay} intensity={intensity} angle={0.5} ref={spotLightRef10} />
        <primitive object={lightMemo10.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo11} position={[-1.2, -0.7, 0]} distance={1.3} decay={decay} intensity={intensity} angle={0.5} ref={spotLightRef11} />
        <primitive object={lightMemo11.target} position={lightTargetPosition2}  />

        <primitive object={lightMemo12} position={[1.2, -0.7, 0]} distance={1.3} decay={decay} intensity={intensity} angle={0.5} ref={spotLightRef12} />
        <primitive object={lightMemo12.target} position={lightTargetPosition2}  />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, 1, 1]}
          position={[0, -0.6, 0]}
          geometry={nodes.emerald_mesh.geometry}
          material={materials.Jewel1}
          onPointerOver={(e) => {
            e.stopPropagation()
            setIsHovered(true)
          }}
          onPointerOut={() => setIsHovered(false)}
        >
          <Edges
            visible={isHovered}
            scale={1}
            threshold={5} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
            color="white"
          />
        </mesh>
      </group>
    </>
  )
}

export default TheJewel
