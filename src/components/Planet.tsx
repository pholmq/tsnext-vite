import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";
import { CelestialSphere } from "./CelestialSphere";
import { useFrame } from "@react-three/fiber";
import PlanetCamera from "./PlanetCamera";
import { ContextMenu } from "./ContextMenu";
import { PlanetRings } from "./PlanetRings";
import { useControls } from "leva";
import { addEffect } from "@react-three/fiber";
import { EffectsOnObj } from "./EffectsOnObj";
import { useLevaControls } from "./useLevaControls";

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useStore((state) => state.posRef);
  // const cameraTarget = useStore((state) => state.cameraTarget)
  const { updateControls } = useLevaControls();

  const [hovered, setHover] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  // const [cameraTarget, setCameraTarget] = useState(false);
  const cameraTarget: any = useStore((state) => state.cameraTarget);

  //Add the planet to the Planets meny
  useControls("Planets", {
    [props.name]: props.visible,
  });

  const rotationSpeed = props.rotationSpeed || 0;
  const rotationStart = props.rotationStart || 0;

  useFrame(() => {
    ref.current.rotation.y = rotationStart + rotationSpeed * posRef.current;
  });

  const tilt = props.tilt || 0;
  const tiltb = props.tiltb || 0;

  // Define ring parameters for planets with rings
  const ringParams: Record<
    string,
    { innerRadius: number; outerRadius: number; texture: string }
  > = {
    Saturn: {
      innerRadius: props.size + 0.7,
      outerRadius: props.size + 5,
      texture: "/textures/saturn_ring.jpg",
    },
    Jupiter: {
      innerRadius: props.size + 10,
      outerRadius: props.size + 1,
      texture: "/textures/jupiter_ring.jpg",
    },
    Uranus: {
      innerRadius: props.size + 0.4,
      outerRadius: props.size + 4.9,
      texture: "/textures/uranus_ring.jpg",
    },
    Neptune: {
      innerRadius: props.size + 1.8,
      outerRadius: props.size + 7,
      texture: "/textures/neptune_ring.png",
    },
  };

  // This could be done in settings (misc + celes)
  // "effects": ["lensflare", "comet-trail", ""]
  //
  // Determine the effect type based on the planet's name
  let effectType;
  if (props.name === "Sun") {
    effectType = "sunGlow";
  } else if (props.name === "Halley") {
    effectType = "cometTrail";
  }

  return (
    <>
      <group rotation={[tiltb * (Math.PI / 180), 0, tilt * (Math.PI / 180)]}>
        {contextMenu ? (
          <ContextMenu
            setContextMenu={setContextMenu}
            planetName={props.name}
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
            updateControls({ Target: props.name });
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
              texture={ringParams[props.name].texture}
            />
          )}

          {props.name === cameraTarget && (
            <PlanetCamera planetRadius={props.size} />
          )}
        </mesh>

        {/* Add particle effects based on the planet's name */}
        {effectType && (
          <EffectsOnObj effectType={effectType} position={[0, 0, 0]} />
        )}
      </group>
    </>
  );
}
