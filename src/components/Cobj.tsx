import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { folder, useControls, button } from "leva";
import celestialSettings from "../settings/celestial-settings.json";
import miscSettings from "../settings/misc-settings.json";
import { useStore } from "../store";
import { Vector3 } from "three";

import { Orbit } from "./Orbit";
import { Planet } from "./Planet";
import { Earth } from "./Earth";
import { Pobj } from "./Pobj";

type Props = {
  name: string;
  children?: React.ReactNode;
};
type Settings = {
  color: string;
  type: string;
  visible: boolean;
  axesHelper: boolean;
  name: string;
  size: number;
  containerPos?: number;
  startPos: number;
  speed: number;
  rotationSpeed: number;
  tilt: number;
  tiltb: number;
  orbitRadius: number;
  orbitCentera: number;
  orbitCenterb: number;
  orbitCenterc: number;
  orbitTilta: number;
  orbitTiltb: number;
  arrows: boolean;
  reverseArrows: boolean;
  rotationArrows: number;
  earth: boolean;
};

export const Cobj = ({ name, children }: Props) => {
  const cSettings =
    celestialSettings[celestialSettings.findIndex((p) => p.name === name)];
  const aSettings =
    miscSettings[celestialSettings.findIndex((p) => p.name === name)];
  const s = { ...cSettings, ...aSettings };

  const containerRef: any = useRef();
  const pivotRef: any = useRef();
  const orbitRef: any = useRef();
  const {
    startPos,
    speed,
    orbitRadius,
    orbitCentera,
    orbitCenterb,
    orbitCenterc,
    orbitTilta,
    orbitTiltb,
  } = useControls("Celestial settings", {
    [name]: folder({
      startPos: {
        value: s.startPos,
      },
      speed: {
        value: s.speed,
      },
      orbitRadius: {
        value: s.orbitRadius,
        min: 0,
      },
      orbitCentera: {
        value: s.orbitCentera,
      },
      orbitCenterb: {
        value: s.orbitCenterb,
      },
      orbitCenterc: {
        value: s.orbitCenterc,
      },
      orbitTilta: {
        value: s.orbitTilta,
      },
      orbitTiltb: {
        value: s.orbitTiltb,
      },
    }),
  });

  const containerPos = s.containerPos ? s.containerPos : 0;

  const posRef: any = useStore((state) => state.posRef);

  useFrame(() => {
    orbitRef.current.rotation.y =
      speed * posRef.current - startPos * (Math.PI / 180);
  });

  return (
    <>
      {/* <Pobj name={name}></Pobj> */}
      <group
        name="Container"
        ref={containerRef}
        position={[orbitCentera, orbitCenterc, orbitCenterb]}
        rotation-x={orbitTilta * (Math.PI / 180)}
        rotation-z={orbitTiltb * (Math.PI / 180)}
      >
        {s.orbitRadius ? (
          <group rotation-x={-Math.PI / 2} visible={s.visible}>
            <Orbit
              radius={orbitRadius}
              color={s.color}
              lineWidth={2}
              arrows={s.arrows}
              reverse={s.reverseArrows}
              rotation={s.rotationArrows ? s.rotationArrows : 0}
            />
          </group>
        ) : null}
        <group name="Orbit" ref={orbitRef}>
          <group name="Pivot" ref={pivotRef} position={[orbitRadius, 0, 0]}>
            {s.axesHelper ? <axesHelper args={[10]} /> : null}
            {s.earth ? <Earth {...s} /> : null}
            {s.type === "planet" ? <Planet {...s} /> : null}
            {children}
          </group>
        </group>
      </group>
    </>
  );
};
