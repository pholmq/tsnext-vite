import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";
import { CelestialSphere } from "./CelestialSphere";
import { useFrame } from "@react-three/fiber";
import PlanetCamera from "./PlanetCamera";
import { ContextMenu } from "./ContextMenu";
import { PlanetRings } from "./PlanetRings"; // Import the PlanetRings component

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useStore((state) => state.posRef);

  const [hovered, setHover] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const [cameraTarget, setCameraTarget] = useState(false);

  useEffect(() => {
    if (cameraTarget) {
      useStore.setState({ cameraTarget: props.name });
      setCameraTarget(false);
    }
  }, [cameraTarget]);

  const rotationSpeed = props.rotationSpeed || 0;
  const rotationStart = props.rotationStart || 0;

  useFrame(() => {
    ref.current.rotation.y = rotationStart + rotationSpeed * posRef.current;
  });

  const tilt = props.tilt || 0;
  const tiltb = props.tiltb || 0;

  // Define ring parameters for planets with rings
  const ringParams: Record<string, { innerRadius: number; outerRadius: number; texture: string }> = {
    Saturn: { innerRadius: props.size + 0.5, outerRadius: props.size + 7.5, texture: "/textures/saturn_ring.jpg" },
    Jupiter: { innerRadius: props.size + 0.3, outerRadius: props.size + 4.6, texture: "/textures/jupiter_ring.jpg" },
    Uranus: { innerRadius: props.size + 0.4, outerRadius: props.size + 4.9, texture: "/textures/uranus_ring.jpg" },
    Neptune: { innerRadius: props.size + 0.4, outerRadius: props.size + 4.8, texture: "/textures/neptune_ring.jpg" },
  };

  return (
    <>
      <group rotation={[tiltb * (Math.PI / 180), 0, tilt * (Math.PI / 180)]}>
        {contextMenu ? (
          <ContextMenu
            setContextMenu={setContextMenu}
            setCameraTarget={setCameraTarget}
          />
        ) : (
          <PosWriter
            hovered={hovered}
            name={props.name}
            symbol={props.unicodeSymbol}
          />
        )}

        {props.name === "Earth" ? <CelestialSphere visible={false} /> : null}

        <mesh
          name={props.name}
          visible={props.visible}
          ref={ref}
          scale={1}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setHover(false);
          }}
          onContextMenu={(e: any) => {
            e.stopPropagation();
            setContextMenu(true);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setCameraTarget(true);
          }}
        >
          <sphereGeometry args={[props.size, 128, 128]} />
          {props.texture ? (
            <meshStandardMaterial map={useTexture([props.texture])[0]} />
          ) : (
            <meshStandardMaterial color={props.color} />
          )}

          {props.light && <pointLight intensity={3} />}

          {/* Add Rings for planets with rings */}
          {props.name in ringParams && (
            <PlanetRings
              innerRadius={ringParams[props.name].innerRadius}
              outerRadius={ringParams[props.name].outerRadius}
              planetSize={props.size}
              texture={ringParams[props.name].texture}
            />
          )}

          {props.name === "Earth" && <PlanetCamera />}
        </mesh>
      </group>
    </>
  );
}