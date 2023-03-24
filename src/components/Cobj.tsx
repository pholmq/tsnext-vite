import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { folder, useControls, button } from "leva";
import celestialSettings from "../settings/celestial-settings.json"
import miscSettings from "../settings/misc-settings.json";
import { useStore } from "../store";
import { Vector3 } from "three";

import { Orbit } from "./Orbit";
import { Planet } from "./Planet";
import { Earth } from "./Earth";

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
  }

export const Cobj = ({name, children}: Props) => {
    const cName: string = name;
  //REMINDER to self: DONT FORGET PLANET TILT OF EARTH tilt and tiltb
  // Cobj = Celestial Object
  //console.log(name + " rendered");
  
  //Get the settings for this object and merge
  const cSettings: any = celestialSettings[name as keyof typeof celestialSettings];
  const aSettings: any = miscSettings[name as keyof typeof miscSettings];
//   const { [name]: aSettings } = miscSettings;
  const s: Settings = { ...cSettings, ...aSettings };

  const containerRef: any = useRef();
  const pivotRef: any = useRef();
  const orbitRef: any = useRef();

  //const _vector = new Vector3();
  function printPositions() {
    const worldPosVec = new Vector3();
    const worldDirVec = new Vector3();

    containerRef.current.getWorldPosition(worldPosVec);
    containerRef.current.getWorldDirection(worldDirVec);
    console.log(`${name} group
    World position
    x : ${worldPosVec.x}
    y : ${worldPosVec.y}
    z : ${worldPosVec.z}
    World direction
    x : ${worldDirVec.x}
    y : ${worldDirVec.y}
    z : ${worldDirVec.z}
    `);
    pivotRef.current.getWorldPosition(worldPosVec);
    pivotRef.current.getWorldDirection(worldDirVec);
    console.log(`${name} Sphere
    World position
    x : ${worldPosVec.x}
    y : ${worldPosVec.y}
    z : ${worldPosVec.z}
    World direction
    x : ${worldDirVec.x}
    y : ${worldDirVec.y}
    z : ${worldDirVec.z}
    `);
  }

  //  useControls(s.orbitRadius)
  const {
    startPos,
    speed,
    orbitRadius,
    orbitCentera,
    orbitCenterb,
    orbitCenterc,
    orbitTilta,
    orbitTiltb
  } = useControls(
    "Celestial settings",
    {
      [name]: folder({
        startPos: {
          value: s.startPos
        },
        speed: {
          value: s.speed
        },
        orbitRadius: {
          value: s.orbitRadius,
          min: 0
        },
        orbitCentera: {
          value: s.orbitCentera
        },
        orbitCenterb: {
          value: s.orbitCenterb
        },
        orbitCenterc: {
          value: s.orbitCenterc
        },
        orbitTilta: {
          value: s.orbitTilta
        },
        orbitTiltb: {
          value: s.orbitTiltb
        },
        printPosToConsole: button(() => {
          printPositions();
        })
      })
    },
    
    // {options : { collapsed : true }}
    { collapsed: true }
  );

  const containerPos = s.containerPos ? s.containerPos : 0;
  // let pos = 0;
  //  const pos = useStore((state) => state.pos);
  const posRef: any = useStore((state) => state.posRef);
  useFrame(() => {
    // const pos = posx.current;
    //pos += 0.01;
    // console.log(MathUtils.lerp(orbitRef.current.rotation.y, posRef.current - startPos * (Math.PI / 180, 0.5))
    // console.log(orbitRef.current.rotation.y)

    orbitRef.current.rotation.y =
      speed * posRef.current - startPos * (Math.PI / 180);
  });

  return (
    <group
      name="Container"
      ref={containerRef}
      position={[orbitCentera, orbitCenterc, orbitCenterb]}
      rotation={[
        orbitTilta * (Math.PI / 180),
        -containerPos * (Math.PI / 180),
        orbitTiltb * (Math.PI / 180)
      ]}
    >
      {orbitRadius && (
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
      )}
      <group name="Orbit" ref={orbitRef}>
        <group name="Pivot" ref={pivotRef} position={[orbitRadius, 0, 0]}>
          {s.axesHelper && <axesHelper args={[10]} />}
          {s.earth && <Earth {...s} />}
          {s.type === "planet" && <Planet {...s} />}
          {children}
        </group>
      </group>
    </group>
  );
}
