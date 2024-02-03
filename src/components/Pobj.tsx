import { useRef, useEffect, useLayoutEffect } from "react";

import celestialSettings from "../settings/celestial-settings.json";
import miscSettings from "../settings/misc-settings.json";
import { usePlotStore, useTraceStore } from "../store";

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
  traceable?: boolean;
};

export const Pobj = ({ name, children }: Props) => {
  //Pobject is used with PlotSolarSystem to plot planet positions
  const cName: string = name;
  //REMINDER to self: DONT FORGET PLANET TILT OF EARTH tilt and tiltb
  // Cobj = Celestial Object

  //Get the settings for this object and merge
  const cSettings: any =
    celestialSettings[name as keyof typeof celestialSettings];
  const aSettings: any = miscSettings[name as keyof typeof miscSettings];
  const s: Settings = { ...cSettings, ...aSettings };

  const containerRef: any = useRef();
  const pivotRef: any = useRef();
  const orbitRef: any = useRef();
  const objRef: any = useRef();

  const containerPos = s.containerPos ? s.containerPos : 0;

  useLayoutEffect(() => {
    usePlotStore.setState((state) => ({
      plotObjects: [
        ...state.plotObjects,
        {
          name: s.name,
          speed: s.speed,
          startPos: s.startPos,
          orbitRef: orbitRef,
          pivotRef: pivotRef,
        },
      ],
    }));
    if (s.traceable) {
      useTraceStore.setState((state) => ({
        traceableObjects: {
          ...state.traceableObjects,
          name: s.name,
        },
      }));
      console.log(useTraceStore.getState().traceableObjects);
    }
  }, []);

  return (
    <>
      <group
        visible={false}
        name="Container"
        ref={containerRef}
        position={[s.orbitCentera, s.orbitCenterc, s.orbitCenterb]}
        rotation={[
          s.orbitTilta * (Math.PI / 180),
          -containerPos * (Math.PI / 180),
          s.orbitTiltb * (Math.PI / 180),
        ]}
      >
        <group name="Orbit" ref={orbitRef}>
          <group name="Pivot" ref={pivotRef} position={[s.orbitRadius, 0, 0]}>
            <mesh scale={1}>
              {s.type === "planet" || s.earth ? (
                <mesh ref={objRef}>
                  <sphereGeometry args={[s.size, 128, 128]} />
                  <meshStandardMaterial color={s.color} />
                </mesh>
              ) : null}
            </mesh>
            {children}
          </group>
        </group>
      </group>
    </>
  );
};
