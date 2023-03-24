import styles from "./Controls.module.css";
import { useEffect, useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import { folder, Leva, useControls } from "leva";
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
import Playbtn from "./Playbtn";
import Forwardbtn from "./Forwardbtn";
import { Stats } from "@react-three/drei";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
const ControlsNew = () => {
  const posRef = useStore((state) => state.posRef);
  const date = useStore((state) => state.date);
  const time = useStore((state) => state.time);
  const speedFact = useStore((state) => state.speedFact);

  const running = useStore((state) => state.run);

  const dateRef = useRef();
  const timeRef = useRef();
  const julianDayRef = useRef();

  useEffect(() => {
    dateRef.current.value = date;
    timeRef.current.value = time;
  },[date, time, running])


  useControls(() => ({
    Orbits: {
      value: useStore.getState().orbits,
      onChange: (v) => useStore.setState({ orbits: v }),
    },
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
    <div className={styles.controls}>
      <h2 className={styles.header}>The TYCHOSIUM</h2>
      <div className={styles.control}>
        <Stats className={styles.stats} />
        <div className={styles.playbGroup}>
          <button
            className={styles.playb}
            onClick={() => {
              posRef.current -= speedFact;
              useStore.setState({ date: posToDate(posRef.current) });
              useStore.setState({ time: posToTime(posRef.current) });
          }}
          >
            <FaStepBackward className={styles.playbIcon} />
          </button>
          <button
            className={styles.playb}
            onClick={() => {
              useStore.setState((state) => ({ run: !state.run }));
            }}
          >
            {running ? (
              <FaPause className={styles.playbIcon} />
            ) : (
              <FaPlay className={styles.playbIcon} />
            )}
          </button>
          <button className={styles.playb}>
            <FaStepForward
              className={styles.playbIcon}
              onClick={() => {
                posRef.current += speedFact;
                useStore.setState({ date: posToDate(posRef.current) });
                useStore.setState({ time: posToTime(posRef.current) });
              
              }}
            />
          </button>
        </div>
      </div>

      <div className={styles.control}>
        <label>Date:</label>
        <input
          ref={dateRef}
          onKeyDown={dateKeyDown}
          onBlur={dateOnBlur}
        />
      </div>
      <div className={styles.control}>
        <label>Time (UTC):</label>
        <input ref={timeRef} onKeyDown={timeKeyDown} onBlur={timeOnBlur} />
      </div>

      <div className={styles.control}>
        <label>1 second equals</label>
        <select
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

      <div className={styles.controlLeva}>
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

export default ControlsNew;
