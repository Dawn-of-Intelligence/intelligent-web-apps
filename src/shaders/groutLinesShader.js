const groutLinesShader = {
    uniforms: {
      dispFactor: { type: "f", value: 0 },
      u_time: { type: "f", value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif
      
      uniform vec2 u_resolution;
      uniform float u_time;
      varying vec2 vUv;
      
      vec3 colorA = vec3(0.949,0.141,0.912);
      vec3 colorB = vec3(1.000,0.833,0.224);
      vec3 colorC = vec3(0.700,1.0,0.224);
      
      
      void main() {
          vec3 color = vec3(0.0);
          vec3 coloredTime = vec3(0.0);
      
          float pct = abs(sin(u_time));
      
          // Mix uses pct (a value from 0-1) to mix the second half of the gradient.
          coloredTime = mix(colorC, colorB, pct);
          color = mix(colorA, coloredTime, vUv.x);
      
          gl_FragColor = vec4(color,1.0);
      }
    `,
    wireframe: false,

  }
  
  export { groutLinesShader }
  