import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";
import { Html } from "@react-three/drei";

import PlanetCamera from "./PlanetCamera";
import { CelestialSphere } from "./CelestialSphere";



export function Earth(props: any) {
  // console.log(props)

  const earthRef: any = useRef();
  const cloudsRef: any = useRef();
  const posRef: any = useStore((state) => state.posRef);

  const [cloudsMap, colorMap, bumpMap] = useTexture([
    "/textures/2k_earth_clouds.jpg",
    "/textures/8k_earth_daymap.jpg",
    "/textures/EarthBumpmap1024x512.png"
  ]);

  const [hovered, setHover] = useState(false);

  useFrame(() => {
    // earthRef.current.rotation.y -= 0.0005;
    // obj.planetObj.rotation.y = obj.rotationSpeed * pos
    earthRef.current.rotation.y = props.rotationSpeed * posRef.current;
    cloudsRef.current.rotation.y -= 0.0004;
  });
  return (
    <>
      <CelestialSphere tilt={props.tilt} tiltb={props.tiltb} visible={false} />
      {hovered && (
        <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planetLabel">Earth</div>
        </Html>
      )}
      <mesh
        name="Earth"
        ref={earthRef}
        scale={1}
        rotation={[
          props.tiltb * (Math.PI / 180),
          0,
          props.tilt * (Math.PI / 180)
        ]}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <sphereGeometry args={[props.size, 128, 128]} />
        {/* <meshPhongMaterial specularMap={specularMap} /> */}
        {/* <meshStandardMaterial
          map={colorMap}
          // bumpMap={bumpMap}
          // bumpScale={0.5}
          // normalMap={normalMap}
          metalness={0}
          roughness={1}
          // side={DoubleSide}
        /> */}
        <meshPhongMaterial map={colorMap} specular={0x404040} />
        <mesh ref={cloudsRef} scale={1}>
          <sphereGeometry args={[props.size + 0.03, 64, 64]} />
          <meshPhongMaterial
            map={cloudsMap}
            opacity={0.2}
            depthWrite={true}
            transparent={true}
            // side={DoubleSide}
          />
        </mesh>
        <PlanetCamera />
      </mesh>

      {/* <Sphere
        args={[props.size, 128, 128]}
        scale={1}
        ref={ref}
        // rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial map={colorMap} />
      </Sphere> */}
    </>
  );
}
