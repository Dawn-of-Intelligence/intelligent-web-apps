import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
 
function AnimateTimer() {
   const [flip, setFlip] = useState(false);
   const { number } = useSpring({
      reset: true,
      reverse: !flip,
      from: { number: 0 },
      number: 60,
      delay: 2500,
      onRest: () => setFlip(!flip),
      config: {mass: 2, friction: 300}
   });
   return <animated.div>{number.to((n) => n.toFixed(2))}</animated.div>;
}
export default function SpecialSquares() {
   return (
      <div style={{ marginLeft: 500, marginTop: 200, tension: 100 }}>
         <AnimateTimer />
      </div>
   );
}