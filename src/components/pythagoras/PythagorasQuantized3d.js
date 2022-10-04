import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import './PythagorasQuantized.css'
import { /* useHelper, */ OrbitControls } from '@react-three/drei'
import TheJewel from './TheJewel'
import * as THREE from "three"

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

const CathetOrthogonal = ({isPointingUp, hypotenuseLength}) => {
  if(hypotenuseLength < 2)
    return null
  return (
    <>
      {[...Array(hypotenuseLength -2)].map((_, cathetNumber) =>
        <QuantumBlock
          key={'cathet' + cathetNumber + (isPointingUp ? 'y' : 'n') + 'length' + hypotenuseLength}
          position={[(isPointingUp ? (cathetNumber + 1) : 0), 0, (!isPointingUp ? (cathetNumber + 1) : 0)]}
          baseColor={cathetNumber % 2 === 0 ? '#CCC' : '#ABE'}
          hoverColor={cathetNumber % 2 === 0 ? 'hotpink' : 'teal'}
          delay={600 * cathetNumber}
        />
        )
      }
    </>
  )
}

const HypotenuseOrthogonal = ({hypotenuseLength}) => {
  return (
    <>
      {[...Array(hypotenuseLength)].map((_, hypNum) =>
        <QuantumBlock
          key={'hypotenuse' + hypNum + 'length' + hypotenuseLength}
          position={[hypotenuseLength - hypNum -1, 0, hypNum ]}
          baseColor={'#F66'}
          hoverColor={'#900'}
          delay={400 * hypNum}
       />
        )
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
          key={'c2' + blockCounter + 'hyp' + hypotenuseLength}
          position={[xCoord, 0, yCoord]}
          baseColor={isOnShorterLayer ? '#FF6' : '#FA4'}
          hoverColor={isOnShorterLayer ? '#637' : '#835'}
          delay={80 * blockCounter}
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

const FourtyFiveDegreeSquareInstanced = ({hypotenuseLength}) => {

  const [isAnimationRunning, setIsAnimationRunning] = useState(true)
  const elapsedMillisRef = useRef(0)
  const animationStartTimeRef = useRef(0)
  const animateDurationMillis = hypotenuseLength / 10 * 1000 + 700
  const singleBlockAnimationMillis = hypotenuseLength / 20 * 1000 + 300

  useEffect(()=> {
    setIsAnimationRunning(true)
    elapsedMillisRef.current = 0
    animationStartTimeRef.current = Date.now()
  }, [hypotenuseLength])

  const quantumBlocksArr = [];

  // Ahhhhhh, the Quantum Pythagorean Theorem !!!!!!!!!
  const totalBlocks = hypotenuseLength * (hypotenuseLength - 1) * 2;

  // Consider that each diagonal is a 2-for-1 which has an odd/even layer double stacked.
  const doubleStackedHypotenuseLength = hypotenuseLength + hypotenuseLength - 1

  let xCoord = hypotenuseLength -1;
  let yCoord = 1;
  let isOnShorterLayer = true;

  for(let hypotenuseLayer = 0; hypotenuseLayer < doubleStackedHypotenuseLength; hypotenuseLayer++){
    let currentDiagonalLength = (isOnShorterLayer ? hypotenuseLength - 1 : hypotenuseLength);
    for(let currentDiagonal = 1; currentDiagonal <= currentDiagonalLength; currentDiagonal++) {

      quantumBlocksArr.push(
        {
          xCoord,
          yCoord,
          baseColor: isOnShorterLayer ? '#FF6' : '#FA4',
          hoverColor: isOnShorterLayer ? '#637' : '#835',
        }
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

      if(currentDiagonal === currentDiagonalLength) {
        isOnShorterLayer = !isOnShorterLayer
      }
    }
  }

  const instanceRef = useRef()
  const transformMatrix = new THREE.Matrix4();

  useFrame(() => {
    if(!isAnimationRunning) {
      return
    }

    elapsedMillisRef.current = Date.now() - animationStartTimeRef.current

    if(elapsedMillisRef.current >= animateDurationMillis + singleBlockAnimationMillis) {
      setIsAnimationRunning(false)
    }

    for (let i = 0; i < totalBlocks; i++) {

      const secondsOffsetForCurrentBlock = i / totalBlocks * animateDurationMillis

      let percentageOfAnimation = 0

      if(elapsedMillisRef.current > secondsOffsetForCurrentBlock) {
        const secondsDiffSinceBlockAnimationStart = elapsedMillisRef.current - secondsOffsetForCurrentBlock
        percentageOfAnimation = secondsDiffSinceBlockAnimationStart / singleBlockAnimationMillis
      }

      if(percentageOfAnimation > 1) {
        percentageOfAnimation = 1
      }

      transformMatrix.makeScale(percentageOfAnimation, percentageOfAnimation, percentageOfAnimation)
      transformMatrix.setPosition(quantumBlocksArr[i].xCoord, 0, quantumBlocksArr[i].yCoord)

      instanceRef.current.setMatrixAt(i, transformMatrix)
    }
    instanceRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={instanceRef}
      args={[null, null, totalBlocks]}
      onPointerOver={(e) => {
        e.stopPropagation()
        // console.log('onOver' + e.instanceId)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        // console.log('onOut' + e.instanceId)
      }}
      onClick={(e) =>{
        e.stopPropagation()
        console.log('onClick: ' + e.instanceId)
      }}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshMatcapMaterial />
    </instancedMesh>
  )
}

const PronicSquareOrthogonal = ({isPointingUp, hypotenuseLength}) => {
  const totalBlocks = hypotenuseLength * (hypotenuseLength -1)
  const getColumnNumFromBlockNum = (blckNum) => Math.floor(blckNum / hypotenuseLength)
  const getCoordinateX = (blckNum) => isPointingUp ? (getColumnNumFromBlockNum(blckNum) * -1 - 1) : (blckNum - getColumnNumFromBlockNum(blckNum) * hypotenuseLength)
  const getCoordinateY = (blckNum) => isPointingUp ? (blckNum - getColumnNumFromBlockNum(blckNum) * hypotenuseLength) : (getColumnNumFromBlockNum(blckNum) * -1 - 1)
  
  return (
    <>
      {[...Array(totalBlocks)].map((_, blockNumber) =>
        <QuantumBlock
          key={'Pronic' + blockNumber + (isPointingUp ? 'y' : 'n') + 'totalBlocks' + totalBlocks}
          position={[getCoordinateX(blockNumber), 0, getCoordinateY(blockNumber)]}
          baseColor={blockNumber % 2 === 0 ? '#66A' : '#369'}
          hoverColor={blockNumber % 2 === 0 ? 'hotpink' : '#F63'}
          delay={160 * blockNumber}
        />
        )
      }
    </>
  )
}

const QuantumBlock = (props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const meshRef = useRef()
  const [delayFinished, setDelayFinished] = useState(false);
  const animateDurationAfterDelay = 300

  useEffect(()=> {
    const delayMillis = props.delay ? props.delay + animateDurationAfterDelay : 0

    let delayTimer = setTimeout(() => {
      setDelayFinished(true)
    }, delayMillis)
    return () => {
      clearTimeout(delayTimer);
    }
  }, [props.delay])

  const colorProps = useSpring({
    color: isHovered ? props.hoverColor : props.baseColor,
  })

  const scalePropsAfterDelay = useSpring({
    scale: isActive ? [0.7, 0.7, 0.7] : [1, 1, 1],
  })
  const scalePropsBeforeDelay = useSpring({
    delay: props.delay,
    config: { duration: animateDurationAfterDelay },
    from: { scale: [0, 0, 0] },
    to: { scale: [1, 1, 1] },
  })

  const scaleProps = delayFinished ? scalePropsAfterDelay : scalePropsBeforeDelay

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
      scale={scaleProps.scale}
      // castShadow
    >
      <boxBufferGeometry
        args={[1, 1, 1]}
      />
      <animated.meshMatcapMaterial
        color={colorProps.color}
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
      <spotLight position={[-4, 7, -4]} intensity={5.5} penumbra={1} /*castShadow*/ ref={spotLightRef} />
      <hemisphereLight args={[0xffffff, 0x080820, 1]} />
    </>
  )
}

const PythagorasQuantized3d = ({
  hypotenuseLength,
  isBluntCorners,
  isDiagonalHypotenuse,
}) => {
  hypotenuseLength = parseInt(hypotenuseLength)

  return (
    <Canvas
      className="Pythagoras-container-3d"
      camera={{ fov: 75, position: [0, 10, 0] }}
      // shadows
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


      <HypotenuseOrthogonal hypotenuseLength={hypotenuseLength} />
      <CathetOrthogonal isPointingUp={true} hypotenuseLength={hypotenuseLength} />
      <CathetOrthogonal isPointingUp={false} hypotenuseLength={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={true} hypotenuseLength={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={false} hypotenuseLength={hypotenuseLength} />
      <FourtyFiveDegreeSquareInstanced hypotenuseLength={hypotenuseLength} />
      <Plane />
    </Canvas>
  )
}

export default PythagorasQuantized3d
