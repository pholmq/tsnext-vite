import { useStore, useTraceStore, usePosStore } from "../store";
import { folder, useControls } from "leva";
import { speedFactOpts } from "../utils/time-date-functions";
import { useCallback, useEffect, useRef } from "react";
import miscSettings from "../settings/misc-settings.json";

export const useLevaControls = () => {
  const planetCameraArray = miscSettings
    .filter((item) => item.planetCamera)
    .map((item) => item.name);

  const speedFact = useStore((s) => s.speedFact);
  const speedmultiplier: number = useStore((s) => s.speedmultiplier);
  const stepMultiplier: number = useTraceStore((s) => s.stepMultiplier);
  const stepFact = useTraceStore((s) => s.stepFact);

  const [values, setControls] = useControls(() => ({
    "1 sec/step equals": {
      value: speedmultiplier,
      step: 1,
      onChange: (v) => useStore.setState({ speedmultiplier: v }),
    },
    "\u{000D}": {
      value: speedFact,
      options: speedFactOpts,

      onChange: (v) => {
        useStore.setState({ speedFact: v });
      },
    },

    Trace: {
      value: useStore.getState().trace,
      onChange: (v) => useStore.setState({ trace: v }),
    },
    "Trace settings": folder(
      {
        "Dotted line": {
          value: useStore.getState().traceDots,
          onChange: (v) => useStore.setState({ traceDots: v }),
        },
        "Line width": {
          value: useTraceStore.getState().traceLinewidth,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceLinewidth: v }),
        },
        "Trace length": {
          value: useTraceStore.getState().traceLength,
          min: 1,
          max: 10000,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceLength: v }),
        },
        // "Trace step": {
        //   value: useTraceStore.getState().traceStepInput,
        //   min: 1,
        //   step: 1,
        //   onChange: (v) => useTraceStore.setState({ traceStepInput: v }),
        // },

        "1 step equals": {
          value: stepMultiplier,
          min: 1,
          step: 1,
          onChange: (v) => useTraceStore.setState({ stepMultiplier: v }),
        },
        " ": {
          value: stepFact,
          options: speedFactOpts,

          onChange: (v) => {
            useTraceStore.setState({ stepFact: v });
          },
        },

        "Update interval": {
          value: useTraceStore.getState().traceInterval,
          min: 1,
          max: 1000,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceInterval: v }),
        },
      },
      { collapsed: true }
    ),

    Positions: folder(
      {
        // "Copy all positions to the clipboard": button(() => {
        //   getAllPositions()
        //   alert("!");
        // }),
        tip: {
          label: "Tip:",
          value: "Hover a planet to see its position",
          editable: false,
        },
        "Show positions": {
          value: useStore.getState().showPositions,
          onChange: (v) => useStore.setState({ showPositions: v }),
        },

        // "Planets:": { value: "", editable: false },
        // ...posMenuCheckboxes,
      },
      { collapsed: true }
    ),
    Camera: folder(
      {
        cameratip: {
          label: "Tip:",
          value: "Double click a planet to center the camera on it",
          editable: false,
        },

        Target: {
          value: useStore.getState().cameraTarget,
          // options: ["Earth", "Sun", "Mars"],
          options: planetCameraArray,
          onChange: (v) => {
            useStore.setState({ cameraTarget: v });
            // console.log(v);
          },
        },

        Follow: {
          value: useStore.getState().cameraFollow,
          onChange: (v) => useStore.setState({ cameraFollow: v }),
        },

        "Planet camera": {
          value: useStore.getState().planetCamera,
          onChange: (v) => useStore.setState({ planetCamera: v }),
        },
        "Show planet camera position": {
          value: useStore.getState().planetCameraHelper,
          onChange: (v) => useStore.setState({ planetCameraHelper: v }),
        },
      },
      { collapsed: true }
    ),
    Planets: folder(
      {
        "Planet sizes": {
          value: 1,
          min: -5,
          max: 5,
          step: 1,
        },
      },
      { collapsed: true }
    ),

    "Orbit settings": folder(
      {
        Orbits: {
          value: useStore.getState().orbits,
          onChange: (v) => useStore.setState({ orbits: v }),
        },
        Linewidth: {
          value: useStore.getState().orbitsLinewidth,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useStore.setState({ orbitsLinewidth: v }),
        },

        Arrows: {
          value: useStore.getState().arrows,
          onChange: (v) => useStore.setState({ arrows: v }),
        },
        "Arrow size": {
          value: useStore.getState().arrowScale,
          min: 1,
          max: 5,
          step: 1,
          onChange: (v) => useStore.setState({ arrowScale: v }),
        },
      },
      { collapsed: true }
    ),
    "App settings": folder(
      {
        "Menu at the right": {
          value: useStore.getState().menuRight,
          onChange: (v) => useStore.setState({ menuRight: v }),
        },
      },
      { collapsed: true }
    ),
    "Developer settings": folder(
      {
        "Show performance": {
          value: useStore.getState().showStats,
          onChange: (v) => useStore.setState({ showStats: v }),
        },
        Squashfactor: {
          value: useStore.getState().squashFactor,
          min: 1,
          max: 20,
          step: 1,
          onChange: (v) => useStore.setState({ squashFactor: v }),
        },

        "Parameters:": { value: "", editable: false },
        "Celestial settings": folder({}, { collapsed: true }),
      },
      { collapsed: true }
    ),
  }));

  // Store the setControls function in a ref to avoid unnecessary re-renders
  const setControlsRef = useRef(setControls);
  setControlsRef.current = setControls;

  // Create a function to update controls externally
  const updateControls = useCallback((updates: Partial<any>) => {
    setControlsRef.current(updates);
  }, []);

  return { values, updateControls };
};
