import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated, a } from '@react-spring/three'
import './PythagorasQuantized.css'
import { /* useHelper, */ OrbitControls } from '@react-three/drei'
import TheJewel from './TheJewel'
import * as THREE from "three"
import { groutLinesShader } from '../../shaders/groutLinesShader'

const Plane = () => (
  <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, -0.5, 0]}
    receiveShadow
  >
    <planeBufferGeometry args={[500, 500]} />
    <meshMatcapMaterial color="white" />
  </mesh>
)

const CathetOrthogonal = ({isPointingUp, hypotenuseLength}) => {
  if(hypotenuseLength < 2)
    return null
  return (
    <>
      {[...Array(hypotenuseLength -1)].map((_, cathetNumber) =>
        <QuantumBlock
          key={'cathet' + cathetNumber + (isPointingUp ? 'y' : 'n') + 'length' + hypotenuseLength}
          position={[(isPointingUp ? (cathetNumber + 1) : 0), 0, (!isPointingUp ? (cathetNumber + 1) : 0)]}
          baseColor={cathetNumber % 2 === 0 ? '#666' : '#777'}
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
  const quantumBlocksComponentArr = [];

  // Consider that each diagonal is a 2-for-1 which has an odd/even layer double stacked.
  const doubleStackedHypotenuseLength = hypotenuseLength + hypotenuseLength - 1

  let xCoord = hypotenuseLength -1;
  let yCoord = 1;
  let blockCounter = 1;
  let isOnShorterLayer = true;
  for(let hypotenuseLayer = 0; hypotenuseLayer < doubleStackedHypotenuseLength; hypotenuseLayer++){
    let currentDiagonalLength = (isOnShorterLayer ? hypotenuseLength - 1 : hypotenuseLength);
    for(let currentDiagonal = 1; currentDiagonal <= currentDiagonalLength; currentDiagonal++) {
      quantumBlocksComponentArr.push(
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

  return <>{quantumBlocksComponentArr}</>
}

const FourtyFiveDegreeGroutLines = ({hypotenuseLength}) => {
  const meshRef = useRef()

  var shape = new THREE.Shape()

  const zigZags = hypotenuseLength + hypotenuseLength -3
  const fractionalMargin = 0.07
  const onePlusMargin = 1 + fractionalMargin

  // Start from the EAST equator and create the blunt corners.
  const firstStopEastX = hypotenuseLength - onePlusMargin
  const firstStopEastY = -1 + fractionalMargin
  shape.moveTo(firstStopEastX, firstStopEastY)
  const lastStopEastX = hypotenuseLength - onePlusMargin
  const lastStopEastY = 1 - fractionalMargin
  shape.lineTo(lastStopEastX, lastStopEastY)

  let xCoord = lastStopEastX
  let yCoord = lastStopEastY

  for(let i = 0; i < zigZags; i++) {
    if(i % 2 === 0)
      xCoord -= 1
    if(i % 2 !== 0)
      yCoord += 1
    shape.lineTo(xCoord, yCoord)
  }

  // North pole
  shape.lineTo(1 - fractionalMargin, hypotenuseLength - onePlusMargin)
  const lastStopNorthX = -1 + fractionalMargin
  const lastStopNorthY = hypotenuseLength - onePlusMargin
  shape.lineTo(lastStopNorthX, lastStopNorthY)

  xCoord = lastStopNorthX
  yCoord = lastStopNorthY

  for(let i = 0; i < zigZags; i++) {
    if(i % 2 !== 0)
      xCoord -= 1
    if(i % 2 === 0)
      yCoord -= 1
    shape.lineTo(xCoord, yCoord)
  }

  // West equator
  shape.lineTo(-hypotenuseLength + onePlusMargin, 1)
  const lastStopWestX = -hypotenuseLength + onePlusMargin
  const lastStopWestY = -1 + fractionalMargin
  shape.lineTo(lastStopWestX, lastStopWestY)

  xCoord = lastStopWestX
  yCoord = lastStopWestY

  for(let i = 0; i < zigZags; i++) {
    if(i % 2 === 0)
      xCoord += 1
    if(i % 2 !== 0)
      yCoord -= 1
    shape.lineTo(xCoord, yCoord)
  }

  // South pole
  shape.lineTo(-1, -hypotenuseLength + onePlusMargin)
  const lastStopSouthX = 1 - fractionalMargin
  const lastStopSouthY = -hypotenuseLength + onePlusMargin
  shape.lineTo(lastStopSouthX, lastStopSouthY)

  xCoord = lastStopSouthX
  yCoord = lastStopSouthY

  for(let i = 0; i < zigZags; i++) {
    if(i % 2 !== 0)
      xCoord += 1
    if(i % 2 === 0)
      yCoord += 1
    shape.lineTo(xCoord, yCoord)
  }

  // Return to the bottom blunt corner of the East equator.
  shape.lineTo(firstStopEastX, firstStopEastY)

  useFrame(({ clock }) => {
    meshRef.current.material.uniforms.iTime.value = clock.getElapsedTime()
  })
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[hypotenuseLength -0.5, 0.38, hypotenuseLength-0.5]}
      receiveShadow
    >
      <shapeBufferGeometry args={[shape]} />
      <shaderMaterial attach="material" args={[groutLinesShader]} side={THREE.DoubleSide} />
    </mesh>
  )
}

const FourtyFiveDegreeGroutLinesAnimated = ({hypotenuseLength}) => {
  const { y } = useSpring({ y: 0, from: { y: -3 }, reset: true })
  return (
    <a.group position-y={y}>
      <FourtyFiveDegreeGroutLines hypotenuseLength={hypotenuseLength} />
    </a.group>
  )
}

const FourtyFiveDegreeSquareInstanced = ({hypotenuseLength}) => {
  const [isAnimationRunning, setIsAnimationRunning] = useState(true)
  const elapsedMillisRef = useRef(0)
  const animationStartTimeRef = useRef(0)
  const animateDurationMillis = hypotenuseLength / 10 * 1000 + 700
  const singleBlockAnimationMillis = hypotenuseLength / 20 * 1000 + 300
  const cubeScale = 0.9

  useEffect(()=> {
    setIsAnimationRunning(true)
    elapsedMillisRef.current = 0
    animationStartTimeRef.current = Date.now()
  }, [hypotenuseLength])

  // Ahhhhhh, the Quantum Pythagorean Theorem !!!!!!!!!
  const totalBlocks = hypotenuseLength * (hypotenuseLength - 1) * 2;

  // Consider that each diagonal is a 2-for-1 which has an odd/even layer double stacked.
  const doubleStackedHypotenuseLength = hypotenuseLength + hypotenuseLength - 1

  let xCoord = hypotenuseLength -1
  let yCoord = 1
  let isOnShorterLayer = true
  let colorBrickOffset = 0
  let blockCounter = 1

  const fourtyFiveBlocksArr = [];

  for(let hypotenuseLayer = 0; hypotenuseLayer < doubleStackedHypotenuseLength; hypotenuseLayer++){
    let currentDiagonalLength = (isOnShorterLayer ? hypotenuseLength - 1 : hypotenuseLength);
    for(let currentDiagonal = 1; currentDiagonal <= currentDiagonalLength; currentDiagonal++) {

      let isOnOppositeQuadrant
      // Figure out how many bricks to skip at the START and END of drawing a diagonal line.
      if(currentDiagonal <= colorBrickOffset || (currentDiagonalLength - currentDiagonal) < colorBrickOffset)
        isOnOppositeQuadrant = false
      else
        isOnOppositeQuadrant = true

      // The number of bricks "skipped" from the Start/End edges inverts past the half way point.
      // At first you start skipping and additional brick and the tail/end of the diagonal after rounding a short diagonal.
      // Past half way you start decrementing the number of bricks to skip after rounding a long diagonal.
      if(isOnShorterLayer && currentDiagonal === currentDiagonalLength && blockCounter < totalBlocks / 2)
        colorBrickOffset++
      if(!isOnShorterLayer && currentDiagonal === currentDiagonalLength && blockCounter > totalBlocks / 2)
        colorBrickOffset--

      fourtyFiveBlocksArr.push(
        {
          xCoord,
          yCoord,
          isOnOppositeQuadrant,
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

      blockCounter++
    }
  }

  const instanceRefOdd = useRef()
  const instanceRefEven = useRef()
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

      const millisOffsetForCurrentBlock = i / totalBlocks * animateDurationMillis

      let percentageOfAnimation = 0

      if(elapsedMillisRef.current > millisOffsetForCurrentBlock) {
        const secondsDiffSinceBlockAnimationStart = elapsedMillisRef.current - millisOffsetForCurrentBlock
        percentageOfAnimation = secondsDiffSinceBlockAnimationStart / singleBlockAnimationMillis
      }

      if(percentageOfAnimation > cubeScale) {
        percentageOfAnimation = cubeScale
      }

      transformMatrix.makeScale(percentageOfAnimation, percentageOfAnimation, percentageOfAnimation)
      transformMatrix.setPosition(fourtyFiveBlocksArr[i].xCoord, 0, fourtyFiveBlocksArr[i].yCoord)

      if(fourtyFiveBlocksArr[i].isOnOppositeQuadrant)
        instanceRefOdd.current.setMatrixAt(i, transformMatrix)
      else
        instanceRefEven.current.setMatrixAt(i, transformMatrix)
    }
    instanceRefOdd.current.instanceMatrix.needsUpdate = true
    instanceRefEven.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh
        castShadow
        ref={instanceRefOdd}
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
        <meshMatcapMaterial color="#dddddd" />
      </instancedMesh>
      <instancedMesh
        ref={instanceRefEven}
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
        <meshMatcapMaterial color="#ddccaa" />
      </instancedMesh>
    </>
  )
}

const PronicSquareOrthogonal = ({isPointingUp, hypotenuseLength}) => {
  const totalBlocks = hypotenuseLength * (hypotenuseLength -1)
  const getColumnNumFromBlockNum = (blckNum) => Math.floor(blckNum / hypotenuseLength)
  const getCoordinateX = (blckNum) => isPointingUp ? (getColumnNumFromBlockNum(blckNum) * -1 - 1) : (blckNum - getColumnNumFromBlockNum(blckNum) * hypotenuseLength)
  const getCoordinateY = (blckNum) => isPointingUp ? (blckNum - getColumnNumFromBlockNum(blckNum) * hypotenuseLength) : (getColumnNumFromBlockNum(blckNum) * -1 - 1)
  
  const colorA = '#66A';
  const colorB = '#369';

  const getColorPronicBlock = (blockNumber) => {
    if(isPointingUp) {
      if(hypotenuseLength % 2 === 0) {
        if(getCoordinateX(blockNumber) % 2 === 0) {
          return blockNumber % 2 === 0 ? colorA : colorB;
        }
        return blockNumber % 2 !== 0 ? colorA : colorB;
      }
      return blockNumber % 2 !== 0 ? colorA : colorB
    }
    else {
      if(hypotenuseLength % 2 === 0) {
        if(getCoordinateY(blockNumber) % 2 === 0) {
          return blockNumber % 2 === 0 ? colorA : colorB;
        }
        return blockNumber % 2 !== 0 ? colorA : colorB;
      }
      return blockNumber % 2 !== 0 ? colorA : colorB
    }
  }

  return (
    <>
      {[...Array(totalBlocks)].map((_, blockNumber) =>
        <QuantumBlock
          key={'Pronic' + blockNumber + (isPointingUp ? 'y' : 'n') + 'totalBlocks' + totalBlocks}
          position={[getCoordinateX(blockNumber), 0, getCoordinateY(blockNumber)]}
          baseColor={getColorPronicBlock(blockNumber)}
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
    scale: isActive ? [0.5, 0.5, 0.5] : [1, 1, 1],
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


      {/* <HypotenuseOrthogonal hypotenuseLength={hypotenuseLength} /> */}
      <CathetOrthogonal isPointingUp={true} hypotenuseLength={hypotenuseLength} />
      <CathetOrthogonal isPointingUp={false} hypotenuseLength={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={true} hypotenuseLength={hypotenuseLength} />
      <PronicSquareOrthogonal isPointingUp={false} hypotenuseLength={hypotenuseLength} />
      <FourtyFiveDegreeSquareInstanced hypotenuseLength={hypotenuseLength} />
      <FourtyFiveDegreeGroutLinesAnimated hypotenuseLength={hypotenuseLength} />
      <Plane />
    </Canvas>
  )
}

export default React.memo(PythagorasQuantized3d)
