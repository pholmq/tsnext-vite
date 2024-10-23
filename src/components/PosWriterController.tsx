import { usePosStore } from "../store";
import { useControls } from "leva";
import miscSettings from "../settings/misc-settings.json";
import { useEffect } from "react";

export default function PosWriterController() {
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
  //Put selected planets into an array.
  // const trackedPlanetsArray = Object.entries(trackedPlanets)
  //   .filter(([_, value]) => value === true)
  //   .map(([key, _]) => key);
  // usePosStore.setState((s) => ({ trackedObjects: trackedPlanetsArray }));

  // console.table(usePosStore.getState().trackedObjects);

  useEffect(() => {
    //Update the store when planets are selected/deselected (used by poswriter and PosInfo)
    const trackedPlanetsArray = Object.entries(trackedPlanets)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);
    usePosStore.setState((s) => ({ trackedObjects: trackedPlanetsArray }));
    // console.table(usePosStore.getState().trackedObjects);
  }, [trackedPlanets]);

  return null;
}
