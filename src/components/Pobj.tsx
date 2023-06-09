import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

// import { folder, useControls, button } from "leva";
import celestialSettings from "../settings/celestial-settings.json";
import miscSettings from "../settings/misc-settings.json";
import { useStore } from "../store";
// import { Vector3 } from "three";

// import { Orbit } from "./Orbit";
// import { Planet } from "./Planet";
// import { Earth } from "./Earth";

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

export const Pobj = ({ name, children }: Props) => {
  //Pobject is used with PlotSolarSystem to plot planet positions
  const cName: string = name;
  //REMINDER to self: DONT FORGET PLANET TILT OF EARTH tilt and tiltb
  // Cobj = Celestial Object
  //console.log(name + " rendered");

  //Get the settings for this object and merge
  const cSettings: any =
    celestialSettings[name as keyof typeof celestialSettings];
  const aSettings: any = miscSettings[name as keyof typeof miscSettings];
  //   const { [name]: aSettings } = miscSettings;
  const s: Settings = { ...cSettings, ...aSettings };

  const containerRef: any = useRef();
  const pivotRef: any = useRef();
  const orbitRef: any = useRef();
  const objRef: any = useRef();
  const containerPos = s.containerPos ? s.containerPos : 0;
  // let pos = 0;
  //  const pos = useStore((state) => state.pos);
  const plotPos: any = useStore((state) => state.plotPos);
  const { scene } = useThree();
  useEffect(() => {
    useStore.setState((state) => ({
      plotObjects: [...state.plotObjects, { name: s.name, obj: pivotRef.current }],
    }));
  }, []);

  useEffect(() => {
    orbitRef.current.rotation.y =
      s.speed * useStore.getState().plotPos - s.startPos * (Math.PI / 180);
    // if (s.type === "planet") {
    //   scene.updateMatrixWorld();
    //   const csPos = new Vector3();
    //   pivotRef.current.getWorldPosition(csPos);

    //   // scene.getObjectByName(name).getWorldPosition(csPos);
    //   console.log(
    //     "Positon of " +
    //       name +
    //       " is X: " +
    //       csPos.x +
    //       " Y: " +
    //       csPos.y +
    //       " Z: " +
    //       csPos.z
    //   );
    // }
    // console.log(useStore.getState().plotObjects)
  }, [plotPos]);

  // useFrame(() => {
  //     orbitRef.current.rotation.y =
  //       s.speed * useStore.getState().plotPos - s.startPos * (Math.PI / 180);
  //   });

  return (
    <>
      <group
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
              {s.type === "planet" ? (
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
