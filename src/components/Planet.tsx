import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { HoverMenu } from "./HoverMenu";
import { CelestialSphere } from "./CelestialSphere";
import { useFrame } from "@react-three/fiber";
import { ContextMenu } from "./ContextMenu";
import { PlanetRings } from "./PlanetRings";
import { addEffect } from "@react-three/fiber";
import { useLevaControls } from "./useLevaControls";
import PlanetCamera from "./PlanetCamera";
import Clouds from "./Clouds";
import { PlanetDescription } from "./PlanetDescription";

export function Planet(props: any) {
  const planetRef: any = useRef();
  const posRef: any = useStore((state) => state.posRef);
  // const cameraTarget = useStore((state) => state.cameraTarget)
  const { updateControls } = useLevaControls();

  const [hovered, setHover] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const [planetInfo, setPlanetInfo] = useState(false);
  // const [cameraTarget, setCameraTarget] = useState(false);
  const cameraTarget: any = useStore((state) => state.cameraTarget);

  const rotationSpeed = props.rotationSpeed || 0;
  const rotationStart = props.rotationStart || 0;

  useFrame(() => {
    planetRef.current.rotation.y =
      rotationStart + rotationSpeed * posRef.current;
  });

  const tilt = props.tilt || 0;
  const tiltb = props.tiltb || 0;

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
            setPlanetInfo={setPlanetInfo}
            planetName={props.name}
          />
        ) : (
          <HoverMenu
            hovered={hovered}
            planetInfo={planetInfo}
            name={props.name}
            symbol={props.unicodeSymbol}
          />
        )}

        {planetInfo ? (
          <PlanetDescription
            planetName={props.name}
            setPlanetInfo={setPlanetInfo}
          />
        ) : null}

        {props.name === "Earth" ? <CelestialSphere visible={false} /> : null}

        <mesh
          name={props.name}
          visible={props.visible}
          ref={planetRef}
          scale={1}
          onPointerOver={(e) => {
            setHover(true);
          }}
          onPointerLeave={(e) => {
            setHover(false);
          }}
          onContextMenu={(e: any) => {
            setContextMenu(true);
          }}
          onDoubleClick={(e) => {
            //Bugfix. Triggerers a rerender of the system camera so that a doubleclick on a planet
            //thats already the target will retarget the camera
            updateControls({ Target: "SystemCenter" });
            updateControls({ Target: props.name });
          }}
        >
          <sphereGeometry args={[props.size, 128, 128]} />
          {props.texture ? (
            <meshStandardMaterial map={useTexture([props.texture])[0]} />
          ) : (
            <meshStandardMaterial color={props.color} />
          )}
          {/* Add clouds to Earth */}
          {props.name === "Earth" && <Clouds size={props.size} />}

          {props.light && <pointLight intensity={3} />}

          {/* Add Rings for planets with rings */}
          {props.rings && (
            <PlanetRings
              innerRadius={props.rings.innerRadius + props.size}
              outerRadius={props.rings.outerRadius + props.size}
              texture={props.rings.texture}
            />
          )}

          {props.name === cameraTarget && (
            <PlanetCamera planetRadius={props.size} />
          )}
        </mesh>
      </group>
    </>
  );
}
