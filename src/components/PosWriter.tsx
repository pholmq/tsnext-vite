import { useStore, usePosStore } from "../store";
import { useControls } from "leva";
import miscSettings from "../settings/misc-settings.json";
import { useEffect, useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";

export default function PosWriter() {
  const showPositions = useStore((s) => s.showPositions);
  const runPosWriter = useStore((s) => s.runPosWriter);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const intervalRef = useRef(null);

  //Filter out the trackeable planets from the miscSettings
  const posPlanets = miscSettings
    .filter((item) => item.posTracked)
    .map((item) => item.name);
  //Create a leva checkbox object
  const checkboxes: any = {};
  posPlanets.forEach((item) => {
    checkboxes[item] = false;
  });
  //Defaults
  checkboxes.Sun = true;
  checkboxes.Mars = true;
  //Insert it into the leva controls
  const trackedPlanets = useControls("Positions", {
    "Planets:": { value: "", editable: false },
    ...checkboxes,
  });

  useEffect(() => {
    //Update the store when planets are selected/deselected (used by PosInfo)
    const trackedPlanetsArray = Object.entries(trackedPlanets)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);
    usePosStore.setState((s) => ({ trackedObjects: trackedPlanetsArray }));
  }, [trackedPlanets]);

  let positions: any = {};
  useEffect(() => {
    if (!showPositions) return;
    const tracked = usePosStore.getState().trackedObjects;
    for (const item of tracked) {
      positions = {
        ...positions,
        [item]: getRaDecDistance(item, scene),
      };
    }
    //Update the store with positions. This will trigger a rerender of PositionInfo
    usePosStore.setState((s) => ({ positions: positions }));
  }, [showPositions, trackedPlanets, runPosWriter]);

  useEffect(() => {
    if (!showPositions) return;
    if (!run) return;
    const tracked = usePosStore.getState().trackedObjects;
    intervalRef.current = setInterval(() => {
      for (const item of tracked) {
        positions = {
          ...positions,
          [item]: getRaDecDistance(item, scene),
        };
      }
      //Update the store with positions. This will trigger a rerender of PositionInfo
      usePosStore.setState((s) => ({ positions: positions }));
    }, 1000);
    return () => {
      // Cleanup code
      clearInterval(intervalRef.current);
    };
  }, [run, showPositions, trackedPlanets]);

  return null;
}
