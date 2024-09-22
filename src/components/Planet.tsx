import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { Html, useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";
import { useControls } from "leva";
import { CelestialSphere } from "./CelestialSphere";
import { useFrame } from "@react-three/fiber";
import PlanetCamera from "./PlanetCamera";

function ContextMenu({ setContextMenu, setCameraTarget }) {
  return (
    <Html position={[0, 0, 0]}>
      <div
        // hidden={hovered || on ? false : true}
        className="m-1 text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <button
          className="m-1 hover:bg-sky-700"
          id="Focus"
          onClick={(e) => {
            setCameraTarget(true);
            // console.log((e.target as HTMLElement).id);
            setContextMenu(false);
          }}
        >
          Focus
        </button>
        <br />
        {/* <button
          onClick={() => {
            console.log("click");
            setContextMenu(false);
          }}
        >
          Trace&nbsp;on
        </button> */}
        <button
        className="m-1"
          onClick={() => {
            console.log("click");
            setContextMenu(false);
          }}
        >
          Close&nbsp;menu
        </button>

        {/* <label id="posLabel">Close&nbsp;menu</label> */}
      </div>
    </Html>
  );
}

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

  const traceOn = useStore((s) => s.trace);
  const cameraEarth = useStore((s) => s.cameraEarth);
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
          // rotation={[0, rotationStart, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHover(false);
            // setContextMenu(false);
          }}
          onContextMenu={(e) => {
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

          {props.name === "Earth" && cameraEarth ? <PlanetCamera /> : null}
        </mesh>
      </group>
    </>
  );
}
