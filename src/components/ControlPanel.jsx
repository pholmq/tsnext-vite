// import styles from "./Controls.module.css";
import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import { button, buttonGroup, folder, Leva, useControls } from "leva";
import { usePlotStore, useStore, useTraceStore } from "../store";
import {
  posToDate,
  posToTime,
  posToJulianDay,
  isValidDate,
  dateTimeToPos,
  isValidTime,
  isNumeric,
  julianDayTimeToPos,
  speedFactOpts,
  speedFactOptions,
  sDay,
  dateToDays,
} from "../utils/time-date-functions";
import { Stats } from "@react-three/drei";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Vector3 } from "three";
const ControlPanel = () => {
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCollapsed(false);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const { posRef, date, time, speedFact, run: running } = useStore();

  const dateRef = useRef();
  const timeRef = useRef();
  const julianDayRef = useRef();

  useEffect(() => {
    dateRef.current.value = date;
    timeRef.current.value = time;
  }, [date, time, running]);

  useControls(() => ({
    "1 second equals": {
      value: speedFact,
      options: speedFactOpts,

      onChange: (v) => {
        useStore.setState({ speedFact: v });
      },
    },
    "Speed multiplier": {
      value: useStore.getState().speedmultiplier,
      min: -10,
      max: 10,
      step: 1,
      onChange: (v) => useStore.setState({ speedmultiplier: v }),
    },

    // "Reset (Go to 2000-06-21)": button(() => {}),
    // "Go to Today": button(() => {}),

    " ": buttonGroup({
      " >> Reset (Go to 2000-06-21) ": () => {
        posRef.current = 0;
        useStore.setState({ date: posToDate(posRef.current) });
        useStore.setState({ time: posToTime(posRef.current) });
      },
      // "  ": () => {},
      " >> Go to today ": () => {
        const todayPos =
          sDay *
          dateToDays(
            new Intl.DateTimeFormat("sv-SE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(Date.now())
          );
        posRef.current = todayPos;
        useStore.setState({ date: posToDate(posRef.current) });
        useStore.setState({ time: posToTime(posRef.current) });
      },
    }),

    Trace: {
      value: useStore.getState().trace,
      onChange: (v) => useStore.setState({ trace: v }),
    },
    "Trace settings": folder(
      {
        Dots: {
          value: useStore.getState().traceDots,
          onChange: (v) => useStore.setState({ traceDots: v }),
        },
        "Linewidth/dotsize": {
          value: useTraceStore.getState().traceLinewidth,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceLinewidth: v }),
        },
        "Trace length": {
          value: useTraceStore.getState().traceLength,
          min: 100,
          max: 10000,
          step: 100,
          onChange: (v) => useTraceStore.setState({ traceLength: v }),
        },
        "Trace step": {
          value: useTraceStore.getState().traceStepInput,
          min: 1,
          max: 10,
          step: 1,
          onChange: (v) => useTraceStore.setState({ traceStepInput: v }),
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
    "Celestial settings": folder({}, { collapsed: true }),
  }));

  function dateKeyDown(e) {
    if (e.key !== "Enter") {
      return;
    }
    if (!isValidDate(dateRef.current.value)) {
      dateRef.current.value = posToDate(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      dateRef.current.value,
      posToTime(posRef.current)
    );
  }

  function dateOnBlur(e) {
    if (!isValidDate(dateRef.current.value)) {
      dateRef.current.value = posToDate(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      dateRef.current.value,
      posToTime(posRef.current)
    );
  }
  function timeKeyDown(e) {
    if (e.key !== "Enter") {
      return;
    }
    if (!isValidTime(timeRef.current.value)) {
      timeRef.current.value = posToTime(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      posToDate(posRef.current),
      timeRef.current.value
    );
  }
  function timeOnBlur(e) {
    if (!isValidTime(timeRef.current.value)) {
      timeRef.current.value = posToTime(posRef.current);
      return;
    }
    posRef.current = dateTimeToPos(
      posToDate(posRef.current),
      timeRef.current.value
    );
  }
  return (
    <div className="flex flex-col max-h-[95vh] absolute top-0 m-1 w-80 bg-gray-900 opacity-80 rounded-md select-none">
      <h2 className=" font-cambria text-white text-4xl text-center italic font-bold">
        The TYCHOSIUM
      </h2>
      <div>
        <Stats className="mt-11 ml-3" />
        <div className="flex justify-end mr-1">
          <button
            className="bg-gray-700 text-white rounded ml-2 text-2xl p-2 px-4"
            onClick={() => {
              posRef.current -= speedFact;
              useStore.setState({ date: posToDate(posRef.current) });
              useStore.setState({ time: posToTime(posRef.current) });
            }}
          >
            <FaStepBackward />
          </button>
          <button
            className="bg-gray-700 text-white rounded ml-2 text-2xl p-2 px-4"
            onClick={() => {
              useStore.setState((state) => ({ run: !state.run }));
            }}
          >
            {running ? <FaPause /> : <FaPlay />}
          </button>
          <button className="bg-gray-700 text-white rounded ml-2 text-2xl p-2 px-4">
            <FaStepForward
              onClick={() => {
                posRef.current += speedFact;
                useStore.setState({ date: posToDate(posRef.current) });
                useStore.setState({ time: posToTime(posRef.current) });
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">Date:</label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={dateRef}
          onKeyDown={dateKeyDown}
          onBlur={dateOnBlur}
        />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          Time (UTC):
        </label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={timeRef}
          onKeyDown={timeKeyDown}
          onBlur={timeOnBlur}
        />
      </div>

      <div className="mt-2 overflow-auto">
        <Leva
          neverHide
          collapsed={{
            collapsed,
            onChange: (value) => {
              setCollapsed(value);
            },
          }}
          fill
          hideCopyButton
          // collapsed
          titleBar={{
            drag: false,
            filter: false,
            title: "Open/Close Controls",
          }}
          theme={{
            colors: { highlight1: "#FFFFFF", highlight2: "#FFFFFF" },
          }}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
