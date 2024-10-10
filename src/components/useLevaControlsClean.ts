import { useStore, useTraceStore } from "../store";
import { folder, useControls } from "leva";
import { speedFactOpts } from "../utils/time-date-functions";
import { useCallback, useRef } from "react";
import miscSettings from "../settings/misc-settings.json";

export const useLevaControls = () => {
  const planetsArray = miscSettings.filter(item => item.planet).map(item => item.name);

  const speedmultiplier = useStore(s => s.speedmultiplier);
  const speedFact = useStore(s => s.speedFact);
  const stepMultiplier = useTraceStore(s => s.stepMultiplier);
  const stepFact = useTraceStore(s => s.stepFact);

  const getControlValue = (storeFn, key) => storeFn.getState()[key];

  const [values, setControls] = useControls(() => ({
    "⏲️ 1 sec/step equals": {
      value: speedmultiplier,
      step: 1,
      onChange: (v) => useStore.setState({ speedmultiplier: v }),
    },
    "⏳ Speed factor": {
      value: speedFact,
      options: speedFactOpts,
      onChange: (v) => useStore.setState({ speedFact: v }),
    },
    "🚀 Target planets": {
      value: getControlValue(useStore, "cameraTarget"),
      options: planetsArray,
      onChange: (v) => useStore.setState({ cameraTarget: v }),
    },
    "🔄 Orbits": {
      value: getControlValue(useStore, "orbits"),
      onChange: (v) => useStore.setState({ orbits: v }),
    },
    Trace: {
      value: getControlValue(useStore, "trace"),
      onChange: (v) => useStore.setState({ trace: v }),
    },
    "⚙️ Trace settings": folder({
      "🔘 Dotted line": {
        value: getControlValue(useStore, "traceDots"),
        onChange: (v) => useStore.setState({ traceDots: v }),
      },
      "📏 Line width": {
        value: getControlValue(useTraceStore, "traceLinewidth"),
        min: 1,
        max: 10,
        step: 1,
        onChange: (v) => useTraceStore.setState({ traceLinewidth: v }),
      },
      "📐 Trace length": {
        value: getControlValue(useTraceStore, "traceLength"),
        min: 1,
        max: 10000,
        step: 1,
        onChange: (v) => useTraceStore.setState({ traceLength: v }),
      },
      "⏩ 1 step equals": {
        value: stepMultiplier,
        min: 1,
        step: 1,
        onChange: (v) => useTraceStore.setState({ stepMultiplier: v }),
      },
      "🔄 Step factor": {
        value: stepFact,
        options: speedFactOpts,
        onChange: (v) => useTraceStore.setState({ stepFact: v }),
      },
      "⏱️ Update interval": {
        value: getControlValue(useTraceStore, "traceInterval"),
        min: 1,
        max: 1000,
        step: 1,
        onChange: (v) => useTraceStore.setState({ traceInterval: v }),
      },
    }, { collapsed: true }),
    Camera: folder({
      "🎯 Target": {
        value: getControlValue(useStore, "cameraTarget"),
        options: planetsArray,
        onChange: (v) => useStore.setState({ cameraTarget: v }),
      },
      "👁️ Follow": {
        value: getControlValue(useStore, "cameraFollow"),
        onChange: (v) => useStore.setState({ cameraFollow: v }),
      },
      "📸 Planet camera": {
        value: getControlValue(useStore, "planetCamera"),
        onChange: (v) => useStore.setState({ planetCamera: v }),
      },
      "🪐 Show planet camera position": {
        value: getControlValue(useStore, "planetCameraHelper"),
        onChange: (v) => useStore.setState({ planetCameraHelper: v }),
      },
    }, { collapsed: true }),
    Planets: folder({
      "🌍 Planet sizes": {
        value: 1,
        min: -5,
        max: 5,
        step: 1,
      },
    }, { collapsed: true }),
    "⚙️ Orbit settings": folder({
      "🔄 Orbits": {
        value: getControlValue(useStore, "orbits"),
        onChange: (v) => useStore.setState({ orbits: v }),
      },
      "📏 Line width": {
        value: getControlValue(useStore, "orbitsLinewidth"),
        min: 1,
        max: 10,
        step: 1,
        onChange: (v) => useStore.setState({ orbitsLinewidth: v }),
      },
      "➡️ Arrows": {
        value: getControlValue(useStore, "arrows"),
        onChange: (v) => useStore.setState({ arrows: v }),
      },
      "📐 Arrow size": {
        value: getControlValue(useStore, "arrowScale"),
        min: 1,
        max: 5,
        step: 1,
        onChange: (v) => useStore.setState({ arrowScale: v }),
      },
    }, { collapsed: true }),
    "⚙️ App settings": folder({
      "📋 Menu at the right": {
        value: getControlValue(useStore, "menuRight"),
        onChange: (v) => useStore.setState({ menuRight: v }),
      },
      "📊 Show performance": {
        value: getControlValue(useStore, "showStats"),
        onChange: (v) => useStore.setState({ showStats: v }),
      },
    }, { collapsed: true }),
    "🪐 Celestial settings": folder({}, { collapsed: true }),
  }));

  const setControlsRef = useRef(setControls);
  setControlsRef.current = setControls;

  const updateControls = useCallback((updates: Partial<any>) => {
    setControlsRef.current(updates);
  }, []);

  return { values, updateControls };
};
