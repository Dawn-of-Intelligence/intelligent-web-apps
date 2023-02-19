import React, { useRef, useEffect, useMemo, useState } from 'react'
import './FlawInMathsCrownJewel.css'
import { useSpring, animated } from '@react-spring/web'
import { useIntersectionObserver } from '../../hooks/animationHooks'
import PythagorasQuantized3d from '../../components/pythagoras/PythagorasQuantized3d'
import SpecialSquares from '../../components/pythagoras/SpecialSquares'
import ScrollIndicator from '../../components/controls/ScrollIndicator'
import { Stats } from '@react-three/drei'

const FlawInMathsCrownJewel = () => {
  const intersectionThresholdsArrMemo = useMemo(() => [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], []);
  const [setDomNode, observerEntry] = useIntersectionObserver(null, intersectionThresholdsArrMemo)
  const triggerScrollRef = useRef();

  useEffect(() => {
    setDomNode(triggerScrollRef.current)
  }, [setDomNode]);

  const [hypotenuseLength, setHypotenuseLength] = useState(5);

  const midWindowSpring = useSpring({
    opacity: observerEntry.intersectionRatio,
  })

  return (
    <div className="App">
      <Stats showPanel={0} className="stats" />
      <div className="Pythagoras-introduction">
        <div>
          <form>
            <label>Hypotenuse Length</label>
            <input 
              type="text" 
              value={hypotenuseLength}
              onChange={(e) => {
                const newNumber = parseInt(e.target.value)
                if(!isNaN(newNumber) && newNumber < 50)
                  setHypotenuseLength(e.target.value)
              }}
            />
          </form>
        </div>
        <PythagorasQuantized3d hypotenuseLength={hypotenuseLength} />
      </div>

      <ScrollIndicator />

      <div className="Pythagoras-specialSquares">
        <div style={{height: '1px'}}></div>

        <h2>Points of Disection (Using a Fixed Divisor) Exist at Quasi Predictable Postitions Across all Squares, Ad Infinitum</h2>

 
        <div><SpecialSquares /></div>


      </div>
      <div className="Pythagorean-container" ref={triggerScrollRef}>
        <animated.div style={midWindowSpring}>
          The Pythagorean Theorem
          <br/>
          Intersection ratio of window: {observerEntry.intersectionRatio}

        </animated.div>
      </div>
      <div className="Pythagorean-pronics">
        Pythagoras and Pronics
      </div>
    </div>
  )
}

export default FlawInMathsCrownJewel
