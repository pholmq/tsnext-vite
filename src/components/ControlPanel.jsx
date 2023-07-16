// import styles from "./Controls.module.css";
import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import { button, folder, Leva, useControls } from "leva";
import { useStore } from "../store";
import {
  posToDate,
  posToTime,
  posToJulianDay,
  isValidDate,
  dateTimeToPos,
  isValidTime,
  isNumeric,
  julianDayTimeToPos,
  speedFactOptions,
} from "../utils/time-date-functions";
import { Stats } from "@react-three/drei";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Vector3 } from "three";
const ControlPanel = () => {
  const { posRef, plotPosRef, date, time, speedFact, run: running } = useStore();

  const { trace, toggleTrace } = useStore();

  const dateRef = useRef();
  const timeRef = useRef();
  const julianDayRef = useRef();

  useEffect(() => {
    dateRef.current.value = date;
    timeRef.current.value = time;
  }, [date, time, running]);

  useControls(() => ({
    Trace: {
      value: trace,
      // onChange: (v) => useStore.setState({ trace: v }),
      onChange: (v) => toggleTrace(),
    },
    Orbits: {
      value: useStore.getState().orbits,
      onChange: (v) => useStore.setState({ orbits: v }),
    },
    PlotPos: {
      value: 0,
      onChange: (v) => plotPosRef.current = v
    },
    "Print PlotPos": button(() => {
      const plotObjects = useStore.getState().plotObjects;
      plotObjects.forEach((plotObj) => {
        const csPos = new Vector3();
        plotObj.obj.getWorldPosition(csPos);
        console.log(plotObj.name + " X: " + csPos.x);
      });

      // console.log(useStore.getState().plotObjects);
    }),
    "Orbits line width": {
      value: useStore.getState().orbitsLinewidth,
      onChange: (v) => useStore.setState({ orbitsLinewidth: v }),
    },

    Arrows: {
      value: useStore.getState().arrows,
      onChange: (v) => useStore.setState({ arrows: v }),
    },
    "Arrow size": {
      value: useStore.getState().arrowScale,
      onChange: (v) => useStore.setState({ arrowScale: v }),
    },
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

      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          1 second equals
        </label>
        <select
          className="text-base text-white bg-gray-700 mr-8 rounded p-1"
          value={speedFact}
          onChange={(e) => {
            useStore.setState({ speedFact: Number(e.target.value) });
          }}
        >
          {speedFactOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 overflow-auto">
        <Leva
          fill
          hideCopyButton
          // collapsed
          titleBar={{ drag: false, filter: false, title: "Settings" }}
          theme={{
            colors: { highlight1: "#FFFFFF", highlight2: "#FFFFFF" },
          }}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
