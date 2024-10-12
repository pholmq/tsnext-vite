import { useRef, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function PlanetRings({ innerRadius, outerRadius, texture }) {
  const ringRef = useRef();
  const [ringTexture] = useTexture([texture]);

  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

    // Cast the UV attribute to BufferAttribute to access and modify it
    const uvAttribute = geometry.attributes.uv as THREE.BufferAttribute;

    // Loop through the UVs and modify them using getX, getY and setXY
    for (let i = 0; i < uvAttribute.count; i++) {
      const u = uvAttribute.getX(i);
      const v = uvAttribute.getY(i);

      // Compute angle and radial distance
      const angle = Math.atan2(v - 0.5, u - 0.5);  // Convert UV to angle
      const radius = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);  // Radial distance

      // Set the modified UV values using the setXY() method
      uvAttribute.setXY(i, (angle + Math.PI) / (2 * Math.PI), radius);
    }

    // Mark UV attribute as needing an update
    uvAttribute.needsUpdate = true;

    return geometry;
  }, [innerRadius, outerRadius]);

  // Shader material with fading effect based on distance
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: ringTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          // Sample the texture
          vec4 color = texture2D(uTexture, vUv);

          // Calculate the radial distance from an arbitrary point (0.4, 0.2) for testing
          float dist = distance(vUv, vec2(0.4, 0.2));

          // Fade alpha based on distance from center (inner and outer edges)
          float alpha = smoothstep(0.1, 0.99, dist) * smoothstep(0.8, 0.7, dist);

          // Apply the alpha fading
          gl_FragColor = vec4(color.rgb, color.a * alpha * 1.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [ringTexture]);

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={ringGeometry} />
      <primitive object={ringMaterial} />
    </mesh>
  );
}
