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

const CathetOrthogonal = ({isPointingUp, length}) => {
  return (
    <>
      {[...Array(length -2)].map((_, cathetNumber) =>
        <QuantumBlock
          key={'cathet' + cathetNumber + isPointingUp ? 'y' : 'n'}
          position={[(isPointingUp ? (cathetNumber + 1) : 0), 0, (!isPointingUp ? (cathetNumber + 1) : 0)]}
          baseColor={cathetNumber % 2 === 0 ? '#CCC' : '#ABE'}
          hoverColor={cathetNumber % 2 === 0 ? 'hotpink' : 'teal'}
        />)
      }
    </>
  )
}

const HypotenuseOrthogonal = ({length}) => {
  return (
    <>
      {[...Array(length)].map((_, hypotenuseNumber) =>
        <QuantumBlock
          key={'hypotenuse' + hypotenuseNumber}
          position={[length - hypotenuseNumber -1, 0, hypotenuseNumber ]}
          baseColor={'#F66'}
          hoverColor={'#900'}
        />)
      }
    </>
  )
}

const FourtyFiveDegreeSquare = ({hypotenuseLength}) => {
  const quantumBlocksArr = [];

  // Consider that each diagonal is a 2-for-1 which has an odd/even layer double stacked.
  const doubleStackedHypotenuseLength = hypotenuseLength + hypotenuseLength - 1

  let xCoord = hypotenuseLength -1;
  let yCoord = 1;
  let blockCounter = 1;
  let isOnShorterLayer = true;
  for(let hypotenuseLayer = 0; hypotenuseLayer < doubleStackedHypotenuseLength; hypotenuseLayer++){
    let currentDiagonalLength = (isOnShorterLayer ? hypotenuseLength - 1 : hypotenuseLength);
    for(let currentDiagonal = 1; currentDiagonal <= currentDiagonalLength; currentDiagonal++) {

      quantumBlocksArr.push(
        <QuantumBlock
          key={'c^2' + blockCounter}
          position={[xCoord, 0, yCoord]}
          baseColor={isOnShorterLayer ? '#FF6' : '#FA4'}
          hoverColor={isOnShorterLayer ? '#637' : '#835'}
        />
      )

      if(currentDiagonal === currentDiagonalLength) {
        yCoord++
      }
      else if(isOnShorterLayer) {
        xCoord--
        yCoord++
      }
      else if(!isOnShorterLayer) {
        xCoord++
        yCoord--
      }

      blockCounter++

      if(currentDiagonal === currentDiagonalLength) {
        isOnShorterLayer = !isOnShorterLayer
      }
    }
  }

  return <>{quantumBlocksArr}</>
}

const PronicSquareOrthogonal = ({isPointingUp, length}) => {
  const totalBlocks = length * (length -1)
  const getColumnNumFromBlockNum = (blckNum) => Math.floor(blckNum / length)
  const getCoordinateX = (blckNum) => isPointingUp ? (getColumnNumFromBlockNum(blckNum) * -1 - 1) : (blckNum - getColumnNumFromBlockNum(blckNum) * length)
  const getCoordinateY = (blckNum) => isPointingUp ? (blckNum - getColumnNumFromBlockNum(blckNum) * length) : (getColumnNumFromBlockNum(blckNum) * -1 - 1)
  return (
    <>
      {[...Array(totalBlocks)].map((_, blockNumber) => {
          return (<QuantumBlock
            key={'Pronic' + blockNumber + isPointingUp ? 'y' : 'n'}
            position={[getCoordinateX(blockNumber), 0, getCoordinateY(blockNumber)]}
            baseColor={blockNumber % 2 === 0 ? '#66A' : '#369'}
            hoverColor={blockNumber % 2 === 0 ? 'hotpink' : '#F63'}
          />)
        }
      )}
    </>
  )
}

const QuantumBlock = (props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const meshRef = useRef()
  const springProps = useSpring({
    scale: isActive ? [0.7, 0.7, 0.7] : [1, 1, 1],
    color: isHovered ? props.hoverColor : props.baseColor,
  })
 
  return (
    <animated.mesh
      {...props}
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        setIsActive(!isActive)
      }}
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
  // hypotenuseLength,
  isBluntCorners,
  isDiagonalHypotenuse,
}) => {

  const hypotenuseLength = 7

  return (
    <Canvas
      className="Pythagoras-container-3d"
      shadows
    >
      <fog attach="fog" args={['white', 50, 120]} />    
      <SceneLights />
      <TheJewel />
      <OrbitControls
        // autoRotate
        maxPolarAngle={Math.PI / 2.25}
        // minPolarAngle={Math.PI / 3}
        enableDamping
        dampingFactor = {0.1}
        enablePan={true}
       />


      <HypotenuseOrthogonal length={hypotenuseLength} />
      <CathetOrthogonal isPointingUp={true} length={hypotenuseLength} />
      <CathetOrthogonal isPointingUp={false} length={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={true} length={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={false} length={hypotenuseLength} />
      <FourtyFiveDegreeSquare hypotenuseLength={hypotenuseLength} />
      <Plane />
    </Canvas>
  )
}

export default PythagorasQuantized3d
