import React, { useState, useEffect } from 'react'
import { ReactComponent as IconUp } from './icon-up.svg'
import { useSpring, animated } from '@react-spring/web'
import './ScrollIndicator.css';

export default function ScrollIndicator() {
  const [isMouseOver, setIsMouseOver] = useState(false)

  const springDown = useSpring({
    reset: isMouseOver,
		from: {
			opacity: 0,
			top: '20px',
      left: '-20px',
      position: 'absolute',
		},
		to: {
			opacity: 1,
			top: '0px',
      left: '-20px',
      position: 'absolute',
		},
	})
	const springUp = useSpring({
    reset: isMouseOver,
		from: {
			opacity: 0,
			top: '-20px',
      position: 'absolute',
		},
		to: {
			opacity: 1,
			top: '0px',
      position: 'absolute',
		},
	})

  return (
     <div className='Scroll-indicator'>
      <span style={{ margin: 'auto', color: 'white', position: 'relative' }}>
        <animated.span style={springDown}>
          <IconUp style={{width: '15px', height: '15px'}} />
        </animated.span>
        <span style={{top: '-2px', position: 'relative'}}>
          <strong
            onMouseOver={()=>{
              setIsMouseOver(true)
            }}
            onMouseOut={()=>{
              setIsMouseOver(false)
            }}
          >Scroll
          </strong>
        </span>
        <animated.span style={springUp}>
          <IconUp style={{width: '15px', height: '15px', marginLeft: '5px', transform: 'rotate(180deg)'}} />
        </animated.span>
      </span>
     </div>
  );
}
