import React, { useRef, useEffect, useMemo } from 'react'
import './FlawInMathsCrownJewel.css'
import { useSpring, animated } from 'react-spring'
import { useIntersectionObserver } from '../../hooks/animationHooks'

const FlawInMathsCrownJewel = () => {
  const intersectionThresholdsArrMemo = useMemo(() => [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], []);
  const [setDomNode, observerEntry] = useIntersectionObserver(null, intersectionThresholdsArrMemo)
  const triggerScrollRef = useRef();

  useEffect(() => {
    setDomNode(triggerScrollRef.current)
  }, [setDomNode]);

  const midWindowSpring = useSpring({
    opacity: observerEntry.intersectionRatio,
  })

  return (
    <div className="App">
      <div className="App-body">
        A Flaw in Math's Crown Jewel, and the Opportunity
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
