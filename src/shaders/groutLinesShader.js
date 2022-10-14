import * as THREE from "three"

const groutLinesShader = {
    uniforms: {
      iTime: { type: "f", value: 0 },
      iResolution:  { value: new THREE.Vector3(100, 100, 100) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
    #include <common>

    uniform vec3 iResolution;
    uniform float iTime;

    // By iq: https://www.shadertoy.com/user/iq
    // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;

        // Time varying pixel color
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

        // Output to screen
        fragColor = vec4(col,1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `,
    wireframe: false,

  }
  
  export { groutLinesShader }
  