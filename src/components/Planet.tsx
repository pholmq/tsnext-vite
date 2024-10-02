import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";
import { CelestialSphere } from "./CelestialSphere";
import { useFrame } from "@react-three/fiber";
import PlanetCamera from "./PlanetCamera";
import { ContextMenu } from "./ContextMenu";
import { useLevaControls } from "./useLevaControls";

function PlanetTexture({ texture }) {
  const [planetTexture] = useTexture([texture]);
  return <meshStandardMaterial map={planetTexture} />;
}

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useStore((state) => state.posRef);
  // const [planetTexture] = useTexture([props.texture]);

  const [hovered, setHover] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const [cameraTarget, setCameraTarget] = useState(false);

  const { updateControls } = useLevaControls();

  useEffect(() => {
    if (cameraTarget) {
      useStore.setState({ cameraTarget: props.name });
      updateControls({ Target: props.name });
      setCameraTarget(false);
    }
  }, [cameraTarget]);

  const rotationSpeed = props.rotationSpeed || 0;
  const rotationStart = props.rotationStart || 0;
  useFrame(() => {
    ref.current.rotation.y = rotationStart + rotationSpeed * posRef.current;
    // cloudsRef.current.rotation.y -= 0.0001;
  });

  const tilt = props.tilt || 0;
  const tiltb = props.tiltb || 0;
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
          {/* <meshStandardMaterial map={planetTexture} /> */}
          {props.texture !== "" ? (
            <PlanetTexture texture={props.texture} />
          ) : (
            <meshStandardMaterial color={props.color} />
          )}
          {props.light ? <pointLight intensity={3} /> : null}

          {props.name === "Earth" ? <PlanetCamera /> : null}
          {props.name === cameraTarget ? <PlanetCamera /> : null}
        </mesh>
      </group>
    </>
  );
}
